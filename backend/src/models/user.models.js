const { dbGet, dbRun } = require('../config/db');

/**
 * Inserta un nuevo usuario. Se espera que `password` ya venga hasheado
 * con bcrypt (el nombre de columna es "password" por fidelidad al DBML,
 * pero SIEMPRE contiene el hash, nunca texto plano) — este modelo no
 * hashea, solo persiste. Si el email ya existe, SQLite rechaza el INSERT
 * por la restricción UNIQUE (el controller de auth lo traduce a un 409).
 *
 * IMPORTANTE (regla de negocio "admin"): assigned_by_id debe ir NULL
 * salvo que se esté otorgando el rol "admin", y en ese caso debe ser el
 * id_number de un usuario con rol "superadmin" — si no, el trigger
 * trg_validate_admin_insert aborta el INSERT. El controller que llame a
 * esta función es responsable de NO mandar assigned_by_id para roles
 * distintos de admin.
 */
const crearUsuario = ({
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
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_number, first_name, last_name, email, password, phone, photo, role_id, assigned_by_id]
    );
};

// Usado en login (necesita "password" para comparar con bcrypt) y en register (chequear duplicados)
const buscarPorEmail = (email) => {
    return dbGet('SELECT * FROM "user" WHERE email = ?', [email]);
};

// Usado en requireAuth/`/auth/me` para reconstruir el usuario a partir del id_number del JWT.
// Excluye "password" a propósito: esto nunca debe llegar al cliente.
const buscarPorIdNumber = (id_number) => {
    return dbGet(
        `SELECT id_number, first_name, last_name, email, phone, photo, active,
                created_at, updated_at, role_id, assigned_by_id
         FROM "user" WHERE id_number = ?`,
        [id_number]
    );
};

// Helper para resolver el uuid (id) de un rol a partir de su nombre ('user', 'tutor', 'admin', 'superadmin')
const obtenerRolPorNombre = (name) => {
    return dbGet('SELECT id, name FROM role WHERE name = ?', [name]);
};

module.exports = { crearUsuario, buscarPorEmail, buscarPorIdNumber, obtenerRolPorNombre };
