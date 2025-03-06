from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Role(models.TextChoices):
        MENTOR = 'mentor', _('Mentor')
        MENTEE = 'mentee', _('Mentee')

    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(max_length=10, choices=Role.choices)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']

    # Add unique related_names for User model
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

class Meeting(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        ACCEPTED = 'accepted', _('Accepted')
        REJECTED = 'rejected', _('Rejected')
        COMPLETED = 'completed', _('Completed')

    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentor_meetings_main')
    mentee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentee_meetings_main')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    scheduled_at = models.DateTimeField()
    duration = models.IntegerField()  # in minutes
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages_main')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages_main')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Achievement(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_achievements_main')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)
    awarded_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='awarded_achievements_main'
    ) 