# web: python manage.py migrate && python manage.py collectstatic --noinput && python create_superuser.py && gunicorn Backend.wsgi --bind 0.0.0.0:$PORT

web: python manage.py migrate && python manage.py create_initial_superuser && gunicorn Backend.wsgi --bind 0.0.0.0:$PORT

