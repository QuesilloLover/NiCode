from channels.generic.websocket import AsyncWebsocketConsumer
import json
from sortedcontainers import SortedList
from .models import Room, RoomHistory
from users.models import CustomUser
from asgiref.sync import async_to_sync, sync_to_async
from urllib.parse import parse_qs


class MatchmakingConsumer(AsyncWebsocketConsumer):
    user_queue = SortedList(key=lambda x: x['elo'])  # Queue sorted by Elo
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
        data = json.loads(text_data)
        user_id = data.get('user_id', None)  # Get user_id from the WebSocket message
        self.user_id = user_id

        user = await self.get_user(self.user_id)  # Fetch user from DB
        elo = user.elo
        print(user, elo)

        if not any(u['user_id'] == self.user_id for u in self.user_queue):
            self.user_queue.add({'user_id': self.user_id, 'elo': elo})

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
            if abs(user1['elo'] - user2['elo']) <= elo_threshold:
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
    async def connect(self):
        self.match_id = self.scope['url_route']['kwargs']['match_id']
        self.match_group_id = f'match_{self.match_id}'

        # Join the match group
        await self.channel_layer.group_add(
            self.match_group_id, self.channel_name
        )

        await self.accept()

    async def disconnect(self, code):
        # Leave the match group
        await self.channel_layer.group_discard(
            self.match_group_id, self.channel_name
        )

    async def receive(self, text_data):
        json_text_data = json.loads(text_data)

        if json_text_data['message'] == 'sending':
            username = self.scope['user'].username

            # Send message to the group
            await self.channel_layer.group_send(
                self.match_group_id, {
                    "type": "processing",
                    'username': username
                }
            )

    async def processing(self, event):
        username = event['username']
        await self.send(text_data=json.dumps({
            'action': 'processing',
            'username': username
        }))

    async def isCorrect(self, event):
        username = event['username']
        isCorrect = event['isCorrect']
        await self.send(text_data=json.dumps({
            'action': 'correctness',
            'username': username,
            'isCorrect': isCorrect
        }))