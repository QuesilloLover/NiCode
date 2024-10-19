from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import CustomUser
from rest_framework.authtoken.models import Token
from .serializers import CustomUserSerializer
from django.contrib.auth.decorators import login_required
from .forms import ProfileImageForm
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

class CustomUserDetail(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        access_token = request.headers.get('Authorization').split(' ')[1]
        token = Token.objects.get(key=access_token)
        user = token.user
        serializer = CustomUserSerializer(user)
        
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # Obtener el usuario autenticado
        user = request.user
        data = request.data
        
        # Serializar los datos parcialmente, permitiendo que algunos campos estén ausentes
        serializer = CustomUserSerializer(user, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UploadProfileImageView(LoginRequiredMixin, View):
    def get(self, request):
        form = ProfileImageForm(instance=request.user)
        return render(request, 'upload_profile_image.html', {'form': form})

    def post(self, request):
        form = ProfileImageForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('profile')
        return render(request, 'upload_profile_image.html', {'form': form})

class UserProfileView(LoginRequiredMixin, View):
    def get(self, request):
        user = request.user
        data = {
            'username': user.username,
            'profile_image': user.profile_image.url if user.profile_image else '',
        }
        return JsonResponse(data)
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

class UploadProfileImageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user = request.user
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)