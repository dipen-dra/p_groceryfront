//================================================================================
// FILE: src/api/userApi.js
// DESC: API calls for logged-in user actions.
//================================================================================
import api from "./api.js";

export const fetchUserProfileApi = () => api.get('/auth/profile');
export const fetchUserOrdersApi = () => api.get('/orders/myorders');
export const placeOrderApi = (orderData) => api.post('/orders', orderData);
export const fetchProductsApi = () => api.get('/products');
export const fetchCategoriesApi = () => api.get('/categories');

// --- CORRECTED FUNCTION ---
// Renamed to be specific and points to the correct '/auth/profile/picture' endpoint.
// It expects formData as an argument.
export const updateUserProfilePictureApi = (formData) => api.put('/auth/profile/picture', formData);