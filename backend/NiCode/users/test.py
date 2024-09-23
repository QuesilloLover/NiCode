from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Guild, RoleGuild, Badge, UserBadge

CustomUser = get_user_model()  


class CustomUserModelTest(TestCase):

    def setUp(self):
        self.guild = Guild.objects.create(guild_name='Enchiladita', description='Los mas enchilados')
        self.role_guild = RoleGuild.objects.create(title='Leader')
        self.user = CustomUser.objects.create_user(
            username='testuser', password='password123',
            bio='Test bio', elo=1000,
            guild_id=self.guild,
            role_guild_id=self.role_guild
        )

    def test_user_creation(self):
        """
        Verify the user was created correctly with the fields
        """
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.bio, 'Test bio')
        self.assertEqual(self.user.elo, 1000)
        self.assertEqual(self.user.guild_id, self.guild)
        self.assertEqual(self.user.role_guild_id, self.role_guild)

    def test_user_str_method(self):
        """
        Veerify the __str__ method of the CustomUser returns the username
        """
        self.assertEqual(str(self.user), self.user.username)


class GuildModelTest(TestCase):

    def setUp(self):
        self.guild = Guild.objects.create(guild_name='Guild One', description='Description of guild')

    def test_guild_creation(self):
        """
        Verify the guild was created correctly with the fields
        """
        self.assertEqual(self.guild.guild_name, 'Guild One')
        self.assertEqual(self.guild.description, 'Description of guild')

    def test_guild_str_method(self):
        """
        Verify the __str__ method of the Guild returns the guild name
        """
        self.assertEqual(str(self.guild), self.guild.guild_name)


class RoleGuildModelTest(TestCase):

    def setUp(self):
        self.role_guild = RoleGuild.objects.create(title='Admin')

    def test_roleguild_creation(self):
        """
        Verify the RoleGuild was created correctly with the fields
        """
        self.assertEqual(self.role_guild.title, 'Admin')

    def test_roleguild_str_method(self):
        """
        Verify the __str__ method of the RoleGuild returns the title
        """
        self.assertEqual(str(self.role_guild), self.role_guild.title)


class BadgeModelTest(TestCase):

    def setUp(self):
        self.badge = Badge.objects.create(
            badge_name='First Badge',
            description='Awarded for first achievement',
            badge_image='http://example.com/badge.png'
        )

    def test_badge_creation(self):
        """
        Verify the badge was created correctly with the fields
        """
        self.assertEqual(self.badge.badge_name, 'First Badge')
        self.assertEqual(self.badge.description, 'Awarded for first achievement')
        self.assertEqual(self.badge.badge_image, 'http://example.com/badge.png')

    def test_badge_str_method(self):
        """
        Verify the __str__ method of the Badge returns the badge name
        """
        self.assertEqual(str(self.badge), self.badge.badge_name)


class UserBadgeModelTest(TestCase):

    def setUp(self):
        self.guild = Guild.objects.create(guild_name='Knights', description='Guild of Knights')
        self.role_guild = RoleGuild.objects.create(title='Leader')
        self.user = CustomUser.objects.create_user(
            username='testuser', password='password123',
            bio='Test bio', elo=1000,
            guild_id=self.guild,
            role_guild_id=self.role_guild
        )
        self.badge = Badge.objects.create(
            badge_name='First Badge',
            description='Awarded for first achievement',
            badge_image='http://example.com/badge.png'
        )
        self.user_badge = UserBadge.objects.create(user_id=self.user, badge_id=self.badge)

    def test_userbadge_creation(self):
        """
        Verify the UserBadge was created correctly with the fields
        """
        self.assertEqual(self.user_badge.user_id, self.user)
        self.assertEqual(self.user_badge.badge_id, self.badge)

    def test_userbadge_unique_together(self):
        """
        Verify the UserBadge has a unique_together constraint
        """
        with self.assertRaises(Exception):
            UserBadge.objects.create(user_id=self.user, badge_id=self.badge)

    def test_userbadge_str_method(self):
        """
        Verify the __str__ method of the UserBadge returns the username and badge name
        """
        self.assertEqual(str(self.user_badge), f"{self.user.username} - {self.badge.badge_name}")
