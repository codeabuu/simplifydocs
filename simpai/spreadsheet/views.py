from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from .models import UploadedSpreadsheet
from .serializers import UploadedSpreadsheetSerializer
from .utils import parse_spreadsheet, analyze_data, generate_chart, ask_question
import os

# views.py
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from .models import UploadedSpreadsheet
from .serializers import UploadedSpreadsheetSerializer
from .utils import parse_spreadsheet, analyze_data, generate_chart, ask_question, preprocess_file
import os

class SpreadsheetUploadView(APIView):
    parser_classes = [MultiPartParser]

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
        chart_type = request.data.get('chart_type')  # e.g., 'bar', 'line', 'pie', 'scatter'
        try:
            spreadsheet = UploadedSpreadsheet.objects.get(id=file_id)
            file_path = spreadsheet.file.path

            # Parse the file
            data = parse_spreadsheet(file_path)

            # Generate the chart
            chart_base64 = generate_chart(data, chart_type)
            return Response({"chart": chart_base64})

        except Exception as e:
            return Response({"error": str(e)}, status=500)

class AskQuestionView(APIView):
    def post(self, request, *args, **kwargs):
        file_id = request.data.get('file_id')
        question = request.data.get('question')
        try:
            spreadsheet = UploadedSpreadsheet.objects.get(id=file_id)
            file_path = spreadsheet.file.path
            print(f"File path: {file_path}")

            # Preprocess the file to generate a summary
            data_summary = preprocess_file(file_path)

            # Ask the question using the data summary
            answer = ask_question(data_summary, question)
            return Response({"answer": answer})

        except Exception as e:
            return Response({"error": str(e)}, status=500)