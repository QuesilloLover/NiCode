from django.db import models
from users.models import CustomUser

class Topic(models.Model):
    """
    Model that represents a topic in the forum.
    """
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post_date = models.DateTimeField(auto_now_add=True)

    @property
    def total_likes(self):
        return Like.objects.filter(topic=self).count()

    def __str__(self):
        return self.title 
        
class TopicTags(models.Model):
    """
    Model that represents the relationship between a topic and its labels.
    """
    id = models.AutoField(primary_key=True)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE) 
    tag = models.ForeignKey('Tags', on_delete=models.CASCADE)  

class Tags(models.Model):
    """
    Model that represents a label that can be associated with a topic.
    """
    id = models.AutoField(primary_key=True) 
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name  

class Comment(models.Model):
    """
    Model that represents a comment on a topic.
    """
    id = models.AutoField(primary_key=True)
    message = models.TextField()
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post_date = models.DateTimeField(auto_now_add=True)
    topic_related = models.ForeignKey(Topic, on_delete=models.CASCADE, null=True)

    @property
    def total_likes(self):
        return Like.objects.filter(comment=self).count()

    def __str__(self):
        return f"Comment made by {self.author} on {self.post_date}" 

class Like(models.Model):
    """
    Model that represents a like made by a user on a topic or comment.
    """
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  
    topic = models.ForeignKey('Topic', on_delete=models.CASCADE, null=True, blank=True)  
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, null=True, blank=True)  
    liked_on = models.DateTimeField(auto_now_add=True)  

    class Meta:
        unique_together = ('user', 'topic', 'comment') 

    def __str__(self):
        return f"Like by {self.user} on {self.liked_on}"
