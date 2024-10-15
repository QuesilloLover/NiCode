from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from .models import Topic, Like, Comment
from django.db.models import Count
from .serializers import TopicSerializer, LikeSerializer, CommentSerializer
from rest_framework.authtoken.models import Token

class TopicList(APIView):
    """
    List all topics, or create a new topic.
    """
    permission_classes = [AllowAny]  # Auth managed in the serializer

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
                serializer.save(author=user)  
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Token.DoesNotExist:
            return Response({"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
        
class LikeView(APIView):
    permission_classes = [AllowAny]  

    def post(self, request, format=None):
        access_token = request.headers.get('Authorization').split(' ')[1]  

        try:
            token = Token.objects.get(key=access_token)
            user = token.user  
            print(f"Usuario encontrado: {user.username}")

            data = request.data.copy()
            data['user'] = user.id  

            data['topic'] = data.get('topic', None)  
            data['comment'] = data.get('comment', None) 

            serializer = LikeSerializer(data=data)
            if serializer.is_valid():
                existing_like = Like.objects.filter(
                    user=user,
                    topic=data.get('topic', None),
                    comment=data.get('comment', None)
                ).first()

                if existing_like:
                    existing_like.delete()
                    return Response({"detail": "Like removed."}, status=status.HTTP_204_NO_CONTENT)
                else:
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Token.DoesNotExist:
            return Response({"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
        
    def get(self, request, format=None):
        access_token = request.headers.get('Authorization').split(' ')[1]

        try:
            token = Token.objects.get(key=access_token)
            user = token.user
            
            user_likes = Like.objects.filter(user=user)

            topic_likes = Like.objects.values('topic').annotate(total_likes=Count('topic')).filter(topic__isnull=False)

            comment_likes = Like.objects.values('comment').annotate(total_likes=Count('comment')).filter(comment__isnull=False)

            user_likes_serializer = LikeSerializer(user_likes, many=True)

            # response structure
            response_data = {
                'user_likes': user_likes_serializer.data,  
                'topic_likes': topic_likes,  
                'comment_likes': comment_likes,  
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Token.DoesNotExist:
            return Response({"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)


class CommentListCreateView(APIView):
    """
    List all comments for a topic, or create a new comment.
    """
    permission_classes = [AllowAny]  

    def get(self, request, topic_id, format=None):
        comments = Comment.objects.filter(topic_related=topic_id)
        serializer = CommentSerializer(comments, many=True)
        total_comments = comments.count() 

        return Response({
            'total_comments': total_comments,  # Include total comments in the response
            'comments': serializer.data
        })

    def post(self, request, topic_id, format=None):
        access_token = request.headers.get('Authorization').split(' ')[1]  

        try:
            token = Token.objects.get(key=access_token)
            user = token.user  
            print(f"Usuario encontrado: {user.username}")

            data = request.data.copy()
            data['author'] = user.id  
            print(f"fokin topic: {data['topic_related']}")

            serializer = CommentSerializer(data=data)
            print(f"Data: {data}")
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Token.DoesNotExist:
            return Response({"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)