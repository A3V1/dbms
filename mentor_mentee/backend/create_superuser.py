import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentor_mentee_system.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create superuser
if not User.objects.filter(username='admin').exists():
    user = User.objects.create_superuser(
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
    print("Superuser created successfully!")
    print("Username: admin")
    print("Password: admin123")
else:
    print("Superuser already exists!")
    # Update password
    user = User.objects.get(username='admin')
    user.set_password('admin123')
    user.save()
    print("Password reset to: admin123") 