from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from summarisation.views import FileUploadView, AskQuestionView
from . import views

urlpatterns = [
    path('summarisation/', views.index, name='index'),
    #path('summarisation/pdf_features/', TemplateView.as_view(template_name='pdf_features.html'), name='pdf-features'),
    path('summarisation/ask/', AskQuestionView.as_view(), name='ask-question'),
    path('summarisation/upload/', FileUploadView.as_view(), name='file-upload'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)