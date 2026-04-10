const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('token');

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
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
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : null;

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('authchange'));
        window.location.href = '/login';
      }

      throw new Error(payload?.message || 'Something went wrong');
    }

    return payload;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const authAPI = {
  register: (userData) => apiRequest('/auth/register', 'POST', userData),
  login: (credentials) => apiRequest('/auth/login', 'POST', credentials),
};

export const profileAPI = {
  get: () => apiRequest('/profile', 'GET'),
  update: (profileData) => apiRequest('/profile', 'PUT', profileData),
};

export const aiAPI = {
  getCareerRecommendation: () => apiRequest('/ai/career', 'GET'),
  generateRoadmap: (career) => apiRequest('/roadmap', 'POST', { career }),
  analyzeResume: (text) => apiRequest('/resume', 'POST', { text }),
};
