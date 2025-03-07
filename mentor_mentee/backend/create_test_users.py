import os
import django
import sys

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentor_mentee_system.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from mentor_mentee_system.models import Admin, Mentor, Mentee, Achievement, Message, Meeting, ActivityLog

User = get_user_model()

def create_test_data():
    # Create users
    # Admin
    admin_user, _ = User.objects.get_or_create(
        username='bobjohnson',
        email='bobjohnson@college.edu',
        defaults={
            'first_name': 'Bob',
            'last_name': 'Johnson',
            'is_staff': True,
            'is_active': True,
            'is_superuser': True,
            'official_mail_id': 'bobjohnson@college.edu',
            'phone_number': '9988776655',
            'prn_id_no': 'PRN1003',
            'role': 'admin',
            'calendar_id': 'CAL1003'
        }
    )
    admin_user.set_password('admin123')  # Simple password for testing
    admin_user.save()
    
    # Mentor
    mentor_user, _ = User.objects.get_or_create(
        username='johndoe',
        email='johndoe@college.edu',
        defaults={
            'first_name': 'John',
            'last_name': 'Doe',
            'is_staff': False,
            'is_active': True,
            'is_superuser': False,
            'official_mail_id': 'johndoe@college.edu',
            'phone_number': '9876543210',
            'prn_id_no': 'PRN1001',
            'role': 'mentor',
            'calendar_id': 'CAL1001'
        }
    )
    mentor_user.set_password('mentor123')  # Simple password for testing
    mentor_user.save()
    
    # Mentee
    mentee_user, _ = User.objects.get_or_create(
        username='alicesmith',
        email='alicesmith@college.edu',
        defaults={
            'first_name': 'Alice',
            'last_name': 'Smith',
            'is_staff': False,
            'is_active': True,
            'is_superuser': False,
            'official_mail_id': 'alicesmith@college.edu',
            'phone_number': '9123456789',
            'prn_id_no': 'PRN1002',
            'role': 'mentee',
            'calendar_id': 'CAL1002'
        }
    )
    mentee_user.set_password('mentee123')  # Simple password for testing
    mentee_user.save()
    
    # Create profiles
    admin, _ = Admin.objects.get_or_create(
        user=admin_user,
        defaults={'privileges': 'Full Control'}
    )
    
    mentor, _ = Mentor.objects.get_or_create(
        user=mentor_user,
        defaults={
            'room_no': 'Room 205',
            'timetable': 'Monday-Friday: 10 AM - 4 PM',
            'department': 'Computer Science',
            'academic_background': 'PhD in AI',
            'post_in_hand': 'Professor'
        }
    )
    
    mentee, _ = Mentee.objects.get_or_create(
        user=mentee_user,
        defaults={
            'mentor': mentor,
            'course': 'B.Tech CSE',
            'year': 2,
            'attendance': 89.5,
            'academic': 'Good',
            'upcoming_event': 'AI Workshop',
            'alternate_contact': '9123456780'
        }
    )
    
    # Create achievement
    achievement, _ = Achievement.objects.get_or_create(
        name='Top Performer',
        defaults={
            'mentor': mentor,
            'mentee': mentee,
            'description': 'Excelled in AI Research',
            'badge_icon': 'badge1.png'
        }
    )
    
    # Create messages
    message1, _ = Message.objects.get_or_create(
        sender=mentor_user,
        receiver=mentee_user,
        content='Keep up the great work!',
        defaults={
            'is_read': False,
            'created_at': timezone.now()
        }
    )
    
    message2, _ = Message.objects.get_or_create(
        sender=mentee_user,
        receiver=mentor_user,
        content='Thank you for your guidance!',
        defaults={
            'is_read': False,
            'created_at': timezone.now()
        }
    )
    
    # Create meeting
    meeting, _ = Meeting.objects.get_or_create(
        mentor=mentor_user,
        mentee=mentee_user,
        title='Discuss AI Project',
        defaults={
            'description': 'Bring project documents',
            'scheduled_at': timezone.now() + timezone.timedelta(days=3),
            'duration': 30,
            'status': 'pending'
        }
    )
    
    # Create activity log
    activity_log, _ = ActivityLog.objects.get_or_create(
        user=mentor_user,
        in_time=timezone.now() - timezone.timedelta(days=2),
        defaults={
            'out_time': timezone.now() - timezone.timedelta(days=1),
            'activity_done': 'Checked mentee reports'
        }
    )
    
    print("Test data created successfully!")
    print("\nLogin Credentials:")
    print("Admin: email=bobjohnson@college.edu, password=admin123")
    print("Mentor: email=johndoe@college.edu, password=mentor123")
    print("Mentee: email=alicesmith@college.edu, password=mentee123")

if __name__ == '__main__':
    create_test_data() 