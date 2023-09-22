import axios from 'axios';
import { store } from '../store/store';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
});


axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const state = store.getState();
      const token = state.auth.auth.idToken;
      config.params = config.params || {};
      config.params['auth'] = token;
      return config;
    } catch (error) {
      // Handle errors related to fetching the token, e.g., token not found
      console.error('Axios Interceptor Error:', error);
      return config;
    }
  },
  (error) => {
    // Handle request error
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
