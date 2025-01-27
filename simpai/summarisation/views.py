from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import UploadedFile
from .serializers import UploadedFileSerializer
from .utils import (
    extract_text,
    summarize_text,
    ask_question,
    text_to_speech
)
from .pdfgen import generate_pdf
import os
from django.conf import settings
from django.http import FileResponse
from rest_framework.parsers import JSONParser

class FileUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        # Save the uploaded file
        file_serializer = UploadedFileSerializer(data=request.data)
        if file_serializer.is_valid():
            uploaded_file = file_serializer.save()
            file_id = uploaded_file.id
            return Response({"file_id": file_id})
        return Response(file_serializer.errors, status=400)

class SummarizeView(APIView):
    parser_classes = [JSONParser]

    def post(self, request, *args, **kwargs):
        file_id = request.data.get("file_id")
        prompt_key = request.data.get("prompt_key", "simple_summary")

        if not file_id:
            return Response({"error": "file_id is required."}, status=400)

        try:
            # Retrieve the uploaded file
            uploaded_file = UploadedFile.objects.get(id=file_id)
            file_path = uploaded_file.file.path

            # Extract text from the file
            text = extract_text(file_path)

            # Summarize the text
            summary = summarize_text(text, prompt_key)

            pdf_path = os.path.join(settings.MEDIA_ROOT, f"{uploaded_file.file.name}_summary.pdf")
            generate_pdf(summary, pdf_path)

            response = FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{uploaded_file.file.name}_summary.pdf"'
            return response

        except UploadedFile.DoesNotExist:
            return Response({"error": "Invalid file_id. File not found."}, status=404)

        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class AskQuestionsView(APIView):
    parser_classes = [JSONParser]
    def post(self, request, *args, **kwargs):
        file_id = request.data.get("file_id")
        custom_prompt = request.data.get("custom_prompt")

        if not file_id:
            return Response({"error": "file_id is required."}, status=400)

        if not custom_prompt:
            return Response({"error": "Please enter your question."}, status=400)

        try:
            # Retrieve the uploaded file
            uploaded_file = UploadedFile.objects.get(id=file_id)
            file_path = uploaded_file.file.path

            # Extract text
            text = extract_text(file_path)

            # Ask the question using the custom prompt
            answer = ask_question(text, custom_prompt)

            pdf_path = os.path.join(settings.MEDIA_ROOT, f"{uploaded_file.file.name}_answer.pdf")
            generate_pdf(answer, pdf_path)

            # Serve the PDF for download
            response = FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{uploaded_file.file.name}_answer.pdf"'
            return response

        except UploadedFile.DoesNotExist:
            return Response({"error": "Invalid file_id. File not found."}, status=404)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


class GenerateOriginalAudioView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        file_id = request.data.get("file_id")

        if not file_id:
            return Response({"error": "file_id is required."}, status=400)

        try:
            uploaded_file = UploadedFile.objects.get(id=file_id)
            file_path = uploaded_file.file.path

            # Extract text from the file
            text = extract_text(file_path)

            # Convert text to audio
            audio_path = text_to_speech(text, "original_audio")

            # Serve the audio file
            response = FileResponse(open(audio_path, 'rb'), content_type='audio/mpeg')
            response['Content-Disposition'] = 'attachment; filename="original_audio.mp3"'
            return response

        except UploadedFile.DoesNotExist:
            return Response({"error": "Invalid file_id. File not found."}, status=404)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

class GenerateSummaryAudioView(APIView):
    def post(self, request, *args, **kwargs):
        file_id = request.data.get("file_id")
        prompt_key = request.data.get("prompt_key", "simple_summary")

        if not file_id:
            return Response({"error": "file_id is required."}, status=400)

        try:
            uploaded_file = UploadedFile.objects.get(id=file_id)
            file_path = uploaded_file.file.path

            # Extract text from the file
            text = extract_text(file_path)

            # Summarize the text
            summary = summarize_text(text, prompt_key)

            # Convert the summary to audio
            audio_path = text_to_speech(summary, "summary_audio")

            # Serve the audio file
            response = FileResponse(open(audio_path, 'rb'), content_type='audio/mpeg')
            response['Content-Disposition'] = 'attachment; filename="summary_audio.mp3"'
            return response

        except UploadedFile.DoesNotExist:
            return Response({"error": "Invalid file_id. File not found."}, status=404)

        except Exception as e:
            return Response({"error": str(e)}, status=500)
