import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/';

export const uploadSpreadsheet = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/csv/upload/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const analyzeData = async (fileId: string,) => {
    const response = await axios.post(`${API_BASE_URL}/csv/analyze/`, {
        file_id: fileId,
    });
    return response.data;
};

export const generateCharts = async (fileId: string, sampleSize: number) => {
    const response = await axios.post(`${API_BASE_URL}/csv/chart/`, {
      file_id: fileId,
      sample_size: sampleSize,
    });
    return response.data.charts;
  };
  
  export const askQuestion = async (fileId: string, question: string) => {
    const response = await axios.post(`${API_BASE_URL}/csv/ask/`, {
      file_id: fileId,
      question,
    });
    return response.data;
  };

  //pdf apis
  // lib/api.ts
export const uploadPdf = async (formData: FormData) => {
  const response = await fetch('/upload/', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload PDF');
  }
  return response.json(); // { file_id: string, summary: string }
};

export const askCustom = async (fileId: string, prompt: string) => {
  const response = await fetch('/custom-prompt/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file_id: fileId, custom_prompt: prompt }),
  });
  if (!response.ok) {
    throw new Error('Failed to process custom prompt');
  }
  return response.json(); // { answer: string }
};
