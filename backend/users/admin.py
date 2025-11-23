"""
User admin configuration.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Business


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'is_staff']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'phone', 'avatar', 'bio', 'location')
        }),
        ('Social Links', {
            'fields': ('facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url')
        }),
        ('Preferences', {
            'fields': ('email_notifications', 'push_notifications')
        }),
    )


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'category', 'city', 'status', 'is_verified', 'created_at']
    list_filter = ['status', 'category', 'is_verified', 'is_featured', 'state']
    search_fields = ['name', 'description', 'owner__email']
    ordering = ['-created_at']
    readonly_fields = ['view_count', 'favorite_count', 'review_count', 'average_rating']
