from django.db import models
from users.models import CustomUser
from codeSystem.models import Problem
from datetime import datetime

class Room(models.Model):
    """
    Collection of rooms made by users
    """
    ACTIVE = 'active'
    INACTIVE = 'inactive'
    CLOSED = 'closed'
    PENDING = 'pending'

    STATUS_CHOICES = [
        (ACTIVE, 'Active'),
        (INACTIVE, 'Inactive'),
        (CLOSED, 'Closed'),
        (PENDING, 'Pending'),
    ]

    room_name = models.CharField(max_length=100, unique=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=100,
        choices=STATUS_CHOICES,
        default=PENDING,
    )
    private = models.BooleanField(default=False)
    key = models.CharField(max_length=100, null=True, blank=True)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.room_name
    
    def initialize(self):
        self.problem = Problem.objects.order_by('?').first()
        self.created_at = datetime.now()

class RoomHistory(models.Model):
    """
    Room log of users who joined a room
    """
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    isWinner = models.BooleanField(default=False)      


    def __str__(self):
        return f"{self.user.username} in {self.room.room_name}"
