// import axios from 'axios';

// // IMPORTANT: Ensure your .env.local file has this line:
// // VITE_API_BASE_URL="http://localhost:8081/api"
// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const api = axios.create({
//   // The base URL for all API calls
//   baseURL: API_URL, 
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// // This interceptor adds the auth token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;



import axios from "axios";

// This is the base URL for your entire backend.
// All other API calls will build upon this.
const API_URL = "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// This interceptor will automatically add the login token to the headers
// of every request that is sent using this 'api' instance.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;