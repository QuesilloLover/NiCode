from django.urls import path
from .views import AssistantBotView

urlpatterns = [
    path('chatbot/', AssistantBotView.as_view(), name='chatbot'),
]