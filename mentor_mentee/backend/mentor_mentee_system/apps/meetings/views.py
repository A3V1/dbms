from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Meeting
from .serializers import MeetingSerializer
from ..core.permissions import IsMentorOrMentee

# Create your views here.

class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    permission_classes = [permissions.IsAuthenticated, IsMentorOrMentee]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'scheduled_at']
    search_fields = ['title', 'description']
    ordering_fields = ['scheduled_at', 'created_at']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'mentor':
            return Meeting.objects.filter(mentor=user)
        return Meeting.objects.filter(mentee=user)

    def perform_create(self, serializer):
        if self.request.user.role == 'mentor':
            serializer.save(mentor=self.request.user)
        else:
            serializer.save(mentee=self.request.user)
