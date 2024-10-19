from django.urls import path
from .views import RoomListCreateView, RoomDetailView, RoomMemberListView, JoinRoomView, LeaveRoomView

urlpatterns = [
    path('rooms/', RoomListCreateView.as_view(), name='room-list-create'),
    path('rooms/<int:pk>/', RoomDetailView.as_view(), name='room-detail'),
    path('rooms/<int:pk>/members/', RoomMemberListView.as_view(), name='room-members'),
    path('rooms/<int:pk>/join/', JoinRoomView.as_view(), name='join-room'),
    path('rooms/<int:pk>/leave/', LeaveRoomView.as_view(), name='leave-room'),
]