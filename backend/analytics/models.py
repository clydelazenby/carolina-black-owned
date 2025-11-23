"""
Analytics models for Phase 5: Enhanced Analytics & Insights.

Provides:
- Customer demographics insights
- Traffic sources tracking
- Conversion funnel analysis
- Competitor benchmarking
- Exportable reports
- Trend analysis
"""
from django.db import models
from django.conf import settings


class PageView(models.Model):
    """Track page views for analytics."""
    business = models.ForeignKey(
        'users.Business',
        on_delete=models.CASCADE,
        related_name='page_views'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    session_id = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.URLField(blank=True)
    page_url = models.URLField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'analytics_page_views'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['business', 'timestamp']),
            models.Index(fields=['session_id']),
        ]


class DemographicInsight(models.Model):
    """Aggregated demographic data for a business."""

    AGE_RANGE_CHOICES = [
        ('18-24', '18-24'),
        ('25-34', '25-34'),
        ('35-44', '35-44'),
        ('45-54', '45-54'),
        ('55-64', '55-64'),
        ('65+', '65+'),
    ]

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('unknown', 'Unknown'),
    ]

    business = models.ForeignKey(
        'users.Business',
        on_delete=models.CASCADE,
        related_name='demographics'
    )
    date = models.DateField()

    # Age distribution (percentages)
    age_18_24 = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    age_25_34 = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    age_35_44 = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    age_45_54 = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    age_55_64 = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    age_65_plus = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # Gender distribution (percentages)
    gender_male = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    gender_female = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    gender_other = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # Location breakdown (JSON for flexibility)
    location_breakdown = models.JSONField(default=dict)

    # Device breakdown
    device_mobile = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    device_desktop = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    device_tablet = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    class Meta:
        db_table = 'analytics_demographics'
        unique_together = ['business', 'date']
        ordering = ['-date']


class TrafficSource(models.Model):
    """Track traffic sources for businesses."""

    SOURCE_TYPE_CHOICES = [
        ('direct', 'Direct'),
        ('organic', 'Organic Search'),
        ('paid', 'Paid Search'),
        ('social', 'Social Media'),
        ('referral', 'Referral'),
        ('email', 'Email'),
        ('other', 'Other'),
    ]

    SOCIAL_PLATFORM_CHOICES = [
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('twitter', 'Twitter/X'),
        ('linkedin', 'LinkedIn'),
        ('tiktok', 'TikTok'),
        ('youtube', 'YouTube'),
        ('pinterest', 'Pinterest'),
        ('other', 'Other'),
    ]

    business = models.ForeignKey(
        'users.Business',
        on_delete=models.CASCADE,
        related_name='traffic_sources'
    )
    date = models.DateField()
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPE_CHOICES)
    source_name = models.CharField(max_length=100)  # e.g., "google", "facebook"
    social_platform = models.CharField(
        max_length=20,
        choices=SOCIAL_PLATFORM_CHOICES,
        blank=True
    )
    campaign = models.CharField(max_length=100, blank=True)  # UTM campaign
    medium = models.CharField(max_length=50, blank=True)  # UTM medium

    # Metrics
    visits = models.PositiveIntegerField(default=0)
    unique_visitors = models.PositiveIntegerField(default=0)
    page_views = models.PositiveIntegerField(default=0)
    bounce_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    avg_session_duration = models.DurationField(null=True, blank=True)
    conversions = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'analytics_traffic_sources'
        ordering = ['-date', '-visits']
        indexes = [
            models.Index(fields=['business', 'date']),
            models.Index(fields=['source_type']),
        ]


class ConversionEvent(models.Model):
    """Track conversion funnel events."""

    EVENT_TYPE_CHOICES = [
        ('view', 'Page View'),
        ('click_contact', 'Clicked Contact'),
        ('click_website', 'Clicked Website'),
        ('click_directions', 'Clicked Directions'),
        ('click_call', 'Clicked Call'),
        ('add_favorite', 'Added to Favorites'),
        ('share', 'Shared'),
        ('review_start', 'Started Review'),
        ('review_submit', 'Submitted Review'),
        ('book_start', 'Started Booking'),
        ('book_complete', 'Completed Booking'),
        ('cart_add', 'Added to Cart'),
        ('checkout_start', 'Started Checkout'),
        ('purchase', 'Completed Purchase'),
    ]

    business = models.ForeignKey(
        'users.Business',
        on_delete=models.CASCADE,
        related_name='conversion_events'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    session_id = models.CharField(max_length=100)
    event_type = models.CharField(max_length=30, choices=EVENT_TYPE_CHOICES)
    event_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    metadata = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'analytics_conversion_events'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['business', 'event_type', 'timestamp']),
            models.Index(fields=['session_id']),
        ]


