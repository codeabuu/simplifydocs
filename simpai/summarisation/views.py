from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from .models import UploadedFile
from .serializers import UploadedFileSerializer
from .utils import extract_text_from_pdf, summarize_text
#from .pdfgen import generate_pdf
# import os
# from django.conf import settings
# from django.http import FileResponse

class FileUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        file_serializer = UploadedFileSerializer(data=request.data)
        if file_serializer.is_valid():
            uploaded_file = file_serializer.save()
            file_path = uploaded_file.file.path

            #extract text
            text=extract_text_from_pdf(file_path)
            summary = summarize_text(text)

            return Response({"summary": summary}, status=200)
        else:
            return Response(file_serializer.errors, status=400)