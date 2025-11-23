"""
User views.
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Business
from .serializers import UserSerializer, BusinessSerializer, BusinessListSerializer


class UserViewSet(viewsets.ModelViewSet):
    """User management viewset."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """Get or update current user profile."""
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)

        serializer = self.get_serializer(
            request.user,
            data=request.data,
            partial=request.method == 'PATCH'
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class BusinessViewSet(viewsets.ModelViewSet):
    """Business listing viewset."""
    queryset = Business.objects.filter(status='approved')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return BusinessListSerializer
        return BusinessSerializer

    def get_queryset(self):
        queryset = Business.objects.all()

        # Filter by owner for dashboard
        if self.action in ['list'] and self.request.query_params.get('mine'):
            queryset = queryset.filter(owner=self.request.user)
        else:
            queryset = queryset.filter(status='approved')

        # Category filter
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        # City filter
        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__iexact=city)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        """Record a business view."""
        business = self.get_object()
        business.view_count += 1
        business.save(update_fields=['view_count'])
        return Response({'status': 'view recorded'})
