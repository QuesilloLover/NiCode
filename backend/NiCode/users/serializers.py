from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'bio', 'elo', 'profile_image', 'guild_id', 'role_guild_id']

    def validate(self, data):
        # Establecer campos numéricos vacíos a 0
        if 'elo' not in data or data['elo'] is None:
            data['elo'] = 0
        return data
