from PyPDF2 import PdfReader
from openai import OpenAI
from decouple import config
from gtts import gTTS
import os
from django.conf import settings
from decouple import config

SUMMARIZATION_PROMPTS = {
    "professional_audience": "Condense this text into a summary suitable for a professional audience, retaining technical details.",
    "qa_format": "Summarize this document in a Q&A format with the most critical questions answered concisely.",
    "simple_summary": "Provide a simple and concise summary of this document.",
}

def extract_text_from_pdf(file_path: str) -> str:
    """
        Extracts text from a given PDF file.

        Args:
            file_path (str): The path to the PDF file.

        Returns:
            str: The extracted text from the PDF.
    """
    try:
        with open(file_path, 'rb') as file:
            reader = PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            return text
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {e}")
    
def summarize_text(text, prompt_key="simple_summary") -> str:
    """
        Summarizes the given text using the DeepSeek API.

        Args:
            text (str): The text to be summarized.

        Returns:
            str: The summarized text.
    """
    try:
        client=OpenAI(
            api_key=config("DEEPSEEK_API_KEY"),
            base_url="https://api.deepseek.com"
            )
        prompt=SUMMARIZATION_PROMPTS.get(prompt_key, SUMMARIZATION_PROMPTS["simple_summary"])
        #call deepseeks summarisation api
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system",
                "content": "You are a helpful assistant that summarizes: "},
                {"role": "user",
                "content": f"{prompt}\n{text}"},
                ],
                stream=False
        )
        #return our summirised text
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise ValueError(f"Failed to summarize text: {e}")
    
def ask_question(text, question):
    try:
        client = OpenAI(api_key=config("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com")
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that answers questions based on the provided text. If the question is unrelated to the text, respond with: 'This question is unrelated to the document or is not availbale in the document."},
                {"role": "user", "content": f"Text:\n{text}\n\nQuestion:\n{question}"},
            ],
            stream=False
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error answering question: {str(e)}"
    
def text_to_speech(text, filename):
    try:
        tts = gTTS(text=text, lang='en')
        audio_path = os.path.join(settings.MEDIA_ROOT, f"{filename}.mp3")
        tts.save(audio_path)
        return audio_path
    except Exception as e:
        raise ValueError(f"Failed to convert text to speech: {e}")