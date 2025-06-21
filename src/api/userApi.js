//================================================================================
// FILE: src/api/userApi.js (NEW FILE)
// DESC: API calls for logged-in user actions.
//================================================================================
import api from "./api.js";

export const fetchUserProfileApi = () => api.get('/auth/profile');
export const fetchUserOrdersApi = () => api.get('/orders/myorders');
export const placeOrderApi = (orderData) => api.post('/orders', orderData);
export const fetchProductsApi = () => api.get('/products');
export const fetchCategoriesApi = () => api.get('/categories');