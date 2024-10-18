from rest_framework import serializers
from .models import Module, Course

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['title', 'order', 'item_type', 'markdown_text', 'problem']

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, write_only=True)

    class Meta:
        model = Course
        fields = ['title', 'description', 'modules']  # Add other fields as needed

    def create(self, validated_data):
        modules_data = validated_data.pop('modules')
        course = Course.objects.create(**validated_data)

        for module_data in modules_data:
            Module.objects.create(course=course, **module_data)

        return course