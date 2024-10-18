from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username', 'email','first_name','last_name','bio', 'elo', 'profile_image', 'guild_id', 'role_guild_id']

    def validate(self, data):
        if 'elo' not in data or data['elo'] is None:
            data['elo'] = 0
        return data
