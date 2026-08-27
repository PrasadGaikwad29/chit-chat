const API_URL = import.meta.env.VITE_API_URL || "/api";

export const apiUrl = (path) => `${API_URL}${path}`;

export const apiFetch = (path, options = {}) => {
  const user = JSON.parse(localStorage.getItem("chat-user") || "null");
  const headers = new Headers(options.headers);

  if (user?.token) {
    headers.set("Authorization", `Bearer ${user.token}`);
  }

  return fetch(apiUrl(path), { ...options, headers, credentials: "include" });
};
