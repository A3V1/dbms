from django.db import models
from mentor_mentee_system.apps.users.models import User

class ActivityLog(models.Model):
    MEETING = 'meeting'
    ACHIEVEMENT = 'achievement'
    TASK = 'task'
    MESSAGE = 'message'
    
    ACTIVITY_TYPES = [
        (MEETING, 'Meeting'),
        (ACHIEVEMENT, 'Achievement'),
        (TASK, 'Task'),
        (MESSAGE, 'Message'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activity_logs'
        ordering = ['-created_at']
