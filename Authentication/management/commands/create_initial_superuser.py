from django.core.management.base import BaseCommand
from django.conf import settings
from Authentication.models import User


class Command(BaseCommand):
    help = 'Creates an initial superuser from env variables'

    def handle(self, *args, **options):
        email = settings.DJANGO_SUPERUSER_EMAIL
        password = settings.DJANGO_SUPERUSER_PASSWORD
        name = settings.DJANGO_SUPERUSER_USERNAME

        if not User.objects.filter(email=email).exists():
            User.objects.create_superuser(email=email, password=password, name=name)
            self.stdout.write(self.style.SUCCESS(f'Superuser {email} created'))
        else:
            self.stdout.write('Superuser already exists')
