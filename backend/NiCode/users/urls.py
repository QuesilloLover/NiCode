from django.urls import path, include
from .views import CustomUserDetail

urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),  
    path('auth/registration/', include('dj_rest_auth.registration.urls')), 
    path('accounts/', include('allauth.urls')), 
    path('user/',  CustomUserDetail.as_view(), name='user_profile' )
]