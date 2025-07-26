import axios, {AxiosError} from 'axios';
import path from 'path';
import { blob } from 'stream/consumers';
// import { Navigate, useNavigate } from "react-router-dom";

const API_BASE_URL = 'https://simpai.fly.dev/';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };
};


export const uploadSpreadsheet = async (
  file: File,
  onProgress?: (progress: number) => void
) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axios.post(`${API_BASE_URL}csv/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Token ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    console.log("Upload Response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Upload Error Response:", error.response?.data);
    } else {
      console.error("Unexpected Upload Error:", error);
    }
    throw error;
  }
};

export const analyzeData = async (fileId: string,) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(`${API_BASE_URL}/csv/analyze/`, {
        file_id: fileId,
    }, {
      headers: {
        'Authorization': `Token ${token}`,
      }
    });
    return response.data;
};

export const generateCharts = async (fileId: string, sampleSize: number) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(`${API_BASE_URL}/csv/chart/`, {
      file_id: fileId,
      sample_size: sampleSize,
    }, {
      headers: {
        'Authorization': `Token ${token}`,
      }
    });
    return response.data.charts;
  };
  
  // export const askQuestion = async (fileId: string, question: string) => {
  //   const token = localStorage.getItem('authToken');
  //   const response = await axios.post(`${API_BASE_URL}/csv/ask/`, {
  //     file_id: fileId,
  //     question,
  //   }, {
  //     headers: {
  //       'Authorization': `Token ${token}`,
  //   }
  //   });
  //   return response.data;
  // };

  export const askQuestion = async (
    fileId: string,
    question: string,
    onData: (data: string) => void,
    signal?: AbortSignal
  ) => {
    const token = localStorage.getItem('authToken');
  
    try {
      const response = await fetch(`${API_BASE_URL}csv/ask/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ file_id: fileId, question }),
        signal,
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }
  
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
  
      if (reader) {
        let buffer = '';
  
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
  
          buffer += decoder.decode(value, { stream: true });
  
          // Split buffer by newline to extract data chunks
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line for next read
  
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data:')) {
              try {
                const jsonString = trimmed.replace(/^data:\s*/, '');
                const parsed = JSON.parse(jsonString);
                if (parsed.word) {
                  onData(parsed.word);
                }
              } catch (err) {
                console.error('Failed to parse line:', trimmed, err);
              }
            }
          }
        }
  
        // Handle any remaining buffer
        const final = buffer.trim();
        if (final.startsWith('data:')) {
          try {
            const jsonString = final.replace(/^data:\s*/, '');
            const parsed = JSON.parse(jsonString);
            if (parsed.word) {
              onData(parsed.word);
            }
          } catch (err) {
            console.error('Failed to parse final buffer:', final, err);
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        console.error('Error in askQuestion:', error);
        throw error;
      }
    }
  };
  
  

  //pdf apis
  // lib/api.ts
export const uploadPdf = async (
  file: File,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await axios.post(
    `${API_BASE_URL}/summarisation/upload/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Token ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    }
  );
  
  return response.data;
};

export const askCustom = async (
  fileId: string,
  custom_prompt: string,
  options?: {signal?: AbortSignal}): Promise<Blob> => {
  const token = localStorage.getItem('authToken');
  const response = await axios.post(`${API_BASE_URL}/summarisation/ask/`, {
    file_id: fileId,
    custom_prompt,
  },
    {
      headers: {
          'Authorization': `Token ${token}`,
      },
    responseType: 'blob',
    signal: options?.signal,
  }
);
return response.data
};

export const summarizePdf = async (fileId: string, promptKey: string, options?: { signal?: AbortSignal }): Promise<Blob> => {
  const token = localStorage.getItem('authToken');
  const response = await axios.post(
    `${API_BASE_URL}/summarisation/summarize/`,
    {
      file_id: fileId,
      prompt_key: promptKey,
    }, {
      headers: {
          'Authorization': `Token ${token}`,
      },
      responseType: 'blob', // Ensure the response is treated as a Blob
      signal: options?.signal,
    }
  );
  return response.data; // This will be a Blob object
};

//gpt3 apis
export const askGPT = async (question: string) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error("Authentication token not found");
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/gpt/ask/`, 
      { question },
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        transformResponse: [data => {
          try {
            // Handle potential SSE-style "data: " prefix
            if (typeof data === 'string' && data.startsWith('data: ')) {
              return JSON.parse(data.substring(6));
            }
            return JSON.parse(data);
          } catch (e) {
            console.error("Failed to parse response:", data);
            throw new Error(`Invalid JSON response: ${data}`);
          }
        }]
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw new Error(error.response?.data?.message || "API request failed");
    }
    throw error;
  }
};

