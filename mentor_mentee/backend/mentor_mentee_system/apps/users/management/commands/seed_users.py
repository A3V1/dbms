from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with test users'

    def handle(self, *args, **options):
        # Create admin user
        if not User.objects.filter(email='admin@example.com').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123',
                first_name='Admin',
                last_name='User',
                role='admin'
            )

        # Create mentor users
        mentors = [
            {
                'username': 'mentor1',
                'email': 'mentor1@example.com',
                'password': 'mentor123',
                'first_name': 'Mentor',
                'last_name': 'One',
                'role': 'mentor'
            },
            {
                'username': 'mentor2',
                'email': 'mentor2@example.com',
                'password': 'mentor123',
                'first_name': 'Mentor',
                'last_name': 'Two',
                'role': 'mentor'
            },
        ]

        for mentor in mentors:
            if not User.objects.filter(email=mentor['email']).exists():
                User.objects.create_user(**mentor)

        # Create mentee users
        mentees = [
            {
                'username': 'mentee1',
                'email': 'mentee1@example.com',
                'password': 'mentee123',
                'first_name': 'Mentee',
                'last_name': 'One',
                'role': 'mentee'
            },
            {
                'username': 'mentee2',
                'email': 'mentee2@example.com',
                'password': 'mentee123',
                'first_name': 'Mentee',
                'last_name': 'Two',
                'role': 'mentee'
            },
            {
                'username': 'mentee3',
                'email': 'mentee3@example.com',
                'password': 'mentee123',
                'first_name': 'Mentee',
                'last_name': 'Three',
                'role': 'mentee'
            },
        ]

        for mentee in mentees:
            if not User.objects.filter(email=mentee['email']).exists():
                User.objects.create_user(**mentee)

        self.stdout.write(self.style.SUCCESS('Successfully seeded test users')) 