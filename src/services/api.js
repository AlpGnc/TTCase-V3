import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001', // json-server adresi
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
