from django.shortcuts import render

def index(request):
    return render(request, 'summarisation/index.html')

def pdf_features(request):
    return render(request, 'summarisation/pdf_features.html')

def spreadsheet_view(request):
    return render(request, 'spreadsheet/index.html')