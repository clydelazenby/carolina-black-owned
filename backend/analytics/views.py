"""
Analytics views for Phase 5.
"""
from datetime import datetime, timedelta
from decimal import Decimal
from django.db.models import Sum, Avg, Count, F
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import Business
from .models import (
    PageView, DemographicInsight, TrafficSource,
    ConversionEvent, ConversionFunnel, CompetitorBenchmark,
    Report, ScheduledReport, TrendAnalysis
)
from .serializers import (
    PageViewSerializer, DemographicInsightSerializer, TrafficSourceSerializer,
    ConversionEventSerializer, ConversionFunnelSerializer, CompetitorBenchmarkSerializer,
    ReportSerializer, ScheduledReportSerializer, TrendAnalysisSerializer
)


class IsBusinessOwner(permissions.BasePermission):
    """Only allow business owners to access their analytics."""

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'business'):
            return obj.business.owner == request.user
        return obj.owner == request.user


class AnalyticsOverviewView(APIView):
    """Get analytics overview for a business."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, business_id):
        try:
            business = Business.objects.get(id=business_id, owner=request.user)
        except Business.DoesNotExist:
            return Response(
                {'error': 'Business not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Date range
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)
        prev_start = start_date - timedelta(days=30)
        prev_end = start_date - timedelta(days=1)

        # Current period metrics
        current_views = PageView.objects.filter(
            business=business,
            timestamp__date__gte=start_date,
            timestamp__date__lte=end_date
        ).count()

        current_unique = PageView.objects.filter(
            business=business,
            timestamp__date__gte=start_date,
            timestamp__date__lte=end_date
        ).values('session_id').distinct().count()

        current_conversions = ConversionEvent.objects.filter(
            business=business,
            event_type='purchase',
            timestamp__date__gte=start_date,
            timestamp__date__lte=end_date
        ).count()

        # Previous period metrics
        prev_views = PageView.objects.filter(
            business=business,
            timestamp__date__gte=prev_start,
            timestamp__date__lte=prev_end
        ).count()

        prev_unique = PageView.objects.filter(
            business=business,
            timestamp__date__gte=prev_start,
            timestamp__date__lte=prev_end
        ).values('session_id').distinct().count()

        prev_conversions = ConversionEvent.objects.filter(
            business=business,
            event_type='purchase',
            timestamp__date__gte=prev_start,
            timestamp__date__lte=prev_end
        ).count()

        # Calculate changes
        def calc_change(current, previous):
            if previous == 0:
                return 100 if current > 0 else 0
            return round(((current - previous) / previous) * 100, 2)

        return Response({
            'total_views': current_views,
            'total_unique_visitors': current_unique,
            'total_conversions': current_conversions,
            'conversion_rate': round((current_conversions / current_views * 100) if current_views > 0 else 0, 2),
            'views_change': calc_change(current_views, prev_views),
            'visitors_change': calc_change(current_unique, prev_unique),
            'conversions_change': calc_change(current_conversions, prev_conversions),
            'period': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat()
            }
        })


class TrafficSourceViewSet(viewsets.ReadOnlyModelViewSet):
    """Traffic sources analytics."""
    serializer_class = TrafficSourceSerializer
    permission_classes = [permissions.IsAuthenticated, IsBusinessOwner]

    def get_queryset(self):
        business_id = self.kwargs.get('business_id')
        return TrafficSource.objects.filter(
            business_id=business_id,
            business__owner=self.request.user
        )

    @action(detail=False, methods=['get'])
    def breakdown(self, request, business_id=None):
        """Get traffic breakdown by source type."""
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)

        sources = TrafficSource.objects.filter(
            business_id=business_id,
            business__owner=request.user,
            date__gte=start_date,
            date__lte=end_date
        ).values('source_type').annotate(
            total_visits=Sum('visits'),
            total_conversions=Sum('conversions')
        ).order_by('-total_visits')

        total_visits = sum(s['total_visits'] for s in sources)

        breakdown = []
        for source in sources:
            breakdown.append({
                'source_type': source['source_type'],
                'visits': source['total_visits'],
                'percentage': round(source['total_visits'] / total_visits * 100, 2) if total_visits > 0 else 0,
                'conversions': source['total_conversions'],
                'conversion_rate': round(
                    source['total_conversions'] / source['total_visits'] * 100, 2
                ) if source['total_visits'] > 0 else 0
            })

        return Response(breakdown)


class DemographicsViewSet(viewsets.ReadOnlyModelViewSet):
    """Demographics analytics."""
    serializer_class = DemographicInsightSerializer
    permission_classes = [permissions.IsAuthenticated, IsBusinessOwner]

    def get_queryset(self):
        business_id = self.kwargs.get('business_id')
        return DemographicInsight.objects.filter(
            business_id=business_id,
            business__owner=self.request.user
        )

    @action(detail=False, methods=['get'])
    def breakdown(self, request, business_id=None):
        """Get demographics breakdown."""
        latest = DemographicInsight.objects.filter(
            business_id=business_id,
            business__owner=request.user
        ).order_by('-date').first()

        if not latest:
            return Response({
                'age_distribution': {},
                'gender_distribution': {},
                'device_distribution': {},
                'top_locations': []
            })

        return Response({
            'age_distribution': {
                '18-24': float(latest.age_18_24),
                '25-34': float(latest.age_25_34),
                '35-44': float(latest.age_35_44),
                '45-54': float(latest.age_45_54),
                '55-64': float(latest.age_55_64),
                '65+': float(latest.age_65_plus),
            },
            'gender_distribution': {
                'male': float(latest.gender_male),
                'female': float(latest.gender_female),
                'other': float(latest.gender_other),
            },
            'device_distribution': {
                'mobile': float(latest.device_mobile),
                'desktop': float(latest.device_desktop),
                'tablet': float(latest.device_tablet),
            },
            'top_locations': latest.location_breakdown.get('top_cities', [])
        })


class ConversionFunnelViewSet(viewsets.ReadOnlyModelViewSet):
    """Conversion funnel analytics."""
    serializer_class = ConversionFunnelSerializer
    permission_classes = [permissions.IsAuthenticated, IsBusinessOwner]

    def get_queryset(self):
        business_id = self.kwargs.get('business_id')
        return ConversionFunnel.objects.filter(
            business_id=business_id,
            business__owner=self.request.user
        )

    @action(detail=False, methods=['get'])
    def stages(self, request, business_id=None):
        """Get funnel stages with drop-off rates."""
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)

        funnels = ConversionFunnel.objects.filter(
            business_id=business_id,
            business__owner=request.user,
            date__gte=start_date,
            date__lte=end_date
        ).aggregate(
            views=Sum('views'),
            engagements=Sum('engagements'),
            contacts=Sum('contacts'),
            bookings_started=Sum('bookings_started'),
            bookings_completed=Sum('bookings_completed'),
            purchases=Sum('purchases')
        )

        stages = []
        stage_names = ['views', 'engagements', 'contacts', 'bookings_started', 'bookings_completed', 'purchases']
        display_names = ['Page Views', 'Engagements', 'Contacts', 'Bookings Started', 'Bookings Completed', 'Purchases']

        prev_count = None
        for i, (key, name) in enumerate(zip(stage_names, display_names)):
            count = funnels.get(key) or 0
            conversion_rate = 0
            drop_off_rate = 0

            if prev_count and prev_count > 0:
                conversion_rate = round(count / prev_count * 100, 2)
                drop_off_rate = round(100 - conversion_rate, 2)

            stages.append({
                'stage': name,
                'count': count,
                'conversion_rate': conversion_rate,
                'drop_off_rate': drop_off_rate
            })
            prev_count = count

        return Response(stages)


class CompetitorBenchmarkViewSet(viewsets.ReadOnlyModelViewSet):
    """Competitor benchmarking analytics."""
    serializer_class = CompetitorBenchmarkSerializer
    permission_classes = [permissions.IsAuthenticated, IsBusinessOwner]

    def get_queryset(self):
        business_id = self.kwargs.get('business_id')
        return CompetitorBenchmark.objects.filter(
            business_id=business_id,
            business__owner=self.request.user
        )

    @action(detail=False, methods=['get'])
    def summary(self, request, business_id=None):
        """Get benchmark summary vs category average."""
        latest = CompetitorBenchmark.objects.filter(
            business_id=business_id,
            business__owner=request.user
        ).order_by('-date').first()

        if not latest:
            return Response({
                'message': 'No benchmark data available yet'
            })

        return Response({
            'category': latest.category,
            'city': latest.city,
            'metrics': {
                'views': {
                    'business': latest.business_views,
                    'category_avg': float(latest.category_avg_views),
                    'percentile': latest.views_percentile
                },
                'rating': {
                    'business': float(latest.business_rating),
                    'category_avg': float(latest.category_avg_rating),
                    'percentile': latest.rating_percentile
                },
                'reviews': {
                    'business': latest.business_review_count,
                    'category_avg': float(latest.category_avg_reviews),
                    'percentile': latest.reviews_percentile
                },
                'engagement': {
                    'business': float(latest.business_engagement_rate),
                    'category_avg': float(latest.category_avg_engagement),
                    'percentile': latest.engagement_percentile
                }
            }
        })


class TrendAnalysisViewSet(viewsets.ReadOnlyModelViewSet):
    """Trend analysis and recommendations."""
    serializer_class = TrendAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated, IsBusinessOwner]

    def get_queryset(self):
        business_id = self.kwargs.get('business_id')
        return TrendAnalysis.objects.filter(
            business_id=business_id,
            business__owner=self.request.user
        )

    @action(detail=False, methods=['get'])
    def summary(self, request, business_id=None):
        """Get trend summary with recommendations."""
        latest_trends = TrendAnalysis.objects.filter(
            business_id=business_id,
            business__owner=request.user
        ).order_by('-date')[:6]  # Latest trend for each metric

        trends_by_metric = {}
        all_recommendations = []

        for trend in latest_trends:
            if trend.metric not in trends_by_metric:
                trends_by_metric[trend.metric] = {
                    'current_value': float(trend.current_value),
                    'change_percent': float(trend.change_percent),
                    'direction': trend.direction,
                    'is_seasonal_peak': trend.is_seasonal_peak
                }
                all_recommendations.extend(trend.recommendations)

        return Response({
            'trends': trends_by_metric,
            'recommendations': list(set(all_recommendations))[:5]  # Top 5 unique recommendations
        })


class ReportViewSet(viewsets.ModelViewSet):
    """Report management."""
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsBusinessOwner]

    def get_queryset(self):
        return Report.objects.filter(
            business__owner=self.request.user
        )

    def perform_create(self, serializer):
        business_id = self.request.data.get('business')
        business = Business.objects.get(id=business_id, owner=self.request.user)
        serializer.save(created_by=self.request.user, business=business)
        # TODO: Trigger async report generation task

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download generated report."""
        report = self.get_object()
        if report.status != 'completed' or not report.file:
            return Response(
                {'error': 'Report not ready for download'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response({'download_url': report.file.url})


class ScheduledReportViewSet(viewsets.ModelViewSet):
    """Scheduled reports management."""
    serializer_class = ScheduledReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsBusinessOwner]

    def get_queryset(self):
        return ScheduledReport.objects.filter(
            business__owner=self.request.user
        )

    def perform_create(self, serializer):
        business_id = self.request.data.get('business')
        business = Business.objects.get(id=business_id, owner=self.request.user)
        serializer.save(created_by=self.request.user, business=business)


class ConversionEventView(APIView):
    """Track conversion events."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Record a conversion event."""
        serializer = ConversionEventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                user=request.user if request.user.is_authenticated else None
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
