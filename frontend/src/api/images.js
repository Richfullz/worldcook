const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const getImageUrl = (path) => path?.startsWith('http') ? path : `${baseUrl}${path}`;

console.log('IMAGE BASE URL:', baseUrl); // ← línea temporal