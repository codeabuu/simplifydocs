from rest_framework.views import APIView
from django.http import JsonResponse
import requests
import json

DEEPSEEK_API_URL = "https://api.deepseeks.com/gpt"  # Replace with actual Deepseeks API URL
DEEPSEEK_API_KEY = "your_deepseeks_api_key"  # Use your Deepseeks API Key

class AskGPTView(APIView):
    def post(self, request):
        if request.method == "POST":
            try:
                # Extracting the query from the request body
                body = json.loads(request.body)
                query = body.get("query", "").strip()

                if not query:
                    return JsonResponse({"error": "Query cannot be empty"}, status=400)

                # Send the query to Deepseeks API
                headers = {
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json",
                }

                data = {"query": query}
                response = requests.post(DEEPSEEK_API_URL, json=data, headers=headers)

                if response.status_code == 200:
                    result = response.json()
                    return JsonResponse({"response": result["answer"]})  # Adjust based on Deepseeks response format
                else:
                    return JsonResponse({"error": "Failed to get response from Deepseeks API"}, status=500)

            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)
        return JsonResponse({"error": "Invalid HTTP method. Only POST allowed."}, status=405)