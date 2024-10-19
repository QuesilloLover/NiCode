from rest_framework import serializers
from .models import Room, RoomMembers, ProblemSet
from users.models import CustomUser

class RoomSerializer(serializers.ModelSerializer):
    owner_username = serializers.SerializerMethodField()
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ['id', 'room_name', 'description', 'owner', 'owner_username', 'members_count', 'status', 'private', 'key', 'created_at', 'updated_at']

    def get_owner_username(self, obj):
        # Retrieves the username of the owner (CustomUser)
        return CustomUser.objects.get(id=obj.owner.id).username

    def get_members_count(self, obj):
        # Count the number of members in the room
        return RoomMembers.objects.filter(room=obj).count()

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

