// // // import axios from "./api";

// // // export const registerUserApi = (data) => axios.post("/register", data);
// // // export const loginUserApi = async (formData) => {
// // //     console.log("FormData:", formData);
// // //     return await axios.post("/login", formData); 
// // // };

// // import api from "./api.js";

// // export const registerUserApi = (data) => api.post("/auth/register", data);

// // export const loginUserApi = (formData) => api.post("/auth/login", formData);



// import api from "./api.js"; // Import the central api instance

// /**
//  * Sends a registration request.
//  * Correct Final URL -> http://localhost:8081/api/auth/register
//  */
// export const registerUserApi = (data) => {
//   return api.post("/auth/register", data);
// };

// /**
//  * Sends a login request.
//  * Correct Final URL -> http://localhost:8081/api/auth/login
//  */
// export const loginUserApi = (formData) => {
//   return api.post("/auth/login", formData); 
// };


import api from "./api.js"; // Import the central api instance from api.js

/**
 * Sends a registration request.
 * This will make a POST request to: http://localhost:8081/api/auth/register
 */
export const registerUserApi = (data) => {
  return api.post("/auth/register", data);
};

/**
 * Sends a login request.
 * This will make a POST request to: http://localhost:8081/api/auth/login
 */
export const loginUserApi = (formData) => {
  return api.post("/auth/login", formData);
};
