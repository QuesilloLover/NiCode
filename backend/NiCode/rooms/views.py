from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Room, RoomMembers, ProblemSet
from .serializers import RoomSerializer, RoomMemberSerializer, ProblemSetSerializer
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
    serializer_class = RoomMemberSerializer

    def get_queryset(self):
        room_id = self.kwargs['pk']
        return RoomMembers.objects.filter(room_id=room_id)

# Join Room
class JoinRoomView(generics.CreateAPIView):
    serializer_class = RoomMemberSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        room_id = self.kwargs['pk']
        serializer.save(user=self.request.user, room_id=room_id)

# Leave Room
class LeaveRoomView(generics.DestroyAPIView):
    serializer_class = RoomMemberSerializer

    def delete(self, request, *args, **kwargs):
        # Get the current user
        user = request.user
        room_id = self.kwargs['pk']
        room_member = RoomMembers.objects.filter(room_id=room_id, user=user)

        if room_member.exists():
            room_member.delete()  # Delete all entries where the user is a member of the room
            return Response({"detail": "Successfully left the room."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "You are not a member of this room."}, status=status.HTTP_400_BAD_REQUEST)
# List all problem sets in a room and add
class RoomProblemListView(generics.ListAPIView):
    serializer_class = ProblemSerializer

    def get_queryset(self):
        room_id = self.kwargs['pk']
        # Get all problems related to the room's problem sets
        return Problem.objects.filter(problem_sets__room_id=room_id)
    
class AddProblemToRoomView(generics.CreateAPIView):
    serializer_class = ProblemSetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        room_id = self.kwargs['pk']
        problem_id = self.kwargs['problem_pk']
        serializer.save(room=Room.objects.get(id=room_id), problem=Problem.objects.get(id=problem_id))