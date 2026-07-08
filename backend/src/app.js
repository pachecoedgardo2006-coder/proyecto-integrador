const express = require('express');
const cors = require('cors');
const path = require('path');

const tutoresRoutes = require('./routes/tutores.routes');
const citasRoutes = require('./routes/citas.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoints de la API REST
app.use('/api/tutores', tutoresRoutes);
app.use('/api/citas', citasRoutes);

// Servir archivos estáticos del frontend en producción (Vite build)
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Redirección del enrutamiento de la SPA al index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

module.exports = app;