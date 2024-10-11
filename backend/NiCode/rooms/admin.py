from django.contrib import admin
from .models import Room, RoomMembers, RoomStatus, ProblemSet

# Register your models here.
admin.site.register(Room)
admin.site.register(RoomMembers)
admin.site.register(RoomStatus)
admin.site.register(ProblemSet)

