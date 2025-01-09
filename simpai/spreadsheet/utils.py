# utils.py
import pandas as pd
from openai import OpenAI
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64
from decouple import config
import plotly.express as px
import os
from django.conf import settings
import seaborn as sns
from concurrent.futures import ThreadPoolExecutor
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

def ask_question(data_summary, question):
    """
    Answer a user's question about the dataset using DeepSeek's API.
    """
    chart_keywords = ["generate chart", "generate a bar chart","create chart", "make chart", "plot chart",
        "generate graph", "create graph", "make graph", "plot graph",
        "visualize data", "show chart", "show graph", "draw chart", "draw graph"]

    if any(keyword in question.lower() for keyword in chart_keywords):
        return (
            "It looks like you're asking about chart generation. "
            "Please use the 'Generate Chart' feature on the platform to create visualizations for your dataset. "
            "If you have other questions, let me know!"
        )
    summary_str = (
        f"Columns: {data_summary['columns']}\n"
        f"Data Types: {data_summary['data_types']}\n"
        f"Sample Data: {data_summary['sample_data']}\n"
        f"Numeric Summary: {data_summary['numeric_summary']}"
    )
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": (
                "You are a data analysis assistant."
                "Answer the user's question strictly based on the provided dataset summary."
                "If the question is unrelated to the dataset, respond with 'I'm sorry, I can only answer questions related to the dataset.'"
                )},
            {"role": "user", "content": f"Dataset Summary:\n{summary_str}\n\nQuestion: {question}"},
        ],
        stream=False
    )
    return response.choices[0].message.content

def preprocess_file_ask(file_path):
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
        return data
    except Exception as e:
        raise ValueError(f"Error processing file: {str(e)}")

def generate_dynamic_charts(data, sample_size=1000):
    """
    Automatically generate charts based on the data structure.
    
    Args:
        data (DataFrame): The dataset.
        sample_size (int): Number of rows to sample for chart generation.
    
    Returns:
        dict: A dictionary of chart names and base64-encoded images.
    """
    charts = {}
    try:
        # Sample the data if it's too large
        if len(data) > sample_size:
            data = data.sample(sample_size)

        # Analyze column types
        numeric_columns = data.select_dtypes(include=["number"]).columns.tolist()
        categorical_columns = data.select_dtypes(include=["object", "category"]).columns.tolist()
        date_like_columns = [col for col in data.columns if pd.api.types.is_datetime64_any_dtype(data[col]) or "date" in col.lower() or "year" in col.lower()]

        # Generate charts concurrently
        with ThreadPoolExecutor() as executor:
            # Line Charts
            if date_like_columns and numeric_columns:
                for date_col in date_like_columns:
                    for num_col in numeric_columns:
                        future = executor.submit(generate_line_chart, data, date_col, num_col)
                        charts[f"Line Chart ({date_col} vs {num_col})"] = future.result()

            # Bar Charts
            if categorical_columns and numeric_columns:
                for cat_col in categorical_columns:
                    for num_col in numeric_columns:
                        future = executor.submit(generate_bar_chart, data, cat_col, num_col)
                        charts[f"Bar Chart ({cat_col} vs {num_col})"] = future.result()

            # Pie Charts
            if categorical_columns:
                for cat_col in categorical_columns:
                    future = executor.submit(generate_pie_chart, data, cat_col)
                    charts[f"Pie Chart ({cat_col})"] = future.result()

            # Scatter Plots
            if len(numeric_columns) > 1:
                for i in range(len(numeric_columns)):
                    for j in range(i + 1, len(numeric_columns)):
                        future = executor.submit(generate_scatter_plot, data, numeric_columns[i], numeric_columns[j])
                        charts[f"Scatter Plot ({numeric_columns[i]} vs {numeric_columns[j]})"] = future.result()

    except Exception as e:
        raise ValueError(f"Error generating charts: {str(e)}")

    return charts

def save_chart_to_base64():
    """
    Save the current matplotlib figure to a Base64 string.
    """
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    base64_image = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close()
    return base64_image

def generate_line_chart(data, x_col, y_col):
    """Generate a line chart."""
    plt.figure(figsize=(10, 6))
    sns.lineplot(data=data, x=x_col, y=y_col, marker="o")
    plt.title(f"Trend Over Time ({x_col} vs {y_col})")
    return save_chart_to_base64()

def generate_bar_chart(data, x_col, y_col):
    """Generate a bar chart."""
    plt.figure(figsize=(10, 6))
    sns.barplot(data=data, x=x_col, y=y_col, ci=None)
    plt.title(f"Bar Chart ({x_col} vs {y_col})")
    plt.xticks(rotation=45)
    return save_chart_to_base64()

def generate_pie_chart(data, col):
    """Generate a pie chart."""
    plt.figure(figsize=(8, 8))
    data[col].value_counts().plot.pie(autopct='%1.1f%%', startangle=90)
    plt.title(f"Pie Chart ({col}) Proportions")
    plt.ylabel("")
    return save_chart_to_base64()

def generate_scatter_plot(data, x_col, y_col):
    """Generate a scatter plot."""
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=data, x=x_col, y=y_col)
    plt.title(f"Scatter Plot ({x_col} vs {y_col})")
    return save_chart_to_base64()