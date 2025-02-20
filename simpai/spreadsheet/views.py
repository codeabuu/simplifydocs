from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from .models import UploadedSpreadsheet
from .serializers import UploadedSpreadsheetSerializer
from .utils import parse_spreadsheet, analyze_data, generate_dynamic_charts, ask_question, preprocess_file, preprocess_file_ask
import os
import pandas as pd
from rest_framework.permissions import IsAuthenticated

class SpreadsheetUploadView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Save the uploaded file
        file_serializer = UploadedSpreadsheetSerializer(data=request.data)
        if file_serializer.is_valid():
            spreadsheet = file_serializer.save()
            file_path = spreadsheet.file.path

            # Parse the file
            try:
                data = parse_spreadsheet(file_path)
                preview = data.head().to_dict(orient='records')
                return Response({"preview": preview, "file_id": spreadsheet.id})
            except ValueError as e:
                return Response({"error": str(e)}, status=400)
        else:
            return Response(file_serializer.errors, status=400)

class AnalyzeDataView(APIView):
    def post(self, request, *args, **kwargs):
        file_id = request.data.get('file_id')
        sample_size = request.data.get('sample_size', 10)
        print(f"Received file_id: {file_id}")
        try:
            spreadsheet = UploadedSpreadsheet.objects.get(id=file_id)
            file_path = spreadsheet.file.path

            # Parse the file
            data = parse_spreadsheet(file_path, sample_size=int(sample_size))

            # Analyze the data
            chart_suggestion = analyze_data(data)
            return Response({"chart_suggestion": chart_suggestion})

        except Exception as e:
            return Response({"error": str(e)}, status=500)

class GenerateChartView(APIView):
    def post(self, request, *args, **kwargs):
        file_id = request.data.get('file_id')
        sample_size = request.data.get('sample_size', 1000)
        
        try:
            spreadsheet = UploadedSpreadsheet.objects.get(id=file_id)
            file_path = spreadsheet.file.path

            # Parse the file
            data = preprocess_file(file_path)

            # Ensure data is a DataFrame
            if isinstance(data, dict):
                data = pd.DataFrame(data)
            
            if sample_size is not None:
                charts = generate_dynamic_charts(data, sample_size=int(sample_size))
            # Generate dynamic charts
            else:
                charts = generate_dynamic_charts(data)
            if not charts:
                return Response({"error": "No suitable chart found for the dataset."}, status=400)
            
            return Response({"charts": charts})

        except ValueError as e:
            return Response({"error": str(e)}, status=400)

        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=500)

class AskQuestionView(APIView):
    def post(self, request, *args, **kwargs):
        file_id = request.data.get('file_id')
        question = request.data.get('question')
        try:
            spreadsheet = UploadedSpreadsheet.objects.get(id=file_id)
            file_path = spreadsheet.file.path
            print(f"File path: {file_path}")

            # Preprocess the file to generate a summary
            data_summary = preprocess_file_ask(file_path)

            # Ask the question using the data summary
            answer = ask_question(data_summary, question)
            return Response({"answer": answer})

        except Exception as e:
            return Response({"error": str(e)}, status=500)