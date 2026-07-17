import { dbQuery } from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

/**
 * 1. OBTENER LAS CITAS DEL USUARIO LOGUEADO
 */
export const getMyMentorships = asyncHandler(async (req, res) => {
    const { idNumber, role } = req.user;

    let query = '';
    let params = [idNumber];

    if (role === 'mentor') {
        // Si es mentor, buscamos las mentorías asociadas a su id de mentor usando su user_id
        query = `
            SELECT 
                msh.id AS mentorship_id,
                msh.date,
                msh.start_time,
                msh.end_time,
                msh.status,
                msh.reason,
                msh.observations,
                u_learner.first_name AS learner_first_name,
                u_learner.last_name AS learner_last_name,
                u_learner.email AS learner_email
            FROM "mentorship" msh
            JOIN "mentor" m ON msh.mentor_id = m.id
            JOIN "learner" l ON msh.learner_id = l.id
            JOIN "user" u_learner ON l.user_id = u_learner.id_number
            WHERE m.user_id = $1
            ORDER BY msh.date DESC, msh.start_time DESC;
        `;
    } else {
        // Si es estudiante (learner), buscamos las mentorías usando su user_id en la tabla learner
        query = `
            SELECT 
                msh.id AS mentorship_id,
                msh.date,
                msh.start_time,
                msh.end_time,
                msh.status,
                msh.reason,
                msh.observations,
                u_mentor.first_name AS mentor_first_name,
                u_mentor.last_name AS mentor_last_name,
                u_mentor.email AS mentor_email
            FROM "mentorship" msh
            JOIN "learner" l ON msh.learner_id = l.id
            JOIN "mentor" m ON msh.mentor_id = m.id
            JOIN "user" u_mentor ON m.user_id = u_mentor.id_number
            WHERE l.user_id = $1
            ORDER BY msh.date DESC, msh.start_time DESC;
        `;
    }

    const result = await dbQuery(query, params);
    res.status(200).json(result.rows);
});

/**
 * 2. RESERVAR UNA NUEVA MENTORÍA (CITA)
 */
/**
 * 2. RESERVAR UNA NUEVA MENTORÍA (CITA)
 */
export const bookMentorship = asyncHandler(async (req, res) => {
    const { idNumber } = req.user; // ID del usuario logueado (Estudiante)
    // 👇 Capturamos las variables en camelCase tal como las manda el frontend
    const { mentorId, date, startTime, endTime, reason } = req.body;

    // 1. Validar campos obligatorios que vienen del frontend
    if (!mentorId || !date || !startTime || !endTime) {
        throw ApiError.badRequest('Missing required fields (mentorId, date, startTime, or endTime)');
    }

    // 2. Obtener el UUID del "learner" usando el idNumber (cédula) del usuario autenticado
    const learnerQuery = `SELECT id FROM "learner" WHERE user_id = $1;`;
    const learnerResult = await dbQuery(learnerQuery, [idNumber]);

    if (learnerResult.rows.length === 0) {
        throw ApiError.notFound('Learner profile not found for this user. Please register as a learner first.');
    }

    const learnerId = learnerResult.rows[0].id;

    // 3. Insertar la cita en la tabla real "mentorship" usando las variables correctas
    const insertMentorshipQuery = `
        INSERT INTO "mentorship" (id, mentor_id, learner_id, date, start_time, end_time, status, reason)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'pending', $6)
        RETURNING id, mentor_id, learner_id, date, start_time, end_time, status, reason;
    `;
    
    const mentorshipResult = await dbQuery(insertMentorshipQuery, [
        mentorId,       // Enlazado a mentor_id
        learnerId,      // Enlazado a learner_id
        date,           // Enlazado a date
        startTime,      // Enlazado a start_time
        endTime,        // Enlazado a end_time
        reason || 'No reason provided'
    ]);

    res.status(201).json({
        message: 'Mentorship booked successfully',
        mentorship: mentorshipResult.rows[0]
    });
});

/**
 * 3. CANCELAR UNA MENTORÍA
 */
export const cancelMentorship = asyncHandler(async (req, res) => {
    const { id } = req.params; // ID de la mentoría
    const { idNumber, role } = req.user;

    // Verificar si la mentoría existe
    const checkQuery = `
        SELECT msh.id, l.user_id AS learner_user_id, m.user_id AS mentor_user_id, msh.status
        FROM "mentorship" msh
        JOIN "learner" l ON msh.learner_id = l.id
        JOIN "mentor" m ON msh.mentor_id = m.id
        WHERE msh.id = $1;
    `;
    const checkResult = await dbQuery(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
        throw ApiError.notFound('Mentorship not found');
    }

    const mentorship = checkResult.rows[0];

    // Validar autorización: Solo el estudiante o el mentor implicado pueden cancelar
    if (role === 'mentor' && mentorship.mentor_user_id !== idNumber) {
        throw ApiError.forbidden('You are not authorized to cancel this mentorship');
    } else if (role !== 'mentor' && mentorship.learner_user_id !== idNumber) {
        throw ApiError.forbidden('You are not authorized to cancel this mentorship');
    }

    // Actualizar el estado a 'cancelled'
    const cancelQuery = `
        UPDATE "mentorship"
        SET status = 'cancelled', updated_at = NOW()
        WHERE id = $1
        RETURNING id, status;
    `;
    const cancelResult = await dbQuery(cancelQuery, [id]);

    res.status(200).json({
        message: 'Mentorship cancelled successfully',
        mentorship: cancelResult.rows[0]
    });
});