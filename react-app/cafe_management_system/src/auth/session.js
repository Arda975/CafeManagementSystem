// The session (JWT + user info) is kept in localStorage so a page refresh doesn't log
// the user out. Trade-off: localStorage is readable by JavaScript, so an XSS bug could
// steal the token; an HttpOnly cookie would avoid that at the cost of CSRF protection.
const KEY = "amedim_session";

export function saveSession(loginResponse) {
    try {
        localStorage.setItem(KEY, JSON.stringify(loginResponse));
    } catch {
        // storage unavailable (private mode etc.): session lives until refresh
    }
    memorySession = loginResponse;
}

let memorySession = null;

export function getSession() {
    let session = memorySession;
    try {
        const raw = localStorage.getItem(KEY);
        if (raw) session = JSON.parse(raw);
    } catch {
        // ignore unreadable storage
    }
    if (!session) return null;

    // The API rejects expired tokens anyway; this just avoids showing stale admin pages.
    if (session.expiresAt && new Date(session.expiresAt) <= new Date()) {
        clearSession();
        return null;
    }
    return session;
}

export function clearSession() {
    memorySession = null;
    try {
        localStorage.removeItem(KEY);
    } catch {
        // ignore
    }
}

export const isAdmin = (session) => session?.role === "Admin";
