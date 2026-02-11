from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
            extra_fields.setdefault('is_staff', True)
            extra_fields.setdefault('is_superuser', True)
            if not password:
                raise ValueError('Superusers must have a password.')
            if not email:
                raise ValueError('Superusers must have an email.')

            return self.create_user(email, password, **extra_fields)



class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=50)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_pic = models.ImageField(upload_to='profiles/', null=True, blank=True)
    bio = models.TextField(blank=True)
    no_of_tasks = models.IntegerField(default=0)
    totalcompletion=models.IntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)
    streak = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.email}'s profile"
    
class TodoList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todolists')
    activity = models.TextField()
    dateTime = models.DateTimeField()
    done = models.BooleanField(default=False)
