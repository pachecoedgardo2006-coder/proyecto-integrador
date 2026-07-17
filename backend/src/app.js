import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas (¡No olvides la extensión .js al final!)
import authRoutes from './routes/auth.routes.js';
import tutoresRoutes from './routes/tutores.routes.js';
import citasRoutes from './routes/citas.routes.js';

// Importar middlewares
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';

// Configurar __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoints de la API REST
app.use('/api/auth', authRoutes);
app.use('/api/tutores', tutoresRoutes);
app.use('/api/citas', citasRoutes);

// 404 uniforme SOLO para rutas /api no encontradas.
app.use('/api', notFoundHandler);

// Servir archivos estáticos del frontend en producción (Vite build)
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Redirección del enrutamiento de la SPA al index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Manejador de errores central. SIEMPRE al final.
app.use(errorHandler);

export default app;