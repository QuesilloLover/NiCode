from rest_framework import serializers
from .models import Topic, TopicTags, Tags, Comment, Like
from users.models import CustomUser  

class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = ['id', 'name']

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'message','post_date','topic_related', 'author', 'author_name']

    def get_author_name(self, obj):
        try:
            return obj.author.username 
        except CustomUser.DoesNotExist:
            return "Unknown"

class TopicSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username') 
    tags = serializers.SerializerMethodField()  # Aquí agrego la parte de los tags
    comments = CommentSerializer(many=True, read_only=True)
    total_likes = serializers.ReadOnlyField()

    class Meta:
        model = Topic
        fields = ['id', 'title', 'description', 'author', 'post_date', 'tags', 'comments', 'total_likes']

    def get_tags(self, obj):
        topic_tags = TopicTags.objects.filter(topic=obj)
        return TagsSerializer([tag.tag for tag in topic_tags], many=True).data

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        topic = Topic.objects.create(**validated_data)  

        print(f'Validated Data: {validated_data}')
        print(f'Tags Data: {tags_data}')

        for tag_data in tags_data:
            tag, created = Tags.objects.get_or_create(name=tag_data['name'])  
            TopicTags.objects.create(topic=topic, tag=tag)  

        return topic
    
class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'topic', 'comment', 'liked_on']
        read_only_fields = ['liked_on']

    def validate(self, data):
        """
        Ensure that either a topic or a comment is liked, not both.
        """
        if not data.get('topic') and not data.get('comment'):
            raise serializers.ValidationError("You must like either a topic or a comment.")
        if data.get('topic') and data.get('comment'):
            raise serializers.ValidationError("You can only like a topic or a comment, not both.")
        
        return data
