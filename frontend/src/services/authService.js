import api  from "./api";

// Authenticates a user and stores the session data.

export async function login({ email, password }) {
    const response = await api.post('/auth/login', { email, password}); 
    const { token, user } = response.data;
    localStorage.setItem('auth-token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user};
}

// Registers a new user and stores the session data.

export async function register({ idNumber, firstName, lastName, email, password, role }) {
    const response = await api.post('/auth/register', { idNumber, firstName, lastName, email, password, role});
    const { token, user} = response.data;
    localStorage.setItem('auth-token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user};
}

// Clears the current user session.

export function logout() {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
}

// Retrieves the currently authenticated user from local storage.

export function getCurrentUser() {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    return JSON.parse(stored);
}