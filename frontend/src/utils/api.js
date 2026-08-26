const API_URL = import.meta.env.PROD
  ? "/api"
  : import.meta.env.VITE_API_URL || "/api";

export const apiUrl = (path) => `${API_URL}${path}`;
