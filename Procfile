# web: python manage.py migrate && python manage.py collectstatic --noinput && python create_superuser.py && gunicorn Backend.wsgi --bind 0.0.0.0:$PORT


web: python manage.py migrate && python manage.py collectstatic --noinput && python manage.py createsuperuser --noinput --username $DJANGO_SUPERUSER_USERNAME --email $DJANGO_SUPERUSER_EMAIL && gunicorn Backend.wsgi --bind 0.0.0.0:$PORT
