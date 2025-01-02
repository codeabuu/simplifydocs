from PyPDF2 import PdfReader
from openai import OpenAI
from decouple import config

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
    
def summarize_text(text):
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

        #call deepseeks summarisation api
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system",
                "content": "You are a helpful assistant that summarizes: "},
                {"role": "user",
                "content": f"Create a bullet-point summary for each chapter or section of this PDF, focusing on the most critical details.:\n{text}"},
                ],
                stream=False
        )
        #return our summirised text
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise ValueError(f"Failed to summarize text: {e}")