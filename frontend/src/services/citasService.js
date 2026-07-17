import api from './api.js'; // Tu axios configurado con interceptor de token

export const citasService = {
    // Obtener mis citas
    getMyCitas: async () => {
        const response = await api.get('/citas');
        return response.data;
    },

    // Agendar una nueva cita
    bookCita: async (citaData) => {
        const response = await api.post('/citas/book', citaData);
        return response.data;
    },

    // Cancelar una cita
    cancelCita: async (id) => {
        const response = await api.patch(`/citas/${id}/cancel`);
        return response.data;
    },

    // Obtener mentores activos para el formulario de selección
    getMentores: async () => {
        const response = await api.get('/tutores'); // Reutiliza tu endpoint de tutores
        return response.data;
    }
};