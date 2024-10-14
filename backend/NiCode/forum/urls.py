from django.urls import path
from .views import TopicList

urlpatterns = [
    path('forum/topics/', TopicList.as_view(), name='topic-list'),
]