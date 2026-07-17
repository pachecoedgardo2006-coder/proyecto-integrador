import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

export const protect = (req, res, next) => {
    // 1. Obtener el token de las cabeceras de autorización
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(ApiError.unauthorized('No token provided, authorization denied.', 'NO_TOKEN'));
    }

    // Extraer el token puro (removiendo la palabra 'Bearer ')
    const token = authHeader.split(' ')[1];

    try {
        // 2. Verificar el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback_key');

        // 3. Inyectar los datos decodificados en el objeto "req.user"
        req.user = {
            idNumber: decoded.idNumber,
            role: decoded.role
        };

        next(); // Continuar al controlador de citas
    } catch (error) {
        return next(ApiError.unauthorized('Token is not valid or has expired.', 'INVALID_TOKEN'));
    }
};