//authentication
export const registerUser = async (username: string, email: string, password1: string, password2: string) => {
  const response = await axios.post(`${API_BASE_URL}api/auth/registration/`, {
    username,
    email,
    password1,
    password2,
  });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}api/auth/login/`, {
    email,
    password,
  });
  return response.data; // Contains key/token for authentication
};

export const logoutUser = async () => {
  const response = await axios.post(`${API_BASE_URL}api/auth/logout/`);
  return response.data;
};

export const getUser = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/auth/user/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return response.data;
};

export const requestPasswordReset = async (email: string) => {
  const response = await axios.get(`${API_BASE_URL}api/auth/password/reset/`, {
    params: { email }, // Pass email as a query parameter
  });
  return response.data;
};

export const confirmPasswordReset = async (uid: string, token: string, newPassword1: string, newPassword2: string) => {
  const response = await axios.get(`${API_BASE_URL}api/auth/password/reset/confirm/`, {
    params: {
      uid,
      token,
      new_password1: newPassword1,
      new_password2: newPassword2,
    },
  });
  return response.data;
};


export const changePassword = async (oldPassword: string, newPassword1: string, newPassword2: string) => {
  const response = await axios.post(`${API_BASE_URL}api/auth/password/change/`, {
      old_password: oldPassword,
      new_password1: newPassword1,
      new_password2: newPassword2,
  });
  return response.data;
};

export const getProductPriceRedirect = async (priceId: string) => {
  const token = localStorage.getItem('authToken'); // Retrieve the token from local storage
  const response = await axios.get(`${API_BASE_URL}api/product-price/${priceId}/`, {
      headers: {
          Authorization: `Token ${token}`, // Include the token in the headers
      },
  });
  return response.data; // Contains redirect_url
};

export const startCheckout = async (priceId: string, navigate: (path: string) => void) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    console.error('No authentication token found. Please log in.');
    navigate('/login');
    return;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}api/checkout/sub-price/${priceId}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log('Response:', response); // Debugging: Inspect the full response
    if (!response.data.checkout_url) {
      throw new Error('No checkout URL found in response');
    }
    window.location.href = response.data.checkout_url; // Redirect to Stripe
  } catch (error) {
    console.error('Error starting checkout:', error);
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized. Please log in again.');
      navigate('/login');
    }
  }
};



export const fetchSubscriptionPrices = async () => {
  const response = await axios.get(`${API_BASE_URL}api/subscription-prices/`);
  return response.data;
};

// gpt api
export const askPdGPT = async (
  fileId: string,
  question: string,
  onData: (data: string) => void,
  signal?: AbortSignal // Add optional signal for cancellation
) => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${API_BASE_URL}gpt-chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({ file_id: fileId, question }),
      signal, // Attach the signal here
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response');
    }

    const reader = response.body?.getReader();
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const data = JSON.parse(chunk.replace('data: ', ''));

        onData(data.word);
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request aborted');
    } else {
      console.error('Error in askGPT:', error);
      throw error;
    }
  }
};


export const fetchUserProfile = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await axios.get(`${API_BASE_URL}api/profile/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data; // Returns { first_name: string, email: string }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Fetch User Profile Error Response:", error.response?.data);
    } else {
      console.error("Unexpected Fetch User Profile Error:", error);
    }
    throw error;
  }
};

export const checkSubscriptionStatus = async () => {
  try {
      const response = await axios.get(
        `${API_BASE_URL}api/check-subscription-status/`,
        { headers: getAuthHeaders() }
      );
      return {
        isSubscribed: response.data.is_subscribed,
        error: null
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          isSubscribed: false,
          error: error.response?.data || error.message
        };
      }
      return {
        isSubscribed: false,
        error: 'Unknown error occurred'
      };
    }
  };

  const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  transformRequest: [
    (data) => JSON.stringify(data), // Explicit serialization
  ],
});


const handleError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError;
    console.error('API Error:', err.response?.data || err.message);
  } else {
    console.error('Unexpected Error:', error);
  }
};

export const sendContactMessage = async (formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await apiClient.post('/api/contact/', formData);
    
    // Return the complete success response
    return {
      success: response.data.success || false,
      message: response.data.message
    };
  } catch (error) {
    handleError(error);
    
    if (axios.isAxiosError(error) && error.response?.data) {
      return {
        success: false,
        error: error.response.data.error || "Failed to send message"
      };
    }
    
    return {
      success: false,
      error: "An unexpected error occurred"
    };
  }
};
  