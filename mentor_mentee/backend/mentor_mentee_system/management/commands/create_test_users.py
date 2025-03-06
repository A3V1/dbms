from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from mentor_mentee_system.models import Achievement

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates test users for the mentor-mentee system'

    def handle(self, *args, **kwargs):
        # Create mentor
        mentor, created = User.objects.get_or_create(
            email='mentor@test.com',
            defaults={
                'username': 'mentor',
                'first_name': 'John',
                'last_name': 'Doe',
                'role': 'mentor',
            }
        )
        if created:
            mentor.set_password('mentor123')
            mentor.save()
            self.stdout.write(self.style.SUCCESS(f'Created mentor user: {mentor.email}'))
        else:
            self.stdout.write(self.style.WARNING(f'Mentor user already exists: {mentor.email}'))

        # Create mentee
        mentee, created = User.objects.get_or_create(
            email='mentee@test.com',
            defaults={
                'username': 'mentee',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'role': 'mentee',
            }
        )
        if created:
            mentee.set_password('mentee123')
            mentee.save()
            self.stdout.write(self.style.SUCCESS(f'Created mentee user: {mentee.email}'))
        else:
            self.stdout.write(self.style.WARNING(f'Mentee user already exists: {mentee.email}'))

        # Create some achievements
        achievements = [
            {'name': 'First Meeting', 'description': 'Completed first mentorship meeting'},
            {'name': 'Quick Learner', 'description': 'Demonstrated exceptional learning ability'},
        ]

        for achievement_data in achievements:
            achievement, created = Achievement.objects.get_or_create(**achievement_data)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created achievement: {achievement.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Achievement already exists: {achievement.name}')) 