from django.urls import path
from .views import CourseCreateView

urlpatterns = [
    path('courses/create/', CourseCreateView.as_view(), name='course-list-create'),
]