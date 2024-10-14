from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from .models import Topic
from .serializers import TopicSerializer
from rest_framework.authtoken.models import Token

class TopicList(APIView):
    """
    List all topics, or create a new topic.
    """
    permission_classes = [AllowAny]  #auth is managed in the serializer xd

    def get(self, request, format=None):
        topics = Topic.objects.all()
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        access_token = request.headers.get('Authorization').split(' ')[1]  

        try:
            token = Token.objects.get(key=access_token)
            user = token.user  
            print(f"Usuario encontrado: {user.username}")
            
            serializer = TopicSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save(author=user)  #Assign the user to the topic
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Token.DoesNotExist:
            return Response({"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
