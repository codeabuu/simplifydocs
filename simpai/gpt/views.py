from rest_framework.views import APIView
from django.http import JsonResponse
import requests
import json
from decouple import config
from openai import OpenAI

class AskGPTView(APIView):
    def post(self, request):
        if request.method == "POST":
            try:
                # Extracting the query from the request body
                body = json.loads(request.body)
                question = body.get("question", "").strip()

                if not question:
                    return JsonResponse({"error": "Query cannot be empty"}, status=400)

                # Send the query to Deepseeks API
                client = OpenAI(
                    api_key=config('DEEPSEEK_API_KEY'),
                    base_url="https://api.deepseek.com"
                )
                response = client.chat.completions.create(
                    model="deepseek-chat",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant answering user questions."},
                        {"role": "user", "content": question},
                    ],
                    stream=False
                )
                answer = response.choices[0].message.content
                return JsonResponse({"response": answer})
            except Exception as e:
                return JsonResponse({"error": f"Failed to process request: {str(e)}"}, status=500)