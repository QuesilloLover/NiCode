from channels.generic.websocket import AsyncWebsocketConsumer
import json
from sortedcontainers import SortedList
from .models import Room, RoomHistory
from users.models import CustomUser
from asgiref.sync import async_to_sync, sync_to_async


class MatchmakingConsumer(AsyncWebsocketConsumer):
    user_queue = SortedList(key=lambda x: x['elo_rating'])  # Queue sorted by Elo
    async def connect(self):
        self.room_name = 'queue'
        await self.channel_layer.group_add(
            self.room_name, self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)


    # Matchmaking logic
    async def receive(self, text_data):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        user = await self.get_user(self.user_id)  # Fetch user from DB
        elo_rating = user.elo_rating

        if not any(u['user_id'] == self.user_id for u in self.user_queue):
            self.user_queue.add({'user_id': self.user_id, 'elo_rating': elo_rating})

        await self.channel_layer.send(
            self.room_name,
            {
                'type': 'message',
                'text': json.dumps({'user_id': self.user_id, 'message': 'You have been added to the queue.'})
            }
        )

        await self.match_users()

    async def match_users(self):
        elo_threshold = 80  # Threshold for Elo difference
        for i in range(len(self.user_queue) - 1):
            user1 = self.user_queue[i]
            user2 = self.user_queue[i + 1]
            
            # Check if Elo difference is within threshold
            if abs(user1['elo_rating'] - user2['elo_rating']) <= elo_threshold:
                # Remove users from queue
                self.user_queue.pop(i)
                self.user_queue.pop(i)

                room = Room()
                room.initialize()
                room.save()

                await self.channel_layer.group_send(
                    self.room_name, {'type': 'redirect', 'room': room} 
                )
                break
    
    async def redirect(self, event):
        room = event['room']
        user = self.scope['user']

        room_instance = RoomHistory(user=user, room=room, isWinner=False)
        room_instance.save()

        url = f'/room/{room.id}'
        self.send(text_data=json.dumps({'message': 'match_found', 'url': url}))

    async def get_user(self, user_id):
        return await sync_to_async(CustomUser.objects.get)(id=user_id)


class RoomConsumer(AsyncWebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['pk']
        self.room_group_name = 'room_%s' % self.room_nameZ