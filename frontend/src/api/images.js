const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getImageUrl = (path) => {
    if (!path) return '/src/assets/user.png';

    // Backend paths → añadir baseUrl
    if (path.startsWith('/uploads/')) {
        return `${baseUrl}${path}`;
    }

    // Locales → devolver tal cual
    return path;
};
