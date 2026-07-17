import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userModel from '../models/user.models.js'; // Importación limpia con ES Modules
import { dbQuery } from '../config/db.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Generador de Token JWT
const generarToken = (idNumber, roleName) => {
    return jwt.sign(
        { idNumber: idNumber, role: roleName }, 
        process.env.JWT_SECRET || 'secret_fallback_key', 
        { expiresIn: '24h' }
    );
};

/**
 * REGISTRO DE USUARIOS
 */
export const register = asyncHandler(async (req, res) => {
    const { idNumber, firstName, lastName, email, password, role } = req.body;

    // 1. Validar campos requeridos
    if (!idNumber || !firstName || !lastName || !email || !password || !role) {
        throw ApiError.badRequest('All fields are required.');
    }

    // 2. Mapear el rol del español de la vista al inglés requerido por la Base de Datos
    let roleDbName = role.toLowerCase();
    if (roleDbName === 'aprendiz' || roleDbName === 'estudiante') {
        roleDbName = 'learner';
    } else if (roleDbName === 'tutor' || roleDbName === 'docente') {
        roleDbName = 'mentor';
    }

    // Seguridad: Evitar registros no autorizados de administradores
    if (roleDbName === 'admin' || roleDbName === 'superadmin') {
        throw ApiError.forbidden('Public registration for administrative roles is not allowed.');
    }

    // 3. Buscar el rol en base de datos usando el modelo
    const rolEncontrado = await userModel.obtenerRolPorNombre(roleDbName);
    if (!rolEncontrado) {
        throw ApiError.badRequest(`The role "${role}" is not valid.`);
    }

    // 4. Verificar duplicados (Email e ID) usando el modelo
    const usuarioExistente = await userModel.buscarPorEmail(email);
    if (usuarioExistente) {
        throw ApiError.conflict('The email address is already registered.', 'EMAIL_ALREADY_EXISTS');
    }

    const cedulaExistente = await userModel.buscarPorIdNumber(idNumber);
    if (cedulaExistente) {
        throw ApiError.conflict('The ID number is already registered.', 'ID_ALREADY_EXISTS');
    }

    // 5. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Guardar el nuevo usuario en PostgreSQL usando el modelo
    await userModel.crearUsuario({
        id_number: idNumber,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hashedPassword,
        role_id: rolEncontrado.id
    });

    // 7. Si se registró un estudiante ('learner'), creamos automáticamente su registro en la tabla "learner"
    if (roleDbName === 'learner') {
        const insertLearnerQuery = `
            INSERT INTO "learner" ("id", "user_id", "program", "level")
            VALUES (gen_random_uuid(), $1, 'Systems Engineering', 'Freshman')
            ON CONFLICT (user_id) DO NOTHING;
        `;
        await dbQuery(insertLearnerQuery, [idNumber]);
    }

    // 8. Generar sesión inmediata
    const token = generarToken(idNumber, roleDbName);

    res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
            idNumber,
            firstName,
            lastName,
            email,
            role: roleDbName
        }
    });
});

/**
 * INICIO DE SESIÓN
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Validar campos requeridos
    if (!email || !password) {
        throw ApiError.badRequest('Email and password are required.');
    }

    // 2. Buscar usuario en la base de datos a través del modelo
    const usuario = await userModel.buscarPorEmail(email);
    if (!usuario) {
        throw ApiError.unauthorized('Incorrect email or password.', 'INVALID_CREDENTIALS');
    }

    // 3. Comparar contraseñas
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
        throw ApiError.unauthorized('Incorrect email or password.', 'INVALID_CREDENTIALS');
    }

    // 4. Buscar el nombre de su rol para inyectarlo al token
    const roleQuery = 'SELECT name FROM "role" WHERE id = $1;';
    const roleRes = await dbQuery(roleQuery, [usuario.role_id]);
    const roleName = roleRes.rows[0]?.name || 'learner';

    const token = generarToken(usuario.id_number, roleName);

    res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            idNumber: usuario.id_number,
            firstName: usuario.first_name,
            lastName: usuario.last_name,
            email: usuario.email,
            phone: usuario.phone,
            photo: usuario.photo,
            role: roleName
        }
    });
});