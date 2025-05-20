from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from .models import UploadedSpreadsheet
from .serializers import UploadedSpreadsheetSerializer
from .utils import parse_spreadsheet, analyze_data, generate_dynamic_charts, ask_question, preprocess_file, preprocess_file_ask
import os
import pandas as pd
from rest_framework.permissions import IsAuthenticated
import uuid
import logging
import numpy as np
from django.http import StreamingHttpResponse
import json
import time
from django.core.cache import cache

def clean_dataframe(df):
    """Replace NaN, Infinity, and -Infinity with None for JSON serialization."""
    return df.replace([np.nan, np.inf, -np.inf], None)

class SpreadsheetUploadView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Save the uploaded file
        file_serializer = UploadedSpreadsheetSerializer(data=request.data)
        if file_serializer.is_valid():
            spreadsheet = file_serializer.save()
            file_path = spreadsheet.file.path

            cache_key = f"spreadsheet_preview_{spreadsheet.id}"
            preview = cache.get(cache_key)

            

            print(f"Uploaded Spreadsheet ID: {spreadsheet.id}")  
            # Parse the file
            try:
                data = parse_spreadsheet(file_path)
                data = clean_dataframe(data)
                preview = data.head().to_dict(orient='records')

                request.session['analyzed_data'] = None
                request.session['generated_charts'] = None
                request.session['question_answers'] = None

                return Response({"preview": preview, "file_id": spreadsheet.id})
            except ValueError as e:
                return Response({"error": str(e)}, status=400)
        else:
            return Response(file_serializer.errors, status=400)

class AnalyzeDataView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_id = request.data.get('file_id')
        sample_size = request.data.get('sample_size', 10)
        print(f"Received file_id: {file_id}")

        if not file_id:
            return Response({"error": "file_id is required."}, status=400)
        
        try:
            spreadsheet = UploadedSpreadsheet.objects.get(id=file_id)
            file_path = spreadsheet.file.path

            # Parse the file
            data = parse_spreadsheet(file_path, sample_size=int(sample_size))
            # data = clean_dataframe(data)

            # Analyze the data
            chart_suggestion = analyze_data(data)
            request.session['analyzed_data'] = chart_suggestion

            return Response({"chart_suggestion": chart_suggestion})

        except Exception as e:
            return Response({"error": str(e)}, status=500)

class GenerateChartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_id = request.data.get('file_id')
        sample_size = request.data.get('sample_size', 1000)
        
        if not file_id:
            return Response({"error": "file_id is required."}, status=400)
        
        try:
            spreadsheet = UploadedSpreadsheet.objects.get(id=file_id)
            file_path = spreadsheet.file.path

            # Parse the file
            data = preprocess_file(file_path)

            # Ensure data is a DataFrame
            if isinstance(data, dict):
                data = pd.DataFrame(data)
            
            # data = clean_dataframe(data)
            if sample_size is not None:
                charts = generate_dynamic_charts(data, sample_size=int(sample_size))
            # Generate dynamic charts
            else:
                charts = generate_dynamic_charts(data)
            if not charts:
                return Response({"error": "No suitable chart found for the dataset."}, status=400)
            
            request.session['generated_charts'] = charts

            return Response({"charts": charts})

        except ValueError as e:
            return Response({"error": str(e)}, status=400)

        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=500)


from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import StreamingHttpResponse
from .models import UploadedSpreadsheet
from .utils import preprocess_file_ask, ask_question
from asgiref.sync import sync_to_async
import json
import time
from spreadsheet.utils import ask_question

class AskQuestionView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def post(self, request, *args, **kwargs):
        file_id = request.data.get('file_id')
        question = request.data.get('question')

        if not file_id:
            return Response({"error": "file_id is required."}, status=400)

        if not question:
            return Response({"error": "Please enter your question."}, status=400)

        try:
            # Retrieve the uploaded file asynchronously
            spreadsheet = UploadedSpreadsheet.objects.get(id=file_id)
            file_path = spreadsheet.file.path
            print(f"File path: {file_path}")

            # Preprocess the file to generate a summary
            data_summary = preprocess_file_ask(file_path)

            # Stream the response back to the frontend
            def stream_response():
                answer = ask_question(data_summary, question)
                for word in answer.split():
                    yield f"data: {json.dumps({'word': word})}\n\n"
                    time.sleep(0.1)

            response = StreamingHttpResponse(stream_response(), content_type='text/event-stream')
            response['Cache-Control'] = 'no-cache'
            return response

        except UploadedSpreadsheet.DoesNotExist:
            return Response({"error": "File not found or access denied."}, status=404)

        except Exception as e:
            return Response({"error": str(e)}, status=500)