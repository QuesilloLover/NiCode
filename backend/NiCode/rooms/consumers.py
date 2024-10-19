from channels.generic.websocket import AsyncWebsocketConsumer
from collections import deque
import json
# from .models import Match, MatchHistory
global user_queue
user_queue = deque()

class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'queue'
        await self.channel_layer.group_add(
            self.room_name, self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):
        self.user_id = self.scope['url_route']['kwargs']['user_id']

        if self.user_id not in user_queue:
            user_queue.append(self.user_id)

        await self.channel_layer.send(
            self.room_name,
            {
                'type': 'message',
                'text': json.dumps({ 'user_id': self.user_id, 'message': 'You have been added to the queue.' }) 
            }
        )

        if len(user_queue) >= 2:
            user_queue.popleft()
            user_queue.popleft()
            # TODO: create match
            match  = 'match'

            await self.channel_layer.group_send(
                self.room_name , {'type': 'redirect', 'match': match}
            )
    
    async def redirect(self, event):
        match = event['match']
        user = self.scope['user']

        # matchHistoryInstance = MatchHistory(user=user, match=match, isWinner = False)
        # matchHistoryInstance.save()

        url = f'/match/{match.id}'
        self.send(text_data=json.dumps({'message': 'match_found', 'url': url}))


class RoomConsumer(AsyncWebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['pk']
        self.room_group_name = 'room_%s' % self.room_nameZ