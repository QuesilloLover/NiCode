from django.contrib import admin
from .models import Topic, TopicTags, Tags, Comment

# Register your models here.
admin.site.register(Topic)
admin.site.register(TopicTags)
admin.site.register(Tags)
admin.site.register(Comment)