from rest_framework import serializers
from .models import Room, RoomHistory

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

class RoomHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomHistory
        fields = ['id', 'room', 'user', 'joined_at', 'isWinner']
