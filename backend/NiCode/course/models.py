from django.db import models
from codeSystem.models import Problem

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Module(models.Model):
    ITEM_TYPES = [
        ('content', 'Content'),
        ('video', 'Video'),
        ('problem', 'Problem'),
    ]

    course = models.ForeignKey(Course, related_name='modules', on_delete=models.CASCADE, default=1)
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField()  # For sorting modules
    item_type = models.CharField(max_length=30, choices=ITEM_TYPES)
    markdown_text = models.TextField(blank=True)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, null=True, blank=True, default=None)

    def __str__(self):
        return f"{self.title} - {self.get_item_type_display()}"
    
    class Meta:
        unique_together = ('course', 'title')  # 