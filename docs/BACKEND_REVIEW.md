# Backend Code Review: carolina_black_owned_be

## Overview

This document provides a comprehensive review of the Django backend repository (`carolina_black_owned_be`) with recommendations for improvements, security fixes, and feature additions.

**Repository:** https://github.com/clydelazenby/carolina_black_owned_be
**Branch:** dev
**Framework:** Django + Django REST Framework

---

## Current Architecture

### Apps Structure
```
carolina_black_owned_be/
├── auth_app/          # User authentication & custom user model
├── carolina_black_owned_be/  # Main Django settings
├── core/              # Core functionality
├── listings/          # Business listings CRUD
├── static/            # Static files
└── templates/         # HTML templates
```

### Current Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup/` | POST | User registration |
| `/api/auth/login/` | POST | User login |
| `/api/token/` | POST | Obtain auth token |
| `/api/listings/` | GET | List all listings |
| `/api/listings/add/` | POST | Create listing |
| `/api/listings/update/<id>/` | PUT | Update listing |
| `/api/listings/delete/<id>/` | DELETE | Delete listing |
| `/api/homepage/` | GET | Homepage data |

---

## Security Issues (Critical)

### 1. Exposed Database Credentials
**Location:** `settings.py`
```python
DATABASES = {
    'default': {
        'NAME': 'carolinablackowned',
        'USER': 'clazenby',
        'PASSWORD': '<exposed>',  # CRITICAL: Remove from version control
    }
}
```

**Fix:** Use environment variables
```python
import os
from dotenv import load_dotenv

load_dotenv()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '3306'),
    }
}
```

### 2. DEBUG Mode Enabled
**Issue:** `DEBUG = True` in production exposes sensitive information

**Fix:**
```python
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
```

### 3. Secret Key Exposed
**Issue:** `SECRET_KEY` is hardcoded in settings.py

**Fix:**
```python
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
```

### 4. CORS_ALLOW_ALL_ORIGINS = True
**Issue:** Allows any origin to access the API

**Fix:** Whitelist specific origins in production
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://carolinablackowned.com",
]
```

---

## Code Quality Improvements

### 1. Listing Model Enhancements

**Current Model:**
```python
class Listing(models.Model):
    directory_name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, null=True)
    directory_url = models.CharField(max_length=255)
    industry_niche = models.CharField(max_length=100)
    social_media_links = models.JSONField()
    description = models.TextField()
    keywords = models.TextField()
    video_url = models.URLField(null=True)
    logo = models.FileField(upload_to='logos/')
    email = models.EmailField()
```

**Recommended Additions:**
```python
class Listing(models.Model):
    # Existing fields...

    # Add these fields
    owner = models.ForeignKey(
        'auth_app.CustomUser',
        on_delete=models.CASCADE,
        related_name='listings',
        null=True
    )
    phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=50, default='NC')
    zip_code = models.CharField(max_length=10, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    is_verified = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['city']),
            models.Index(fields=['industry_niche']),
            models.Index(fields=['is_featured']),
        ]
```

### 2. CustomUser Model Improvements

**Add profile fields:**
```python
class CustomUser(AbstractBaseUser, PermissionsMixin):
    # Existing fields...

    # Add these
    profile_image = models.ImageField(upload_to='profiles/', blank=True)
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    is_business_owner = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)

    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
