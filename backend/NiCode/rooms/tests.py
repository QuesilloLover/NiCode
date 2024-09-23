from django.test import TestCase

from django.test import TestCase
from django.utils import timezone
from users.models import CustomUser
from rooms.models import Room, RoomStatus, RoomMembers


class RoomStatusModelTest(TestCase):
    def setUp(self):
        self.room_status = RoomStatus.objects.create(status="Active")

    def test_room_status_creation(self):
        """
        Test the creation of a RoomStatus and verify its value
        """
        self.assertEqual(self.room_status.status, "Active")

    def test_room_status_str_method(self):
        """
        Verify that the __str__ method of RoomStatus returns the correct status
        """
        self.assertEqual(str(self.room_status), "Active")


class RoomModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(username='owner', password='password123')
        self.room_status = RoomStatus.objects.create(status="Active")
        self.room = Room.objects.create(
            room_name="Test Room",
            description="This is a test room",
            owner=self.user,
            status=self.room_status,
            created_at=timezone.now(),
            updated_at=timezone.now()
        )

    def test_room_creation(self):
        """
        Test the creation of a Room and verify its values
        """
        self.assertEqual(self.room.room_name, "Test Room")
        self.assertEqual(self.room.description, "This is a test room")
        self.assertEqual(self.room.owner.username, "owner")
        self.assertEqual(self.room.status.status, "Active")

    def test_room_str_method(self):
        """
        Verify that the __str__ method of Room returns the room name
        """
        self.assertEqual(str(self.room), "Test Room")


class RoomMembersModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(username='member', password='password123')
        self.owner = CustomUser.objects.create(username='owner', password='password123')
        self.room_status = RoomStatus.objects.create(status="Active")
        self.room = Room.objects.create(
            room_name="Test Room",
            description="This is a test room",
            owner=self.owner,
            status=self.room_status,
            created_at=timezone.now(),
            updated_at=timezone.now()
        )
        self.room_member = RoomMembers.objects.create(room=self.room, user=self.user)

    def test_room_members_creation(self):
        """
        Test the creation of a RoomMembers and verify its values
        """
        self.assertEqual(self.room_member.room.room_name, "Test Room")
        self.assertEqual(self.room_member.user.username, "member")

    def test_room_members_str_method(self):
        """
        Verify that the __str__ method of RoomMembers returns the correct format
        """
        self.assertEqual(str(self.room_member), "member in Test Room")

