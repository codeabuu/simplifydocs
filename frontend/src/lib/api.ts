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

export const askCustom = async (fileId: string, question: string) => {
  const response = await axios.post(`${API_BASE_URL}/summarisation/ask/`, {
    file_id: fileId,
    question,
  });
  return response.data;
};

export const summarizePdf = async (fileId: string, promptKey: string = 'simple_summary') => {
  const response = await axios.post(`${API_BASE_URL}/summarisation/summarize/`, {
    file_id: fileId,
    prompt_key: promptKey,
  });
  return response.data;
};