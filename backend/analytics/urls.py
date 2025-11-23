"""
Analytics URL configuration for Phase 5.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AnalyticsOverviewView,
    TrafficSourceViewSet,
    DemographicsViewSet,
    ConversionFunnelViewSet,
    CompetitorBenchmarkViewSet,
    TrendAnalysisViewSet,
    ReportViewSet,
    ScheduledReportViewSet,
    ConversionEventView,
)

router = DefaultRouter()
router.register(r'reports', ReportViewSet, basename='report')
router.register(r'scheduled-reports', ScheduledReportViewSet, basename='scheduled-report')

urlpatterns = [
    # Overview
    path('business/<int:business_id>/overview/', AnalyticsOverviewView.as_view(), name='analytics-overview'),

    # Traffic sources
    path('business/<int:business_id>/traffic/',
         TrafficSourceViewSet.as_view({'get': 'list'}), name='traffic-list'),
    path('business/<int:business_id>/traffic/breakdown/',
         TrafficSourceViewSet.as_view({'get': 'breakdown'}), name='traffic-breakdown'),

    # Demographics
    path('business/<int:business_id>/demographics/',
         DemographicsViewSet.as_view({'get': 'list'}), name='demographics-list'),
    path('business/<int:business_id>/demographics/breakdown/',
         DemographicsViewSet.as_view({'get': 'breakdown'}), name='demographics-breakdown'),

    # Conversion funnel
    path('business/<int:business_id>/funnel/',
         ConversionFunnelViewSet.as_view({'get': 'list'}), name='funnel-list'),
    path('business/<int:business_id>/funnel/stages/',
         ConversionFunnelViewSet.as_view({'get': 'stages'}), name='funnel-stages'),

    # Benchmarks
    path('business/<int:business_id>/benchmarks/',
         CompetitorBenchmarkViewSet.as_view({'get': 'list'}), name='benchmarks-list'),
    path('business/<int:business_id>/benchmarks/summary/',
         CompetitorBenchmarkViewSet.as_view({'get': 'summary'}), name='benchmarks-summary'),

    # Trends
    path('business/<int:business_id>/trends/',
         TrendAnalysisViewSet.as_view({'get': 'list'}), name='trends-list'),
    path('business/<int:business_id>/trends/summary/',
         TrendAnalysisViewSet.as_view({'get': 'summary'}), name='trends-summary'),

    # Event tracking
    path('events/', ConversionEventView.as_view(), name='track-event'),

    # Reports (router)
    path('', include(router.urls)),
]
