from django.contrib import admin
from .models import User, Profile,TodoList

# Simple registration for User
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name',)  
    search_fields = ('email', 'name')  

# Simple registration for Profile
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio','no_of_tasks','totalcompletion', 'streak')
    search_fields = ('user__email', 'user__name')

@admin.register(TodoList)
class TodolistAdmin(admin.ModelAdmin):
    list_display = ('activity','dateTime','done')
    # search_fields = ('user__email', 'user__name')

