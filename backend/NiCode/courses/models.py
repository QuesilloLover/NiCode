from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Module(models.Model):
    course = models.ForeignKey(Course, related_name='modules', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField()  # For sorting modules
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Item(models.Model):
    ITEM_TYPES = [
        ('content', 'Content'),
        ('video', 'Video'),
        ('problem', 'Problem'),
    ]

    module = models.ForeignKey(Module, related_name='items', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField()  # For sorting items
    item_type = models.CharField(max_length=30, choices=ITEM_TYPES)
    markdown_text = models.TextField(blank=True) 

    def __str__(self):
        return f"{self.title} ({self.get_item_type_display()})"

    class Meta:
        unique_together = ('module', 'title')  # Ensure titles are unique within a module