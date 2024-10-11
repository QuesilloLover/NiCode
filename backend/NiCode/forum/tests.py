from django.test import TestCase
from users.models import CustomUser
from .models import Topic, TopicTags, Tags, Comment, Likes

class ForumModelsTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser', 
            password='password123'
        )
        
        self.topic = Topic.objects.create(
            title='Test Topic',
            description='This is a test topic.',
            author=self.user
        )
        
        self.tag = Tags.objects.create(name='Test Tag')

        self.topic_tag = TopicTags.objects.create(
            topic=self.topic,
            tag=self.tag
        )

        self.comment = Comment.objects.create(
            message='This is a test comment.',
            author=self.user,
            post_date=self.topic.post_date
        )

        self.like = Likes.objects.create(
            user=self.user,
            entity_id=self.topic.id,
            is_comment=False
        )

    def test_topic_creation(self):
        self.assertEqual(self.topic.title, 'Test Topic')
        self.assertEqual(self.topic.description, 'This is a test topic.')
        self.assertEqual(self.topic.author, self.user)

    def test_tag_creation(self):
        self.assertEqual(self.tag.name, 'Test Tag')

    def test_comment_creation(self):
        self.assertEqual(self.comment.message, 'This is a test comment.')
        self.assertEqual(self.comment.author, self.user)

    def test_like_creation(self):
        self.assertEqual(self.like.user, self.user)
        self.assertEqual(self.like.entity_id, self.topic.id)
        self.assertFalse(self.like.is_comment)

    def test_unique_like(self):
        with self.assertRaises(Exception):
            Likes.objects.create(
                user=self.user,
                entity_id=self.topic.id,
                is_comment=False
            )

    def test_topic_tags_relationship(self):
        self.assertEqual(self.topic_tag.topic, self.topic)
        self.assertEqual(self.topic_tag.tag, self.tag)

    def test_str_methods(self):
        self.assertEqual(str(self.topic), 'Test Topic')
        self.assertEqual(str(self.tag), 'Test Tag')
        self.assertEqual(str(self.comment).split(" on ")[0], f"Comment made by {self.user}")  # Comparamos solo la parte antes de "on"
        self.assertEqual(str(self.like), f"Liked by {self.user} to topic {self.topic.id}")

