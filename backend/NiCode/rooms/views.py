from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Room, RoomHistory
from .serializers import RoomSerializer, RoomHistorySerializer
from codeSystem.serializers import ProblemSerializer
from codeSystem.models import Problem
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

# List and create rooms
class RoomListCreateView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        # Get only active rooms
        return Room.objects.filter(status="active")

# Retrieve, update, and delete a specific room
class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# List room members
class RoomMemberListView(generics.ListAPIView):
    serializer_class = RoomHistorySerializer

    def get_queryset(self):
        room_id = self.kwargs['pk']
        return RoomHistory.objects.filter(room_id=room_id)

# Join Room
class JoinRoomView(generics.CreateAPIView):
    serializer_class = RoomHistorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        room_id = self.kwargs['pk']
        serializer.save(user=self.request.user, room_id=room_id)

# Leave Room
class LeaveRoomView(generics.DestroyAPIView):
    serializer_class = RoomHistorySerializer

    def delete(self, request, *args, **kwargs):
        # Get the current user
        user = request.user
        room_id = self.kwargs['pk']
        room_member = RoomHistory.objects.filter(room_id=room_id, user=user)

        if room_member.exists():
            room_member.delete()  # Delete all entries where the user is a member of the room
            return Response({"detail": "Successfully left the room."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "You are not a member of this room."}, status=status.HTTP_400_BAD_REQUEST)
# List all problem sets in a room and add