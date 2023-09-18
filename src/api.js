import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000'; // Replace with your Django backend URL

const instance = axios.create();

export default instance;
