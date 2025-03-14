from PyPDF2 import PdfReader
from openai import OpenAI
from decouple import config
from gtts import gTTS
import os
from django.conf import settings
from decouple import config
from docx import Document


SUMMARIZATION_PROMPTS = {
    "professional_audience": "Condense this text into a summary suitable for a professional audience, retaining technical details.",
    "qa_format": "Summarize this document in a Q&A format with the most critical questions answered concisely.",
    "simple_summary": "Provide a simple and concise summary of this document.",
}


def split_text_into_chunks(text, max_tokens=60000):
    """
    Splits the text into chunks that fit within the token limit.

    Args:
        text (str): The text to split.
        max_tokens (int): The maximum number of tokens per chunk.

    Returns:
        list: A list of text chunks.
    """
    words = text.split()
    chunks = []
    current_chunk = []

    for word in words:
        current_chunk.append(word)
        if len(" ".join(current_chunk)) > max_tokens:
            chunks.append(" ".join(current_chunk))
            current_chunk = []

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

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
    
def extract_text_from_docx(file_path: str) -> str:
    """
        Extracts text from a given DOCX file.

        Args:
            file_path (str): The path to the DOCX file.

        Returns:
            str: The extracted text from the DOCX.
    """
    try:
        doc = Document(file_path)
        text = ""
        for para in doc.paragraphs:
            text += para.text
        return text
    except Exception as e:
        raise ValueError(f"Failed to extract text from DOCX: {e}")

def extract_text(file_path: str) -> str:
    """
        Extracts text from a given file.

        Args:
            file_path (str): The path to the file.

        Returns:
            str: The extracted text from the file.
    """
    try:
        if file_path.endswith(".pdf"):
            return extract_text_from_pdf(file_path)
        elif file_path.endswith(".docx"):
            return extract_text_from_docx(file_path)
        elif file_path.endswith(".txt"):
            return extract_text_from_docx(file_path)
        else:
            raise ValueError("Unsupported file format. Only PDF and DOCX files are supported at the moment.")
    except Exception as e:
        raise ValueError(f"Failed to extract text from file: {e}")

def summarize_text(text, prompt_key="simple_summary", max_tokens=60000):
    """
    Summarizes the given text using the DeepSeek API.

    Args:
        text (str): The text to be summarized.
        prompt_key (str): The key for the summarization prompt.
        max_tokens (int): The maximum number of tokens per chunk.

    Returns:
        str: The summarized text.
    """
    try:
        client = OpenAI(
            api_key=config("DEEPSEEK_API_KEY"),
            base_url="https://api.deepseek.com"
        )
        prompt = SUMMARIZATION_PROMPTS.get(prompt_key, SUMMARIZATION_PROMPTS["simple_summary"])

        # Split the text into chunks that fit within the token limit
        chunks = split_text_into_chunks(text, max_tokens)

        summaries = []
        for chunk in chunks:
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that summarizes text."},
                    {"role": "user", "content": f"{prompt}\n{chunk}"},
                ],
                stream=False
            )
            summaries.append(response.choices[0].message.content.strip())

        # Combine the summaries into a single summary
        combined_summary = " ".join(summaries)
        return combined_summary

    except Exception as e:
        raise ValueError(f"Failed to summarize text: {str(e)}")
    
def ask_question(text, custom_prompt):
    try:
        client = OpenAI(api_key=config("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com")
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that answers questions based on the provided text. If the question is unrelated to the text, respond with: 'This question is unrelated to the document or is not availbale in the document."},
                {"role": "user", "content": f"Text:\n{text}\n\nQuestion:\n{custom_prompt}"},
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