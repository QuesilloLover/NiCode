from django.urls import path, re_path

from .consumers import MatchmakingConsumer, RoomConsumer

websocket_urlpatterns = [
    path('ws/matchmaking/', MatchmakingConsumer.as_asgi()),
    re_path(r'ws/match/(?P<match_id>\d+)$', RoomConsumer.as_asgi()),  
]