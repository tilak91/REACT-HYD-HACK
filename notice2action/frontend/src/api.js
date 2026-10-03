import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    const response = await api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};

export const askQuestion = async (imageFile, question) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('question', question);
  
  try {
    const response = await api.post('/ask', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Question error:', error);
    throw error;
  }
};

export const askIntelligentQuestion = async (question, gemmaContext) => {
  try {
    const response = await api.post('/ask-intelligent', {
      question,
      gemma_context: gemmaContext
    });
    return response.data;
  } catch (error) {
    console.error('Intelligent question error:', error);
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    return { status: 'error' };
  }
};

export default api;