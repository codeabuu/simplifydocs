from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from summarisation.views import FileUploadView
from . import views
urlpatterns = [
    path('summarisation/', views.index, name='index'),
    path('summarisation/upload/', FileUploadView.as_view(), name='file-upload'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)