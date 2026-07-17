import { dbQuery, dbRun } from '../config/db.js';

/**
 * Inserta un nuevo usuario en la base de datos PostgreSQL.
 */
export const crearUsuario = ({
    id_number,
    first_name,
    last_name,
    email,
    password,
    phone = null,
    photo = null,
    role_id,
    assigned_by_id = null
}) => {
    return dbRun(
        `INSERT INTO "user"
            (id_number, first_name, last_name, email, password, phone, photo, role_id, assigned_by_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_number`,
        [id_number, first_name, last_name, email, password, phone, photo, role_id, assigned_by_id]
    );
};

// Usado para login y para verificar si el correo ya existe
export const buscarPorEmail = async (email) => {
    const result = await dbQuery('SELECT * FROM "user" WHERE email = $1', [email]);
    return result.rows[0] || null; // Extrae .rows del resultado completo
};

// Usado para reconstruir la sesión del usuario a través del token JWT
export const buscarPorIdNumber = async (id_number) => {
    const result = await dbQuery(
        `SELECT id_number, first_name, last_name, email, phone, photo, active,
                created_at, updated_at, role_id, assigned_by_id
         FROM "user" WHERE id_number = $1`,
        [id_number]
    );
    return result.rows[0] || null; // Extrae .rows del resultado completo
};

// Obtiene el rol por su nombre ('learner', 'mentor', 'admin', 'superadmin')
export const obtenerRolPorNombre = async (name) => {
    const result = await dbQuery('SELECT id, name FROM role WHERE name = $1', [name]);
    return result.rows[0] || null; // Extrae .rows del resultado completo
};