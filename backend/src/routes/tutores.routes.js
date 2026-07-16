const express = require('express');
const router = express.Router();
const { obtenerTutores, obtenerDetalleTutor } = require('../controllers/tutores.controller');

router.get('/', obtenerTutores);
router.get('/:id', obtenerDetalleTutor);

module.exports = router;