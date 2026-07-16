const ApiError = require('../utils/ApiError');

/**
 * Middleware de errores de Express (firma de 4 argumentos obligatoria
 * para que Express lo reconozca como error handler).
 * Debe registrarse al FINAL de app.js, después de todas las rutas
 * y después de notFoundHandler.
 *
 * Formato de respuesta uniforme para el frontend:
 *   { error: { message: string, code: string } }
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Error interno del servidor';
    let code = 'INTERNAL_ERROR';

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        code = err.code;
    } else if (err.type === 'entity.parse.failed') {
        // JSON malformado en el body (lo lanza express.json())
        statusCode = 400;
        message = 'El cuerpo de la solicitud no es JSON válido';
        code = 'INVALID_JSON';
    } else if (err.message) {
        // Error inesperado (bug, error de SQLite, etc.) -> no exponemos
        // el mensaje interno tal cual al cliente, solo lo logueamos.
        message = 'Error interno del servidor';
    }

    // Log simple. En un error 500 real interesa ver el stack completo.
    if (statusCode >= 500) {
        console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, err);
    } else {
        console.error(`[ERROR] ${req.method} ${req.originalUrl} -> ${statusCode} ${code}: ${message}`);
    }

    res.status(statusCode).json({
        error: {
            message,
            code
        }
    });
};

module.exports = errorHandler;
