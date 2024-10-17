from django.contrib import admin
from .models import Room, RoomMembers, ProblemSet

# Register your models here.
admin.site.register(Room)
admin.site.register(RoomMembers)
admin.site.register(ProblemSet)

