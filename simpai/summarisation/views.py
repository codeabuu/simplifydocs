from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
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
import threading

# Global flag and lock for concurrency control
is_processing = False
lock = threading.Lock()

class FileUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        global is_processing

        with lock:  # Ensure thread safety
            if is_processing:
                return Response({"error": "Another process is already ongoing. Please wait."}, status=400)
            
            is_processing = True  # Set the flag to indicate a process is ongoing

        try:
            file_serializer = UploadedFileSerializer(data=request.data)
            if file_serializer.is_valid():
                uploaded_file = file_serializer.save()
                file_path = uploaded_file.file.path

                # Extract text
                text = extract_text(file_path)
                prompt_key = request.data.get('prompt_key', 'simple_summary')
                summary = summarize_text(text, prompt_key)  # Summarize text

                # Generate PDF
                pdf_path = os.path.join(settings.MEDIA_ROOT, f'{uploaded_file.file.name}.pdf')
                generate_pdf(summary, pdf_path)

                with open(pdf_path, 'rb') as file:
                    uploaded_file.file.save(f'{uploaded_file.file.name}.pdf', file)

                # Serve PDF for download
                response = FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename="{uploaded_file.file.name}.pdf"'
                return response
            else:
                return Response(file_serializer.errors, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        finally:
            with lock:
                is_processing = False  # Reset the flag when the process is done

class AskQuestionView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        global is_processing

        with lock:  # Ensure thread safety
            if is_processing:
                return Response({"error": "Another process is already ongoing. Please wait."}, status=400)
            
            is_processing = True  # Set the flag to indicate a process is ongoing

        try:
            file_serializer = UploadedFileSerializer.objects.get(data=request.data)
            if file_serializer.is_valid():
                uploaded_file = file_serializer.save()
                file_path = uploaded_file.file.path

                # Extract text
                text = extract_text(file_path)

                # Ask the question
                custom_prompt = request.data.get("custom_prompt")
                if not custom_prompt:
                    return Response({"error": "Please enter your question."}, status=400)

                answer = ask_question(text, custom_prompt)
                return Response({"answer": answer})
            else:
                return Response(file_serializer.errors, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        finally:
            with lock:
                is_processing = False  # Reset the flag when the process is done

from django.http import FileResponse
from .utils import text_to_speech

class GenerateOriginalAudioView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        try:
            file_serializer = UploadedFileSerializer(data=request.data)
            if file_serializer.is_valid():
                uploaded_file = file_serializer.save()
                file_path = uploaded_file.file.path

                # Extract text from the original PDF
                text = extract_text(file_path)

                # Convert text to audio
                audio_path = text_to_speech(text, "original_audio")

                # Serve the audio file
                response = FileResponse(open(audio_path, 'rb'), content_type='audio/mpeg')
                response['Content-Disposition'] = f'attachment; filename="original_audio.mp3"'
                return response
            else:
                return Response(file_serializer.errors, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class GenerateSummaryAudioView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        try:
            file_serializer = UploadedFileSerializer(data=request.data)
            if file_serializer.is_valid():
                uploaded_file = file_serializer.save()
                file_path = uploaded_file.file.path

                # Extract text from the original PDF
                text = extract_text(file_path)

                # Summarize the text
                prompt_key = request.data.get('prompt_key', 'simple_summary')
                summary = summarize_text(text, prompt_key)

                # Convert summary to audio
                audio_path = text_to_speech(summary, "summary_audio")

                # Serve the audio file
                response = FileResponse(open(audio_path, 'rb'), content_type='audio/mpeg')
                response['Content-Disposition'] = f'attachment; filename="summary_audio.mp3"'
                return response
            else:
                return Response(file_serializer.errors, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)