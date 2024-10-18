from django.urls import path
from .views import TopicList, LikeView, CommentListCreateView, TagsListView

urlpatterns = [
    path('forum/topics/', TopicList.as_view(), name='topic-list'),
    path('forum/likes/', LikeView.as_view(), name='like'),
    path('forum/topics/<int:topic_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('forum/tags/', TagsListView.as_view(), name='tags-list'),
]