from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from summarisation.views import FileUploadView, AskQuestionsView, SummarizeView
from spreadsheet.views import SpreadsheetUploadView, AnalyzeDataView, GenerateChartView, AskQuestionView
from . import views


urlpatterns = [
    path('csv/upload/', SpreadsheetUploadView.as_view(), name='upload_spreadsheet'),
    path('csv/analyze/', AnalyzeDataView.as_view(), name='analyze_data'),
    path('csv/chart/', GenerateChartView.as_view(), name='generate_chart'),
    path('csv/ask/', AskQuestionView.as_view(), name='ask_question'),
    path('csv/', views.spreadsheet_view, name='spreadsheet'),

    path('summarisation/', views.index, name='index'),
    #path('summarisation/pdf_features/', TemplateView.as_view(template_name='pdf_features.html'), name='pdf-features'),
    path('summarisation/ask/', AskQuestionsView.as_view(), name='ask-question'),
    path('summarisation/upload/', FileUploadView.as_view(), name='file-upload'),
    path('summarisation/summarize/', SummarizeView.as_view(), name='summarize'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)