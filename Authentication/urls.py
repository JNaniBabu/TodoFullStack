from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView
from .views import Registration,Login,ProfileData,UpdateProfileData,TodolistData,AddToDo,RemoveToDo,DoneToDo,SaveToDo,Reset,Logout,Refresh_Access_Token

urlpatterns=[
    path('register/',Registration),
    path('reset/',Reset),
    path('login/',Login),
    path('profile/',ProfileData),
    path('update-profile/',UpdateProfileData),
    path('todolist/',TodolistData),
    path('AddToDo/',AddToDo),
    path('save/<int:id>/',SaveToDo),
    path('DoneToDo/<int:id>/',DoneToDo),
    path('delete/<int:id>/',RemoveToDo),
    path('refresh/',Refresh_Access_Token),
    path('logout/',Logout)
    
]







