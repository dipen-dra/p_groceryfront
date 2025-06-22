



// import axios from "axios";

// // This is the base URL for your entire backend.
// // All other API calls will build upon this.
// const API_URL = "http://localhost:8081/api";

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // This interceptor will automatically add the login token to the headers
// // of every request that is sent using this 'api' instance.
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
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

import axios from 'axios';

// The base URL for your API endpoints
const API_BASE_URL = 'http://localhost:8081/api';

// The base URL for serving static files (like images)
export const SERVER_BASE_URL = 'http://localhost:8081';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
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