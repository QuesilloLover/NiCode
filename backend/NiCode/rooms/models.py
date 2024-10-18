from django.db import models
from users.models import CustomUser
from codeSystem.models import Problem

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
    description = models.TextField(null=True, blank=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=100,
        choices=STATUS_CHOICES,
        default=PENDING,
    )
    private = models.BooleanField(default=False)
    key = models.CharField(max_length=100, null=True, blank=True)

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
    

class ProblemSet(models.Model):
    id = models.AutoField(primary_key=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='problem_sets', default=1)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='problem_sets')
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ProblemSet for Room {self.room_id} - Problem {self.problem.name}"