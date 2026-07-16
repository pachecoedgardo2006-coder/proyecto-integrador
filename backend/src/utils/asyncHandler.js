/**
 * Envuelve un controller async para que cualquier error (throw o promesa
 * rechazada) sea pasado automáticamente a next(), y de ahí al errorHandler.
 *
 * Uso:
 *   const obtenerTutores = asyncHandler(async (req, res) => { ... });
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;