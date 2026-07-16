const { dbQuery } = require('../config/db');

// Obtener todos los tutores con sus lenguajes
const obtenerTutores = async (req, res) => {
    try {
        const tutores = await dbQuery("SELECT * FROM tutores");

        for (let tutor of tutores) {
            const lenguajes = await dbQuery(
                "SELECT lenguaje FROM tutor_lenguajes WHERE tutor_id = $1",
                [tutor.id]
            );

            tutor.lenguajes = lenguajes.map(l => l.lenguaje);

            const promedio = await dbQuery(
                "SELECT AVG(calificacion) AS prom FROM reseñas WHERE tutor_id = $1",
                [tutor.id]
            );

            tutor.calificacion = promedio[0].prom
                ? parseFloat(promedio[0].prom).toFixed(1)
                : 5.0;
        }

        res.json(tutores);

    } catch (error) {
        res.status(500).json({
            error: "Error al obtener tutores: " + error.message
        });
    }
};

// Obtener detalle de un tutor
const obtenerDetalleTutor = async (req, res) => {

    const { id } = req.params;

    try {

        const tutor = await dbQuery(
            "SELECT * FROM tutores WHERE id = $1",
            [id]
        );

        if (tutor.length === 0) {
            return res.status(404).json({
                error: "Tutor no encontrado"
            });
        }

        const lenguajes = await dbQuery(
            "SELECT lenguaje FROM tutor_lenguajes WHERE tutor_id = $1",
            [id]
        );

        const reseñas = await dbQuery(
            "SELECT estudiante_nombre, calificacion, comentario FROM reseñas WHERE tutor_id = $1",
            [id]
        );

        res.json({
            ...tutor[0],
            lenguajes: lenguajes.map(l => l.lenguaje),
            reseñas
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al obtener detalle: " + error.message
        });
    }
};

module.exports = {
    obtenerTutores,
    obtenerDetalleTutor
};