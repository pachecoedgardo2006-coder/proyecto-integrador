const { dbQuery } = require('../config/db');

// Obtener todos los tutores con sus lenguajes de programación
const obtenerTutores = async (req, res) => {
    try {
        const tutores = await dbQuery("SELECT * FROM tutores");
        
        // Mapeamos para adjuntar los lenguajes a cada tutor
        for (let tutor of tutores) {
            const lenguajes = await dbQuery("SELECT lenguaje FROM tutor_lenguajes WHERE tutor_id = ?", [tutor.id]);
            tutor.lenguajes = lenguajes.map(l => l.lenguaje);
            
            const promedio = await dbQuery("SELECT AVG(calificacion) as prom FROM reseñas WHERE tutor_id = ?", [tutor.id]);
            tutor.calificacion = promedio[0].prom ? parseFloat(promedio[0].prom.toFixed(1)) : 5.0;
        }

        res.json(tutores);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener tutores: " + error.message });
    }
};

// Obtener el perfil detallado, comentarios y calificaciones de un tutor específico
const obtenerDetalleTutor = async (req, res) => {
    const { id } = req.params;
    try {
        const tutor = await dbQuery("SELECT * FROM tutores WHERE id = ?", [id]);
        if (tutor.length === 0) return res.status(404).json({ error: "Tutor no encontrado" });

        const lenguajes = await dbQuery("SELECT lenguaje FROM tutor_lenguajes WHERE tutor_id = ?", [id]);
        const reseñas = await dbQuery("SELECT estudiante_nombre, calificacion, comentario FROM reseñas WHERE tutor_id = ?", [id]);

        res.json({
            ...tutor[0],
            lenguajes: lenguajes.map(l => l.lenguaje),
            reseñas: reseñas
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener detalle: " + error.message });
    }
};

module.exports = { obtenerTutores, obtenerDetalleTutor };