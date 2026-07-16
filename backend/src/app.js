const express = require('express');
const cors = require('cors');
const path = require('path');

const tutoresRoutes = require('./routes/tutores.routes');
const citasRoutes = require('./routes/citas.routes');

const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoints de la API REST
app.use('/api/tutores', tutoresRoutes);
app.use('/api/citas', citasRoutes);

// 404 uniforme SOLO para rutas /api no encontradas.
// No se registra como catch-all global para no interferir con el
// enrutamiento de la SPA (app.get('*', ...) más abajo).
app.use('/api', notFoundHandler);

// Servir archivos estáticos del frontend en producción (Vite build)
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Redirección del enrutamiento de la SPA al index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Manejador de errores central. SIEMPRE al final, después de todas las rutas.
app.use(errorHandler);

module.exports = app;