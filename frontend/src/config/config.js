
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const PRODUCT_ENDPOINT = `${API_URL}/products`;
export const CATEGORY_ENDPOINT = `${API_URL}/categories`;

export const AUTH_ENDPOINT = `${API_URL}/auth`;
export const REGISTER_ENDPOINT = `${AUTH_ENDPOINT}/register`;
export const LOGIN_ENDPOINT = `${AUTH_ENDPOINT}/login`;
export const TOKEN_VALIDATION_ENDPOINT = `${AUTH_ENDPOINT}/validate`;

export const USER_ENDPOINT = `${API_URL}/user`;

export const FEATURES_ENDPOINT = `${API_URL}/feature`;
