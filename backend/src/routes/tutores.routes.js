import { Router } from 'express';
import { getMentors, getMentorDetails } from '../controllers/tutores.controller.js';

const router = Router();

router.get('/', getMentors);
router.get('/:id', getMentorDetails);

export default router;