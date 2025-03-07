import os
import django
import sys

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentor_mentee_system.settings')
django.setup()

from django.contrib.auth import get_user_model
from mentor_mentee_system.models import Mentor, Mentee, Admin

User = get_user_model()

def create_test_users():
    # Create test users
    users = [
        {
            'email': 'admin@example.com',
            'password': 'admin123',
            'role': 'admin',
            'first_name': 'Admin',
            'last_name': 'User'
        },
        {
            'email': 'mentor@example.com',
            'password': 'mentor123',
            'role': 'mentor',
            'first_name': 'Mentor',
            'last_name': 'User'
        },
        {
            'email': 'mentee@example.com',
            'password': 'mentee123',
            'role': 'mentee',
            'first_name': 'Mentee',
            'last_name': 'User'
        }
    ]
    
    for user_data in users:
        # Create or update user
        user, created = User.objects.update_or_create(
            email=user_data['email'],
            defaults={
                'username': user_data['email'].split('@')[0],
                'password': user_data['password'],  # Store password as plain text
                'role': user_data['role'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'is_active': True
            }
        )
        
        # Create role-specific profile
        if user_data['role'] == 'admin':
            Admin.objects.get_or_create(user=user)
        elif user_data['role'] == 'mentor':
            Mentor.objects.get_or_create(
                user=user,
                defaults={
                    'room_no': 'Test Room',
                    'department': 'Test Department',
                    'academic_background': 'Test Background',
                    'post_in_hand': 'Test Position'
                }
            )
        elif user_data['role'] == 'mentee':
            mentor = Mentor.objects.first()
            if mentor:
                Mentee.objects.get_or_create(
                    user=user,
                    defaults={
                        'mentor': mentor,
                        'course': 'Test Course',
                        'year': 1,
                        'attendance': 100.0,
                        'academic': 'Good',
                        'upcoming_event': 'None'
                    }
                )
        
        print(f"Created/Updated {user_data['role']}: email={user_data['email']}, password={user_data['password']}")

if __name__ == '__main__':
    create_test_users() 