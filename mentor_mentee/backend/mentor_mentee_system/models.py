from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('mentor', 'Mentor'),
        ('mentee', 'Mentee'),
    ]
    
    official_mail_id = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    prn_id_no = models.CharField(max_length=50, unique=True, null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='mentee')
    profile_picture = models.CharField(max_length=255, null=True, blank=True)
    calendar_id = models.CharField(max_length=255, unique=True, null=True, blank=True)

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    privileges = models.TextField(null=True, blank=True)

class Mentor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    room_no = models.CharField(max_length=50, null=True, blank=True)
    timetable = models.TextField(null=True, blank=True)
    department = models.CharField(max_length=255, null=True, blank=True)
    academic_background = models.TextField(null=True, blank=True)
    post_in_hand = models.CharField(max_length=255, null=True, blank=True)

class Mentee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    mentor = models.ForeignKey(Mentor, on_delete=models.SET_NULL, null=True)
    course = models.CharField(max_length=255, default='Not specified')
    year = models.IntegerField(default=1)
    attendance = models.FloatField(null=True, blank=True)
    academic = models.TextField(null=True, blank=True)
    upcoming_event = models.TextField(null=True, blank=True)
    alternate_contact = models.CharField(max_length=15, unique=True, null=True, blank=True)

class Achievement(models.Model):
    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE, null=True)
    mentee = models.ForeignKey(Mentee, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=255, default='Achievement')
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    badge_icon = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'achievement'

    def __str__(self):
        return f"{self.name} - {self.mentee.user.email if self.mentee else 'No mentee'}"

class Communication(models.Model):
    MESSAGE_STATUS_CHOICES = [
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('read', 'Read'),
    ]
    
    MESSAGE_TYPE_CHOICES = [
        ('one-to-one', 'One to One'),
        ('broadcast', 'Broadcast'),
        ('feedback', 'Feedback'),
        ('meeting_req', 'Meeting Request'),
    ]
    
    MEETING_MODE_CHOICES = [
        ('offline', 'Offline'),
        ('online', 'Online'),
    ]
    
    MEETING_STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    message_content = models.TextField(null=True, blank=True)
    message_status = models.CharField(max_length=20, choices=MESSAGE_STATUS_CHOICES, default='sent')
    attached_file = models.CharField(max_length=255, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=20, choices=MESSAGE_TYPE_CHOICES, default='one-to-one')
    
    # Meeting related fields
    meeting_date = models.DateField(null=True, blank=True)
    meeting_time = models.TimeField(null=True, blank=True)
    meeting_mode = models.CharField(max_length=20, choices=MEETING_MODE_CHOICES, null=True, blank=True)
    meeting_status = models.CharField(max_length=20, choices=MEETING_STATUS_CHOICES, null=True, blank=True)
    meeting_agenda = models.TextField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    in_time = models.DateTimeField(default=timezone.now)
    out_time = models.DateTimeField(null=True, blank=True)
    activity_done = models.TextField(null=True, blank=True)
    key = models.CharField(max_length=50, null=True, blank=True)

class Meeting(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        ACCEPTED = 'accepted', _('Accepted')
        REJECTED = 'rejected', _('Rejected')
        COMPLETED = 'completed', _('Completed')

    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentor_meetings_main')
    mentee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentee_meetings_main')
    title = models.CharField(max_length=255, default='Meeting')
    description = models.TextField(null=True, blank=True)
    scheduled_at = models.DateTimeField(default=timezone.now)
    duration = models.IntegerField(default=30)  # in minutes
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages_main')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages_main')
    content = models.TextField(default='')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_achievements_main')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, null=True)
    awarded_at = models.DateTimeField(auto_now_add=True)
    awarded_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='awarded_achievements_main'
    ) 