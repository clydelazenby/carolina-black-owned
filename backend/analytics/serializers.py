"""
Analytics serializers for Phase 5.
"""
from rest_framework import serializers
from .models import (
    PageView, DemographicInsight, TrafficSource,
    ConversionEvent, ConversionFunnel, CompetitorBenchmark,
    Report, ScheduledReport, TrendAnalysis
)


class PageViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageView
        fields = '__all__'
        read_only_fields = ['id', 'timestamp']


class DemographicInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemographicInsight
        fields = '__all__'


class TrafficSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrafficSource
        fields = '__all__'


class ConversionEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversionEvent
        fields = '__all__'
        read_only_fields = ['id', 'timestamp']


class ConversionFunnelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversionFunnel
        fields = '__all__'


class CompetitorBenchmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitorBenchmark
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ['id', 'status', 'file', 'error_message', 'created_at', 'completed_at']

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None


class ScheduledReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledReport
        fields = '__all__'
        read_only_fields = ['id', 'last_run', 'created_at']


class TrendAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrendAnalysis
        fields = '__all__'


# Summary serializers for dashboard views
class AnalyticsOverviewSerializer(serializers.Serializer):
    """Overview analytics summary."""
    total_views = serializers.IntegerField()
    total_unique_visitors = serializers.IntegerField()
    total_conversions = serializers.IntegerField()
    conversion_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    avg_session_duration = serializers.DurationField()
    bounce_rate = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Comparisons to previous period
    views_change = serializers.DecimalField(max_digits=8, decimal_places=2)
    visitors_change = serializers.DecimalField(max_digits=8, decimal_places=2)
    conversions_change = serializers.DecimalField(max_digits=8, decimal_places=2)


class TrafficBreakdownSerializer(serializers.Serializer):
    """Traffic sources breakdown."""
    source_type = serializers.CharField()
    visits = serializers.IntegerField()
    percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    conversions = serializers.IntegerField()
    conversion_rate = serializers.DecimalField(max_digits=5, decimal_places=2)


class DemographicsBreakdownSerializer(serializers.Serializer):
    """Demographics breakdown."""
    age_distribution = serializers.DictField()
    gender_distribution = serializers.DictField()
    device_distribution = serializers.DictField()
    top_locations = serializers.ListField()


class FunnelStageSerializer(serializers.Serializer):
    """Conversion funnel stage."""
    stage = serializers.CharField()
    count = serializers.IntegerField()
    conversion_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    drop_off_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
