import api  from "./api";

export async function login({ email, password }) {
    const response = await api.post('/auth/login', { email, password}); 
    const { token, user } = response.data;
    localStorage.setItem('auth-token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user};
}


export async function register({ idNumber, firstName, lastName, email, password, role }) {
    const response = await api.post('/auth/register', { idNumber, firstName, lastName, email, password, role});
    const { token, user} = response.data;
    localStorage.setItem('auth-token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user};
}


export function logout() {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
}

export function getCurrentUser() {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    return JSON.parse(stored);
}