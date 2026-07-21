import React from 'react'

export const api = async (endpoint, options = {}, isFormData = false) => {
    const token = localStorage.getItem('token');

    const headers = {...options.headers};

    if (!isFormData) headers['Content-Type'] = 'application/json';

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${endpoint}`, {
        ...options,
        headers
    });

    // 400 Bad request
    if (response.status === 400) {
        console.error(response.body);
        return;
    }

    // 401 Token expired
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return null;
    }

    // 403 Unauthorized
    if (response.status === 403) {
        window.location.href = '/unauthorized';
        return null;
    }

    // 404 Not Found
    if (response.status === 404) {
        window.location.href = '/notfound';
        return null;
    }
    

    return response;
}
