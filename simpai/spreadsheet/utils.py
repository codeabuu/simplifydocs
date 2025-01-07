# utils.py
import pandas as pd
from openai import OpenAI
import matplotlib.pyplot as plt
import io
import base64
from decouple import config
import plotly.express as px
import os
from django.conf import settings
from openpyxl import load_workbook

# Initialize DeepSeek client
client = OpenAI(api_key=config('DEEPSEEK_API_KEY'), base_url="https://api.deepseek.com")

def save_to_temp(file):
    temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp')
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.name)
    with open(file_path, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
    return file_path

def parse_spreadsheet(file_path, sample_size=None):
    """
    Parse a spreadsheet file (CSV or Excel) and return a DataFrame.
    """
    if file_path.endswith('.csv'):
        data = pd.read_csv(file_path, nrows=sample_size)
    elif file_path.endswith('.xlsx') or file_path.endswith('.xls'):
        data = pd.read_excel(file_path, nrows=sample_size)
    else:
        raise ValueError("Unsupported file format. Please upload a CSV or Excel file.")
    return data

def analyze_data(data):
    """
    Analyze the dataset using DeepSeek's API and suggest a chart type.
    """
    data_str = data.to_string()
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": (
                "You are a data analysis assistant. Analyze the following dataset and suggest the most suitable chart type."
                "Respond in the following format:\n"
                "Chart type: <chart_type>\n"
                "Reason: <reason for the suggested chart type>\n"
                "Additional notes: <optional additional context or alternative chart types>"
                )},
            {"role": "user", "content": f"Dataset:\n{data_str}"},
        ],
        stream=False
    )
    return response.choices[0].message.content

def generate_chart(data, chart_type):
    """
    Generate a chart based on the dataset and chart type.
    """
    #plt.figure()
    if chart_type == 'bar':
        #data.plot(kind='bar')
         fig = px.bar(data, x=data.columns[0], y=data.columns[1])
    elif chart_type == 'line':
        #data.plot(kind='line')
        fig = px.line(data, x=data.columns[0], y=data.columns[1])
    elif chart_type == 'pie':
        #data.plot(kind='pie', y=data.columns[1])  # Assuming the second column is the value
        fig = px.pie(data, names=data.columns[0], values=data.columns[1])
    elif chart_type == 'scatter':
        #data.plot(kind='scatter', x=data.columns[0], y=data.columns[1])
        fig = px.scatter(data, x=data.columns[0], y=data.columns[1])
    else:
        raise ValueError("Unsupported chart type.")

    # Save the chart to a buffer
    buf = io.BytesIO()
    #plt.savefig(buf, format='png')
    #plt.close()
    fig.write_image(buf, format='png', engine='kaleido')
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

def preprocess_file(file_path):
    """
    Detect the file type (CSV or Excel) and preprocess it accordingly.
    """
    try:
        # Determine file type based on extension
        if file_path.endswith('.csv'):
            data = pd.read_csv(file_path)
        elif file_path.endswith('.xlsx'):
            data = pd.read_excel(file_path, engine='openpyxl')
        elif file_path.endswith('.xls'):
            data = pd.read_excel(file_path, engine='xlrd')
        else:
            raise ValueError("Unsupported file format. Please upload .csv, .xlsx, or .xls files.")
        
        # Generate a summary
        summary = {
            "columns": data.columns.tolist(),
            "data_types": data.dtypes.astype(str).tolist(),
            "sample_data": data.head(10).to_dict(orient='records'),
            "numeric_summary": data.describe().to_dict()
        }
        return summary

    except Exception as e:
        raise ValueError(f"Error processing file: {str(e)}")

def ask_question(data_summary, question):
    """
    Answer a user's question about the dataset using DeepSeek's API.
    """
    summary_str = (
        f"Columns: {data_summary['columns']}\n"
        f"Data Types: {data_summary['data_types']}\n"
        f"Sample Data: {data_summary['sample_data']}\n"
        f"Numeric Summary: {data_summary['numeric_summary']}"
    )
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "You are a data analysis assistant. Answer the user's question based on the following dataset summary."},
            {"role": "user", "content": f"Dataset Summary:\n{summary_str}\n\nQuestion: {question}"},
        ],
        stream=False
    )
    return response.choices[0].message.content