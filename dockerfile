# Use Python 3.12 slim as base
FROM python:3.12-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements first (better caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the rest of the project
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Collect static files (if using whitenoise)
RUN python manage.py collectstatic --noinput

# Start the app with gunicorn
CMD ["gunicorn", "Backend.wsgi:application", "--bind", "0.0.0.0:8000"]
