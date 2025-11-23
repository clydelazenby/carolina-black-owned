# Backend Endpoint Implementation Guide

Ready-to-use code snippets for implementing missing backend endpoints in `carolina_black_owned_be`.

---

## 1. Reviews App

### Create the App
```bash
python manage.py startapp reviews
```

### models.py
```python
# reviews/models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from auth_app.models import CustomUser
from listings.models import Listing


class Review(models.Model):
    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(max_length=100, blank=True)
    comment = models.TextField()
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['listing', 'user']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.listing.directory_name} ({self.rating})"
```

### serializers.py
```python
# reviews/serializers.py
from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'listing', 'user', 'user_name', 'user_email',
            'rating', 'title', 'comment', 'is_approved',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['rating', 'title', 'comment']
```

### views.py
```python
# reviews/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from listings.models import Listing
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def list_reviews(request, listing_id):
    """Get all reviews for a listing"""
    listing = get_object_or_404(Listing, id=listing_id)
    reviews = Review.objects.filter(listing=listing, is_approved=True)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request, listing_id):
    """Create a review for a listing"""
    listing = get_object_or_404(Listing, id=listing_id)

    # Check if user already reviewed this listing
    if Review.objects.filter(listing=listing, user=request.user).exists():
        return Response(
            {'error': 'You have already reviewed this business'},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = ReviewCreateSerializer(data=request.data)
    if serializer.is_valid():
        review = serializer.save(listing=listing, user=request.user)
        return Response(
            ReviewSerializer(review).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_review(request, listing_id, review_id):
    """Update a review"""
    review = get_object_or_404(
        Review,
        id=review_id,
        listing_id=listing_id,
        user=request.user
    )
    serializer = ReviewCreateSerializer(review, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(ReviewSerializer(review).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_review(request, listing_id, review_id):
    """Delete a review"""
    review = get_object_or_404(
        Review,
        id=review_id,
        listing_id=listing_id,
        user=request.user
    )
    review.delete()
    return Response({'message': 'Review deleted'}, status=status.HTTP_200_OK)
```

### urls.py
```python
# reviews/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('<int:listing_id>/reviews/', views.list_reviews, name='list-reviews'),
    path('<int:listing_id>/reviews/create/', views.create_review, name='create-review'),
    path('<int:listing_id>/reviews/<int:review_id>/', views.update_review, name='update-review'),
    path('<int:listing_id>/reviews/<int:review_id>/delete/', views.delete_review, name='delete-review'),
]
```

---

## 2. Favorites App

### Create the App
```bash
python manage.py startapp favorites
```

### models.py
```python
# favorites/models.py
from django.db import models
from auth_app.models import CustomUser
from listings.models import Listing


class Favorite(models.Model):
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='favorites'
    )
    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'listing']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.listing.directory_name}"
```

### serializers.py
```python
# favorites/serializers.py
from rest_framework import serializers
from .models import Favorite
from listings.serializers import ListingSerializer


class FavoriteSerializer(serializers.ModelSerializer):
    listing_details = ListingSerializer(source='listing', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'listing', 'listing_details', 'created_at']
        read_only_fields = ['id', 'created_at']
```

### views.py
```python
# favorites/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from listings.models import Listing
from .models import Favorite
from .serializers import FavoriteSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_favorites(request):
    """Get user's favorites"""
    favorites = Favorite.objects.filter(user=request.user)
    serializer = FavoriteSerializer(favorites, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_favorite(request):
    """Add listing to favorites"""
    listing_id = request.data.get('listing_id')
    listing = get_object_or_404(Listing, id=listing_id)

    favorite, created = Favorite.objects.get_or_create(
        user=request.user,
        listing=listing
    )

    if not created:
        return Response(
            {'message': 'Already in favorites'},
            status=status.HTTP_200_OK
        )

    return Response(
        FavoriteSerializer(favorite).data,
        status=status.HTTP_201_CREATED
    )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_favorite(request, listing_id):
    """Remove listing from favorites"""
    favorite = get_object_or_404(
        Favorite,
        user=request.user,
        listing_id=listing_id
    )
    favorite.delete()
    return Response({'message': 'Removed from favorites'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_favorite(request, listing_id):
    """Check if listing is in user's favorites"""
    is_favorite = Favorite.objects.filter(
        user=request.user,
        listing_id=listing_id
    ).exists()
    return Response({'is_favorite': is_favorite})
```

### urls.py
```python
# favorites/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_favorites, name='list-favorites'),
    path('add/', views.add_favorite, name='add-favorite'),
    path('remove/<int:listing_id>/', views.remove_favorite, name='remove-favorite'),
    path('check/<int:listing_id>/', views.check_favorite, name='check-favorite'),
]
```

---

## 3. Notifications App

### Create the App
```bash
python manage.py startapp notifications
```

### models.py
```python
# notifications/models.py
from django.db import models
from auth_app.models import CustomUser
from listings.models import Listing


class Notification(models.Model):
    TYPE_CHOICES = [
        ('review', 'New Review'),
        ('claim_approved', 'Claim Approved'),
        ('claim_rejected', 'Claim Rejected'),
        ('new_message', 'New Message'),
        ('listing_approved', 'Listing Approved'),
        ('system', 'System Notification'),
    ]

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    link = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"


class NotificationPreference(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='notification_preferences'
    )
    email_reviews = models.BooleanField(default=True)
    email_claims = models.BooleanField(default=True)
    email_messages = models.BooleanField(default=True)
    push_reviews = models.BooleanField(default=True)
    push_claims = models.BooleanField(default=True)
    push_messages = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - Preferences"
```

