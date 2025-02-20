from django.shortcuts import render

def home(request):
    return render(request, 'snippets/base.html')

def pdf_features(request):
    return render(request, 'summarisation/pdf_features.html')

def spreadsheet_view(request):
    return render(request, 'spreadsheet/index.html')