```

---

## Missing Features (Required for Frontend)

The frontend has Phase 4 features that need backend support:

### 1. Reviews System
```python
# reviews/models.py
class Review(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_approved = models.BooleanField(default=True)

    class Meta:
        unique_together = ['listing', 'user']  # One review per user per listing
```

### 2. Favorites System
```python
# favorites/models.py
class Favorite(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='favorites')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'listing']
```

### 3. Business Claims System
```python
# claims/models.py
class BusinessClaim(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    proof_document = models.FileField(upload_to='claims/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True)
    reviewed_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        related_name='reviewed_claims'
    )
```

### 4. Notifications System
```python
# notifications/models.py
class Notification(models.Model):
    TYPE_CHOICES = [
        ('review', 'New Review'),
        ('claim_approved', 'Claim Approved'),
        ('claim_rejected', 'Claim Rejected'),
        ('new_message', 'New Message'),
        ('system', 'System Notification'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_listing = models.ForeignKey(Listing, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### 5. Appointments System
```python
# appointments/models.py
class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    service = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## Recommended New Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/logout/` | POST | Logout user |
| `/api/auth/profile/` | GET/PUT | Get/update user profile |
| `/api/auth/change-password/` | POST | Change password |
| `/api/auth/reset-password/` | POST | Reset password |

### Reviews
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/listings/<id>/reviews/` | GET | Get reviews for listing |
| `/api/listings/<id>/reviews/` | POST | Create review |
| `/api/listings/<id>/reviews/<rid>/` | PUT | Update review |
| `/api/listings/<id>/reviews/<rid>/` | DELETE | Delete review |

### Favorites
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/favorites/` | GET | Get user favorites |
| `/api/favorites/add/` | POST | Add to favorites |
| `/api/favorites/remove/<id>/` | DELETE | Remove from favorites |

### Dashboard
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard/stats/` | GET | Get dashboard statistics |
| `/api/dashboard/my-listings/` | GET | Get user's listings |
| `/api/dashboard/analytics/` | GET | Get analytics data |

### Notifications
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications/` | GET | Get notifications |
| `/api/notifications/<id>/read/` | POST | Mark as read |
| `/api/notifications/read-all/` | POST | Mark all as read |

### Business Claims
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/claims/submit/` | POST | Submit claim |
| `/api/claims/` | GET | Get user's claims |
| `/api/claims/<id>/status/` | GET | Check claim status |

### Admin
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/users/` | GET | List users |
| `/api/admin/listings/` | GET | List all listings |
| `/api/admin/claims/` | GET | List pending claims |
| `/api/admin/claims/<id>/approve/` | POST | Approve claim |
| `/api/admin/claims/<id>/reject/` | POST | Reject claim |

---

## Performance Recommendations

### 1. Add Database Indexes
```python
class Listing(models.Model):
    class Meta:
        indexes = [
            models.Index(fields=['city']),
            models.Index(fields=['industry_niche']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['created_at']),
        ]
```

### 2. Implement Pagination
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
```

### 3. Add Caching
```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/1'),
    }
}

# views.py
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)  # Cache for 15 minutes
def list_listings(request):
    ...
```

### 4. Use Select Related / Prefetch Related
```python
def list_listings(request):
    listings = Listing.objects.select_related('owner').prefetch_related('reviews')
    ...
```

---

## DevOps Recommendations

### 1. Environment Configuration
Create `.env` file:
```env
DEBUG=False
DJANGO_SECRET_KEY=your-secret-key
DB_NAME=carolinablackowned
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=3306
ALLOWED_HOSTS=localhost,carolinablackowned.com
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://carolinablackowned.com
```

### 2. Production Checklist
- [ ] Set `DEBUG=False`
- [ ] Use environment variables for secrets
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Set up HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up logging
- [ ] Use Gunicorn or uWSGI
- [ ] Configure static file serving (WhiteNoise or CDN)
- [ ] Set up database backups
- [ ] Add rate limiting

### 3. Docker Configuration
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

EXPOSE 8000
CMD ["gunicorn", "carolina_black_owned_be.wsgi:application", "--bind", "0.0.0.0:8000"]
```

---

## Summary

### High Priority
1. Fix security vulnerabilities (credentials, DEBUG mode, CORS)
2. Add missing endpoints for Phase 4 frontend features
3. Implement proper authentication with token refresh

### Medium Priority
4. Add Reviews and Favorites models
5. Implement pagination
6. Add database indexes

### Low Priority
7. Set up caching
8. Add comprehensive logging
9. Implement email notifications

---

*Document generated: November 2024*
*For: Carolina Black Owned Platform*
