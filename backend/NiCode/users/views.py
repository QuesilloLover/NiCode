from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from .models import CustomUser
from .serializers import CustomUserSerializer

@api_view(['GET', 'POST'])
def custom_user_detail(request):
    if request.method == 'GET':
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'POST':
        user = request.user
        data = request.data
        serializer = CustomUserSerializer(user, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
