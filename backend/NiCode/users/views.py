from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import CustomUser
from rest_framework.authtoken.models import Token
from .serializers import CustomUserSerializer

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
