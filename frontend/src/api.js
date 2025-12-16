const API_BASE_URL = 'https://mern-hackathon-p466.onrender.com/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Generic API request function
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', 'POST', userData),
  login: (credentials) => apiRequest('/auth/login', 'POST', credentials),
};

// Profile APIs
export const profileAPI = {
  update: (profileData) => apiRequest('/profile', 'PUT', profileData),
};

// AI Features APIs
export const aiAPI = {
  getCareerRecommendation: () => apiRequest('/ai/career', 'GET'),
  generateRoadmap: (career) => apiRequest('/roadmap', 'POST', { career }),
  analyzeResume: (text) => apiRequest('/resume', 'POST', { text }),
};
