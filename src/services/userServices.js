import {
    fetchProductsApi,
    fetchCategoriesApi,
    fetchUserProfileApi,
    fetchUserOrdersApi,
    placeOrderApi,
    // --- CORRECTED IMPORT ---
    updateUserProfilePictureApi 
} from '../api/userApi.js';

export const fetchProducts = async () => {
    const response = await fetchProductsApi();
    return response.data.products || response.data;
};

export const fetchCategories = async () => {
    const response = await fetchCategoriesApi();
    return response.data.categories || response.data;
};

export const fetchUserProfile = async () => {
    const response = await fetchUserProfileApi();
    return response.data;
};

export const fetchUserOrders = async () => {
    const response = await fetchUserOrdersApi();
    return response.data;
};

export const placeOrder = async (orderData) => {
    const response = await placeOrderApi(orderData);
    return response.data;
};

// --- CORRECTED FUNCTION ---
// This function now correctly calls 'updateUserProfilePictureApi'
export const updateUserProfilePicture = async (formData) => {
    const response = await updateUserProfilePictureApi(formData);
    return response.data;
};