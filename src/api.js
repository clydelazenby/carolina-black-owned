/**
 * Legacy API instance
 * @deprecated Use src/services/api.js instead for new code
 *
 * This file is kept for backward compatibility.
 * New code should import from 'services/api.js'
 */

import axios from 'axios';
import { API_BASE_URL } from './config/api';

// Use environment variable for base URL
axios.defaults.baseURL = API_BASE_URL;

const instance = axios.create({
  baseURL: API_BASE_URL,
});

export default instance;
