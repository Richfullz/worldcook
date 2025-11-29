// src/api/images.js
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getImageUrl = (path) => {
    if (!path) return '/src/assets/user.png';

    if (path.startsWith('/') || path.includes('/assets/') || path.includes('/src/assets/')) {
        return path;
    }

    if (path.startsWith('/uploads/')) {
        return `${baseUrl}${path}`;
    }

    return path;
};
