from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from .models import UploadedFile
from .serializers import UploadedFileSerializer
from .utils import extract_text_from_pdf, summarize_text, ask_question
from .pdfgen import generate_pdf
import os
from django.conf import settings
from django.http import FileResponse

class FileUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        file_serializer = UploadedFileSerializer(data=request.data)
        if file_serializer.is_valid():
            uploaded_file = file_serializer.save()
            file_path = uploaded_file.file.path

            #extract text
            text=extract_text_from_pdf(file_path)
            prompt_key = request.data.get('prompt_key', 'simple_summary')
            summary = summarize_text(text, prompt_key) #summarise text

            pdf_path = os.path.join(settings.MEDIA_ROOT, f'{uploaded_file.file.name}.pdf')
            generate_pdf(summary, pdf_path)

            with open(pdf_path, 'rb') as file:
                uploaded_file.file.save(f'{uploaded_file.file.name}.pdf', file)
            #server pdf for download
            response = FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{uploaded_file.file.name}.pdf"'
            return response
        else:
            return Response(file_serializer.errors, status=400)
        
class AskQuestionView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        file_serializer = UploadedFileSerializer(data=request.data)
        if file_serializer.is_valid():
            uploaded_file = file_serializer.save()
            file_path = uploaded_file.file.path

            text = extract_text_from_pdf(file_path)

            custom_prompt = request.data.get("custom_prompt")
            if not custom_prompt:
                return Response({"error": "Please enter your question."}, status=400)

            answer = ask_question(text, custom_prompt)
            return Response({"answer": answer})
        else:
            return Response(file_serializer.errors, status=400)