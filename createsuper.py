# create_superuser.py
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")
django.setup()

from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

if not User.objects.filter(username=settings.DJANGO_SUPERUSER_USERNAME).exists():
    User.objects.create_superuser(
        username=settings.DJANGO_SUPERUSER_USERNAME,
        email=settings.DJANGO_SUPERUSER_EMAIL,
        password=settings.DJANGO_SUPERUSER_PASSWORD
    )
    print("Superuser created!")
else:
    print("Superuser already exists.")
