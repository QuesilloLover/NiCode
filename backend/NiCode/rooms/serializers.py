from rest_framework import serializers
from .models import Room, RoomMembers, ProblemSet

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'room_name', 'description', 'owner', 'status', 'private', 'key', 'created_at', 'updated_at']

    def validate_room_name(self, value):
        """
        Check that the room_name is unique.
        """
        if Room.objects.filter(room_name=value).exists():
            raise serializers.ValidationError("A room with this name already exists.")
        return value

class RoomMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomMembers
        fields = ['id', 'room', 'user', 'joined_at']

class ProblemSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemSet
        fields = ['id', 'room', 'problem', 'added_at']

