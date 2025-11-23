"""
Analytics admin configuration.
"""
from django.contrib import admin
from .models import (
    PageView, DemographicInsight, TrafficSource,
    ConversionEvent, ConversionFunnel, CompetitorBenchmark,
    Report, ScheduledReport, TrendAnalysis
)


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ['business', 'session_id', 'page_url', 'timestamp']
    list_filter = ['timestamp']
    search_fields = ['business__name', 'session_id']
    readonly_fields = ['timestamp']


@admin.register(DemographicInsight)
class DemographicInsightAdmin(admin.ModelAdmin):
    list_display = ['business', 'date', 'device_mobile', 'device_desktop']
    list_filter = ['date']
    search_fields = ['business__name']


@admin.register(TrafficSource)
class TrafficSourceAdmin(admin.ModelAdmin):
    list_display = ['business', 'date', 'source_type', 'source_name', 'visits', 'conversions']
    list_filter = ['source_type', 'date']
    search_fields = ['business__name', 'source_name']


@admin.register(ConversionEvent)
class ConversionEventAdmin(admin.ModelAdmin):
    list_display = ['business', 'event_type', 'user', 'timestamp']
    list_filter = ['event_type', 'timestamp']
    search_fields = ['business__name']
    readonly_fields = ['timestamp']


@admin.register(ConversionFunnel)
class ConversionFunnelAdmin(admin.ModelAdmin):
    list_display = ['business', 'date', 'views', 'engagements', 'purchases']
    list_filter = ['date']
    search_fields = ['business__name']


@admin.register(CompetitorBenchmark)
class CompetitorBenchmarkAdmin(admin.ModelAdmin):
    list_display = ['business', 'date', 'category', 'views_percentile', 'rating_percentile']
    list_filter = ['category', 'date']
    search_fields = ['business__name']


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['business', 'report_type', 'format', 'status', 'created_at']
    list_filter = ['report_type', 'format', 'status']
    search_fields = ['business__name', 'title']
    readonly_fields = ['created_at', 'completed_at']


@admin.register(ScheduledReport)
class ScheduledReportAdmin(admin.ModelAdmin):
    list_display = ['business', 'report_type', 'frequency', 'is_active', 'next_run']
    list_filter = ['report_type', 'frequency', 'is_active']
    search_fields = ['business__name']


@admin.register(TrendAnalysis)
class TrendAnalysisAdmin(admin.ModelAdmin):
    list_display = ['business', 'date', 'metric', 'direction', 'change_percent']
    list_filter = ['metric', 'direction', 'date']
    search_fields = ['business__name']