class ConversionFunnel(models.Model):
    """Aggregated conversion funnel data."""
    business = models.ForeignKey(
        'users.Business',
        on_delete=models.CASCADE,
        related_name='conversion_funnels'
    )
    date = models.DateField()

    # Funnel stages (counts)
    views = models.PositiveIntegerField(default=0)
    engagements = models.PositiveIntegerField(default=0)  # any click/interaction
    contacts = models.PositiveIntegerField(default=0)  # contact clicks
    bookings_started = models.PositiveIntegerField(default=0)
    bookings_completed = models.PositiveIntegerField(default=0)
    purchases = models.PositiveIntegerField(default=0)

    # Conversion rates (calculated)
    view_to_engagement_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    engagement_to_contact_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    contact_to_booking_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    booking_completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    class Meta:
        db_table = 'analytics_conversion_funnels'
        unique_together = ['business', 'date']
        ordering = ['-date']


class CompetitorBenchmark(models.Model):
    """Benchmark data against competitors in same category/location."""
    business = models.ForeignKey(
        'users.Business',
        on_delete=models.CASCADE,
        related_name='benchmarks'
    )
    date = models.DateField()
    category = models.CharField(max_length=50)
    city = models.CharField(max_length=100)

    # Business metrics
    business_views = models.PositiveIntegerField(default=0)
    business_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    business_review_count = models.PositiveIntegerField(default=0)
    business_engagement_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # Category averages
    category_avg_views = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    category_avg_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    category_avg_reviews = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    category_avg_engagement = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # Percentile rankings
    views_percentile = models.PositiveSmallIntegerField(default=50)
    rating_percentile = models.PositiveSmallIntegerField(default=50)
    reviews_percentile = models.PositiveSmallIntegerField(default=50)
    engagement_percentile = models.PositiveSmallIntegerField(default=50)

    class Meta:
        db_table = 'analytics_benchmarks'
        unique_together = ['business', 'date']
        ordering = ['-date']


class Report(models.Model):
    """Generated reports for businesses."""

    FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('csv', 'CSV'),
        ('excel', 'Excel'),
    ]

    REPORT_TYPE_CHOICES = [
        ('overview', 'Overview Report'),
        ('traffic', 'Traffic Report'),
        ('demographics', 'Demographics Report'),
        ('conversion', 'Conversion Report'),
        ('benchmark', 'Benchmark Report'),
        ('custom', 'Custom Report'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('generating', 'Generating'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    business = models.ForeignKey(
        'users.Business',
        on_delete=models.CASCADE,
        related_name='reports'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='pdf')
    title = models.CharField(max_length=200)

    # Date range
    start_date = models.DateField()
    end_date = models.DateField()

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    file = models.FileField(upload_to='reports/', null=True, blank=True)
    error_message = models.TextField(blank=True)

    # Metadata
    parameters = models.JSONField(default=dict)  # Custom report parameters

    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'analytics_reports'
        ordering = ['-created_at']


class ScheduledReport(models.Model):
    """Scheduled automatic reports."""

    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]

    business = models.ForeignKey(
        'users.Business',
        on_delete=models.CASCADE,
        related_name='scheduled_reports'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    report_type = models.CharField(max_length=20, choices=Report.REPORT_TYPE_CHOICES)
    format = models.CharField(max_length=10, choices=Report.FORMAT_CHOICES, default='pdf')
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)

    # Email recipients
    email_recipients = models.JSONField(default=list)  # List of email addresses

    # Schedule
    is_active = models.BooleanField(default=True)
    next_run = models.DateTimeField()
    last_run = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'analytics_scheduled_reports'


class TrendAnalysis(models.Model):
    """Store trend analysis results."""

    TREND_DIRECTION_CHOICES = [
        ('up', 'Trending Up'),
        ('down', 'Trending Down'),
        ('stable', 'Stable'),
    ]

    METRIC_CHOICES = [
        ('views', 'Page Views'),
        ('favorites', 'Favorites'),
        ('reviews', 'Reviews'),
        ('rating', 'Average Rating'),
        ('bookings', 'Bookings'),
        ('revenue', 'Revenue'),
    ]

    business = models.ForeignKey(
        'users.Business',
        on_delete=models.CASCADE,
        related_name='trends'
    )
    date = models.DateField()
    metric = models.CharField(max_length=20, choices=METRIC_CHOICES)

    # Trend data
    current_value = models.DecimalField(max_digits=12, decimal_places=2)
    previous_value = models.DecimalField(max_digits=12, decimal_places=2)
    change_percent = models.DecimalField(max_digits=8, decimal_places=2)
    direction = models.CharField(max_length=10, choices=TREND_DIRECTION_CHOICES)

    # Seasonal analysis
    is_seasonal_peak = models.BooleanField(default=False)
    seasonal_index = models.DecimalField(max_digits=5, decimal_places=2, default=1.0)

    # Growth recommendations
    recommendations = models.JSONField(default=list)

    class Meta:
        db_table = 'analytics_trends'
        unique_together = ['business', 'date', 'metric']
        ordering = ['-date']
