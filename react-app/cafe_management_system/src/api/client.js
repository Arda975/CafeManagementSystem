import axios from "axios";
import { clearSession, getSession } from "../auth/session";

// API address comes from .env (VITE_API_URL); falls back to the local dev API.
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const api = axios.create({ baseURL: `${API_URL}/api` });

// Attach the JWT to every request while a session exists.
api.interceptors.request.use((config) => {
    const session = getSession();
    if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
});

// 401 = token missing, expired or invalid: drop the session and go back to the login.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginCall = error.config?.url?.includes("/auth/login");
        if (error.response?.status === 401 && !isLoginCall && getSession()) {
            clearSession();
            window.location.assign("/");
        }
        return Promise.reject(error);
    }
);

/** Turns an API error (ProblemDetails / validation errors) into a readable message. */
export function getErrorMessage(error, fallback = "Bir hata oluştu.") {
    const data = error?.response?.data;
    if (error?.response?.status === 403) return "Bu işlem için yetkiniz yok.";
    if (data?.errors) {
        const first = Object.values(data.errors).flat()[0];
        if (first) return first;
    }
    return data?.detail || data?.title || fallback;
}

/** Seeded images live in the frontend (public/assets), uploaded ones are served by the API. */
export function resolveImage(path) {
    if (!path) return "/assets/cafe-image.jpg";
    if (/^https?:\/\//.test(path)) return path;
    if (path.startsWith("uploads/")) return `${API_URL}/${path}`;
    return `/${path}`;
}

export default api;
