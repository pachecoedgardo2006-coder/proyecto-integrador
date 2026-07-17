import { Router } from 'express';
import { getMyMentorships, bookMentorship, cancelMentorship } from '../controllers/citas.controller.js';
// 👇 Importamos el nuevo middleware que acabamos de crear
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Aplicamos el middleware a todas las rutas de este archivo
router.use(protect);

router.get('/', getMyMentorships);
router.post('/book', bookMentorship);
router.patch('/:id/cancel', cancelMentorship); // Ruta para cancelar de manera segura

export default router;