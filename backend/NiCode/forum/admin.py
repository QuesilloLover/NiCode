from django.contrib import admin
from .models import Topic, TopicTags, Tags, Comment, Likes

# Register your models here.
admin.site.register(Topic)
admin.site.register(TopicTags)
admin.site.register(Tags)
admin.site.register(Comment)
admin.site.register(Likes)