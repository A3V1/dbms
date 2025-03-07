from django.db import models
from django.conf import settings
from django.utils import timezone

class Meeting(models.Model):
    SCHEDULED = 'scheduled'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'
    
    STATUS_CHOICES = [
        (SCHEDULED, 'Scheduled'),
        (COMPLETED, 'Completed'),
        (CANCELLED, 'Cancelled'),
    ]
    
    mentor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mentor_meetings'
    )
    mentee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mentee_meetings'
    )
    title = models.CharField(max_length=255, default='Meeting')
    description = models.TextField(blank=True, null=True)
    scheduled_at = models.DateTimeField(default=timezone.now)
    duration = models.PositiveIntegerField(default=30)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=SCHEDULED
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'meetings'
        ordering = ['-scheduled_at']
