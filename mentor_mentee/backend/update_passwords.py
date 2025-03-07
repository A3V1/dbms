import os
import django
import sys

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentor_mentee_system.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

def update_passwords():
    # Define users and their passwords
    users = [
        {'email': 'johndoe@college.edu', 'password': 'mentor123'},
        {'email': 'alicesmith@college.edu', 'password': 'mentee123'},
        {'email': 'bobjohnson@college.edu', 'password': 'admin123'}
    ]
    
    # Update each user's password
    for user_data in users:
        try:
            user = User.objects.get(email=user_data['email'])
            user.password = make_password(user_data['password'])
            user.save()
            print(f"Updated password for {user.email}")
        except User.DoesNotExist:
            print(f"User with email {user_data['email']} not found")
    
    # Create admin user if it doesn't exist
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123',
            first_name='Admin',
            last_name='User',
            official_mail_id='admin@example.com',
            phone_number='9999999999',
            prn_id_no='ADMIN001',
            role='admin'
        )
        print("Created admin user with username 'admin' and password 'admin123'")
    else:
        admin = User.objects.get(username='admin')
        admin.set_password('admin123')
        admin.save()
        print("Reset password for admin user to 'admin123'")
    
    print("\nLogin Credentials:")
    print("Admin: email=bobjohnson@college.edu, password=admin123")
    print("Mentor: email=johndoe@college.edu, password=mentor123")
    print("Mentee: email=alicesmith@college.edu, password=mentee123")
    print("Superuser: username=admin, password=admin123")

if __name__ == '__main__':
    update_passwords() 