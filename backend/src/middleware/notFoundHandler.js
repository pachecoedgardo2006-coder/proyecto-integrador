const ApiError = require('../utils/ApiError');

/**
 * Se registra DESPUÉS de todas las rutas (pero antes del errorHandler).
 * Cualquier request que no haya sido manejada llega aquí y se convierte
 * en un 404 con el mismo formato que el resto de errores de la API.
 */
const notFoundHandler = (req, res, next) => {
    next(ApiError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND'));
};

module.exports = notFoundHandler;
