import axios from 'axios';
import { blob } from 'stream/consumers';

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
export const uploadPdf = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(
    `${API_BASE_URL}/summarisation/upload/`,
    formData,{
    headers: {
      'Content-Type': 'multipart/form-data'
  }
  });
  return response.data;
};

export const askCustom = async (fileId: string, custom_prompt: string): Promise<Blob> => {
  const response = await axios.post(`${API_BASE_URL}/summarisation/ask/`, {
    file_id: fileId,
    custom_prompt,
  },
  {
    //headers: { "Content-Type": "application/json" },
    responseType: 'blob',
  }
);
return response.data
};

export const summarizePdf = async (fileId: string, promptKey: string): Promise<Blob> => {
  const response = await axios.post(
    `${API_BASE_URL}/summarisation/summarize/`,
    {
      file_id: fileId,
      prompt_key: promptKey,
    },
    {
      responseType: 'blob', // Ensure the response is treated as a Blob
    }
  );
  return response.data; // This will be a Blob object
};

//gpt3 apis
export const askGPT = async (question: string) => {
  const response = await axios.post(`${API_BASE_URL}/gpt/ask/`, {
    question,
  });
  return response.data;
};