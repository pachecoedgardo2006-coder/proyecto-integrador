// Asegúrate de tener Axios cargado (ya sea por CDN en el HTML o por npm)
const api = axios.create({
    baseURL: '/api'
});

export default api;