### serializers.py
```python
# notifications/serializers.py
from rest_framework import serializers
from .models import Notification, NotificationPreference


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message',
            'is_read', 'related_listing', 'link', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = [
            'email_reviews', 'email_claims', 'email_messages',
            'push_reviews', 'push_claims', 'push_messages'
        ]
```

### views.py
```python
# notifications/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Notification, NotificationPreference
from .serializers import NotificationSerializer, NotificationPreferenceSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_notifications(request):
    """Get user's notifications"""
    notifications = Notification.objects.filter(user=request.user)
    serializer = NotificationSerializer(notifications, many=True)
    unread_count = notifications.filter(is_read=False).count()
    return Response({
        'notifications': serializer.data,
        'unread_count': unread_count
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_read(request, notification_id):
    """Mark notification as read"""
    notification = get_object_or_404(
        Notification,
        id=notification_id,
        user=request.user
    )
    notification.is_read = True
    notification.save()
    return Response({'message': 'Marked as read'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_read(request):
    """Mark all notifications as read"""
    Notification.objects.filter(
        user=request.user,
        is_read=False
    ).update(is_read=True)
    return Response({'message': 'All marked as read'})


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def notification_preferences(request):
    """Get or update notification preferences"""
    preferences, created = NotificationPreference.objects.get_or_create(
        user=request.user
    )

    if request.method == 'GET':
        serializer = NotificationPreferenceSerializer(preferences)
        return Response(serializer.data)

    serializer = NotificationPreferenceSerializer(
        preferences,
        data=request.data,
        partial=True
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

### urls.py
```python
# notifications/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_notifications, name='list-notifications'),
    path('<int:notification_id>/read/', views.mark_read, name='mark-read'),
    path('read-all/', views.mark_all_read, name='mark-all-read'),
    path('preferences/', views.notification_preferences, name='notification-preferences'),
]
```

---

## 4. Dashboard Endpoints

### Add to existing views or create dashboard app

```python
# dashboard/views.py (or add to core/views.py)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Avg
from listings.models import Listing
from reviews.models import Review
from favorites.models import Favorite


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics for business owner"""
    user = request.user

    # Get user's listings
    my_listings = Listing.objects.filter(owner=user)
    listing_ids = my_listings.values_list('id', flat=True)

    # Calculate stats
    total_listings = my_listings.count()
    total_reviews = Review.objects.filter(listing_id__in=listing_ids).count()
    average_rating = Review.objects.filter(
        listing_id__in=listing_ids
    ).aggregate(avg=Avg('rating'))['avg'] or 0
    total_favorites = Favorite.objects.filter(listing_id__in=listing_ids).count()

    return Response({
        'total_listings': total_listings,
        'total_reviews': total_reviews,
        'average_rating': round(average_rating, 1),
        'total_favorites': total_favorites,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_listings(request):
    """Get user's own listings"""
    listings = Listing.objects.filter(owner=request.user)
    # Use your existing ListingSerializer
    from listings.serializers import ListingSerializer
    serializer = ListingSerializer(listings, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_analytics(request):
    """Get analytics data"""
    from django.utils import timezone
    from datetime import timedelta

    user = request.user
    my_listings = Listing.objects.filter(owner=user)
    listing_ids = my_listings.values_list('id', flat=True)

    # Get reviews from last 30 days
    thirty_days_ago = timezone.now() - timedelta(days=30)
    recent_reviews = Review.objects.filter(
        listing_id__in=listing_ids,
        created_at__gte=thirty_days_ago
    ).count()

    # Get new favorites from last 30 days
    recent_favorites = Favorite.objects.filter(
        listing_id__in=listing_ids,
        created_at__gte=thirty_days_ago
    ).count()

    return Response({
        'recent_reviews': recent_reviews,
        'recent_favorites': recent_favorites,
        'period': '30_days'
    })
```

---

## 5. Update Main URLs

```python
# carolina_black_owned_be/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('auth_app.urls')),
    path('api/listings/', include('listings.urls')),
    path('api/listings/', include('reviews.urls')),  # Nested under listings
    path('api/favorites/', include('favorites.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/', include('core.urls')),
]
```

---

## 6. Update Settings

```python
# settings.py
INSTALLED_APPS = [
    # ... existing apps
    'reviews',
    'favorites',
    'notifications',
    'dashboard',  # if created as separate app
]
```

---

## 7. Run Migrations

```bash
python manage.py makemigrations reviews favorites notifications
python manage.py migrate
```

---

## Quick Test Commands

```bash
# Create test data
python manage.py shell

>>> from auth_app.models import CustomUser
>>> from listings.models import Listing
>>> from reviews.models import Review
>>> from favorites.models import Favorite

>>> user = CustomUser.objects.first()
>>> listing = Listing.objects.first()

>>> # Create a review
>>> Review.objects.create(
...     listing=listing,
...     user=user,
...     rating=5,
...     comment="Great business!"
... )

>>> # Add to favorites
>>> Favorite.objects.create(user=user, listing=listing)
```

---

*Copy these code snippets directly to the backend repository to implement the missing endpoints.*
