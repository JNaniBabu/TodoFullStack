
from django.contrib import admin
from django.urls import re_path
from django.urls import path,include
from django.conf import settings

from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('Authentication.urls'))
] 


urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
    }),
]