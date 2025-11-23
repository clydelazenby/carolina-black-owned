/**
 * Axios Instance with Authentication
 * @deprecated Use src/services/api.js instead for new code
 *
 * This file is kept for backward compatibility.
 * New code should import from 'services/api.js'
 */

import axios from 'axios';
import { store } from '../store/store';
import { API_BASE_URL } from '../config/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const state = store.getState();
      const token = state.auth?.auth?.idToken;

      if (token) {
        // Use Authorization header (more secure than query params)
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Token ${token}`;
      }

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
