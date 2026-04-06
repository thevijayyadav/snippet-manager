import api from './api';

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Invalid credentials');
      }
      throw new Error(error.response?.data?.message || 'Network Error - Is Backend Running?');
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
       if (error.response && error.response.data) {
          throw new Error(error.response.data.message || error.response.data);
       }
       throw new Error('Network Error - Is Backend Running?');
    }
  }
};

export default authService;
