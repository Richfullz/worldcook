const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log('IMAGE BASE URL:', baseUrl); // ← línea temporal
export const getImageUrl = (path) => `${baseUrl}${path}`;