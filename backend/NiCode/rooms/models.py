from django.db import models
from users.models import CustomUser


class RoomStatus(models.Model):
    """
    Available statuses for rooms
    """
    status = models.CharField(max_length=100)

    def __str__(self):
        return self.status
    

class Room(models.Model):
    """
    Collection of rooms made by users
    """
    room_name = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    status = models.ForeignKey(RoomStatus, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.room_name


class RoomMembers(models.Model):
    """
    Room log of users who joined a room
    """
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} in {self.room.room_name}"
    
