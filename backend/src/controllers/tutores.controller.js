const { dbQuery } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// Obtener todos los tutores con sus lenguajes de programación
const obtenerTutores = asyncHandler(async (req, res) => {
    const tutores = await dbQuery("SELECT * FROM tutores");

    // Mapeamos para adjuntar los lenguajes a cada tutor
    for (let tutor of tutores) {
        const lenguajes = await dbQuery("SELECT lenguaje FROM tutor_lenguajes WHERE tutor_id = ?", [tutor.id]);
        tutor.lenguajes = lenguajes.map(l => l.lenguaje);

        const promedio = await dbQuery("SELECT AVG(calificacion) as prom FROM reseñas WHERE tutor_id = ?", [tutor.id]);
        tutor.calificacion = promedio[0].prom ? parseFloat(promedio[0].prom.toFixed(1)) : 5.0;
    }

    res.json(tutores);
});

// Obtener el perfil detallado, comentarios y calificaciones de un tutor específico
const obtenerDetalleTutor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const tutor = await dbQuery("SELECT * FROM tutores WHERE id = ?", [id]);
    if (tutor.length === 0) {
        throw ApiError.notFound('Tutor no encontrado', 'TUTOR_NOT_FOUND');
    }

    const lenguajes = await dbQuery("SELECT lenguaje FROM tutor_lenguajes WHERE tutor_id = ?", [id]);
    const reseñas = await dbQuery("SELECT estudiante_nombre, calificacion, comentario FROM reseñas WHERE tutor_id = ?", [id]);

    res.json({
        ...tutor[0],
        lenguajes: lenguajes.map(l => l.lenguaje),
        reseñas: reseñas
    });
});

module.exports = { obtenerTutores, obtenerDetalleTutor };
