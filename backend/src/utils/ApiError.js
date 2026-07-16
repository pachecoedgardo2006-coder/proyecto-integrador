/**
 * Error estándar de la API.
 * Cualquier error lanzado con esta clase será capturado por errorHandler.js
 * y transformado en una respuesta uniforme: { error: { message, code } }.
 */
class ApiError extends Error {
    constructor(statusCode, message, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code || 'ERROR';
        // Mantiene el stack trace limpio (sin este constructor en el medio)
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = 'Solicitud inválida', code = 'BAD_REQUEST') {
        return new ApiError(400, message, code);
    }

    static unauthorized(message = 'No autenticado', code = 'UNAUTHORIZED') {
        return new ApiError(401, message, code);
    }

    static forbidden(message = 'No autorizado', code = 'FORBIDDEN') {
        return new ApiError(403, message, code);
    }

    static notFound(message = 'Recurso no encontrado', code = 'NOT_FOUND') {
        return new ApiError(404, message, code);
    }

    static conflict(message = 'Conflicto con el estado actual del recurso', code = 'CONFLICT') {
        return new ApiError(409, message, code);
    }

    static internal(message = 'Error interno del servidor', code = 'INTERNAL_ERROR') {
        return new ApiError(500, message, code);
    }
}

module.exports = ApiError;