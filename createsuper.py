# create_superuser.py
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")
django.setup()

from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

username = getattr(settings, "DJANGO_SUPERUSER_USERNAME", None)
email = getattr(settings, "DJANGO_SUPERUSER_EMAIL", None)
password = getattr(settings, "DJANGO_SUPERUSER_PASSWORD", None)

if username and email and password:
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"Superuser {username} created!")
    else:
        print(f"Superuser {username} already exists.")
else:
    print("Superuser environment variables are missing!")
