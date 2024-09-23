from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models


class CustomUser(AbstractUser):
    """
    Custom user model with additional fields
    """
    bio = models.TextField(blank=True)
    elo = models.IntegerField(default=0)
    profile_image = models.URLField(max_length=255, blank=True)
    guild_id = models.ForeignKey('Guild', null=True, blank=True, on_delete=models.SET_NULL)
    role_guild_id = models.ForeignKey('RoleGuild', null=True, blank=True, on_delete=models.SET_NULL)

    groups = models.ManyToManyField(
        Group,
        related_name='customuser_set',  
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_set',  
        blank=True,
    )

    def __str__(self):
        return self.username
    

class Guild(models.Model):
    """
    Collection of guilds made by users
    """
    guild_name = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.guild_name
    

class RoleGuild(models.Model):
    """
    Collection of available roles for users in a guild
    """
    title = models.CharField(max_length=50)

    def __str__(self):
        return self.title
    

class Badge(models.Model):
    """
    Collection of badges that can be awarded to users
    """
    badge_name = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    badge_image = models.URLField(max_length=255)

    def __str__(self):
        return self.badge_name


class UserBadge(models.Model):
    """
    Collection of badges awarded to users
    """
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    badge_id = models.ForeignKey(Badge, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user_id', 'badge_id')

    def __str__(self):
        return f"{self.user_id.username} - {self.badge_id.badge_name}"
