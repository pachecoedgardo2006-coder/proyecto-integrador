const { dbRun, dbQuery } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// Obtener citas
const obtenerCitas = async (req, res) => {

    try {

        const citas = await dbQuery(`
            SELECT citas.*, tutores.nombre AS tutor_nombre
            FROM citas
            JOIN tutores ON citas.tutor_id = tutores.id
        `);

        res.json(citas);

    } catch (error) {

        res.status(500).json({
            error: "Error al obtener citas: " + error.message
        });

    }

};

// Crear/Agendar una nueva cita
const agendarCita = async (req, res) => {
    const { tutor_id, estudiante_nombre, fecha, hora } = req.body;

    if (!tutor_id || !estudiante_nombre || !fecha || !hora) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    try {
        const resultado = await dbRun(
            "INSERT INTO citas (tutor_id, estudiante_nombre, fecha, hora) VALUES (?, ?, ?, ?)",
            [tutor_id, estudiante_nombre, fecha, hora]
        );
        res.status(201).json({ mensaje: "Cita agendada con éxito", citaId: resultado.id });
    } catch (error) {
        res.status(500).json({ error: "Error al agendar cita: " + error.message });
    }
};

module.exports = {
    obtenerCitas,
    agendarCita
};