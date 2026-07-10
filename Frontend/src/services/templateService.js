const BASE_URL = import.meta.env.VITE_SERVER_URL; // Use SERVER_URL to be safe, as templates is mounted at root in server.js
const API_URL = `${BASE_URL}/templates`;

export const templateService = {
    getAll: async () => {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include' // Important for CORS/Cookies
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch templates: ${response.status} ${errorText}`);
        }
        return response.json();
    },

    getGrouped: async () => {
        const response = await fetch(`${API_URL}/templates-grouped`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch grouped templates');
        return response.json();
    },

    create: async (templateData) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(templateData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create template');
        }
        return response.json();
    },

    update: async (id, templateData) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(templateData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update template');
        }
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to delete template');
        return response.json();
    },
};
