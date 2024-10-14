from rest_framework import serializers
from .models import Topic, TopicTags, Tags, Comment, Like

class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = ['id', 'name']

class CommentSerializer(serializers.ModelSerializer):
    total_likes = serializers.ReadOnlyField()

    class Meta:
        model = Comment
        fields = ['id', 'message', 'author', 'post_date', 'total_likes']

class TopicSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')  # Solo lectura, se autocompleta
    tags = TagsSerializer(many=True, required=False)  # Asume que es una lista de etiquetas
    comments = CommentSerializer(many=True, read_only=True)  # Comentarios relacionados
    total_likes = serializers.ReadOnlyField()

    class Meta:
        model = Topic
        fields = ['id', 'title', 'description', 'author', 'post_date', 'tags', 'comments', 'total_likes']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        topic = Topic.objects.create(**validated_data)  # Crear el tópico

        # Relacionar etiquetas a través de TopicTags
        for tag_data in tags_data:
            tag, created = Tags.objects.get_or_create(name=tag_data['name'])  # Obtén o crea la etiqueta
            TopicTags.objects.create(topic=topic, tag=tag)  # Crea la relación con TopicTags

        return topic
