import axios from 'axios';

// CHANGE THIS PORT if your backend runs on a different port (e.g. 8000 or 8080)
const BACKEND_URL = `https://project-z-backend-apis.onrender.com`;  // this has to be done with the help of env variables  

const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true, // CRITICAL: This allows cookies/sessions to be sent
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;