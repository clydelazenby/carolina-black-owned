"""
User serializers.
"""
from rest_framework import serializers
from .models import User, Business


class UserSerializer(serializers.ModelSerializer):
    """User serializer."""

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'role', 'phone', 'avatar', 'bio', 'location',
            'facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url',
            'email_notifications', 'push_notifications',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class BusinessSerializer(serializers.ModelSerializer):
    """Business serializer."""
    owner_name = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Business
        fields = '__all__'
        read_only_fields = [
            'id', 'owner', 'view_count', 'favorite_count',
            'review_count', 'average_rating', 'created_at', 'updated_at'
        ]


class BusinessListSerializer(serializers.ModelSerializer):
    """Lightweight business serializer for list views."""

    class Meta:
        model = Business
        fields = [
            'id', 'name', 'tagline', 'category', 'logo',
            'city', 'state', 'average_rating', 'review_count',
            'is_verified', 'is_featured'
        ]
