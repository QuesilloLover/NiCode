from django.urls import path, include
from .views import CustomUserDetail, UploadProfileImageView

urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),  
    path('auth/registration/', include('dj_rest_auth.registration.urls')), 
    path('accounts/', include('allauth.urls')), 
    path('user/', CustomUserDetail.as_view(), name='user_profile'),
    path('upload-profile-image/', UploadProfileImageView.as_view(), name='upload_profile_image'),
]