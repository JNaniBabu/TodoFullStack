from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Create initial superuser if not exists'

    def handle(self, *args, **options):
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
        name = os.environ.get('DJANGO_SUPERUSER_NAME', 'Superuser')

        if not email or not password:
            self.stdout.write(self.style.ERROR(
                "Set DJANGO_SUPERUSER_EMAIL and DJANGO_SUPERUSER_PASSWORD"
            ))
            return

        if not User.objects.filter(email=email).exists():
            User.objects.create_superuser(
                email=email,
                password=password,
                name=name
            )
            self.stdout.write(self.style.SUCCESS(f'Superuser {email} created'))
        else:
            self.stdout.write(self.style.WARNING(f'Superuser {email} already exists'))
