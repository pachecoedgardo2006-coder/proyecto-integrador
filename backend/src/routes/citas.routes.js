const express = require('express');
const router = express.Router();
const { obtenerCitas, agendarCita } = require('../controllers/citas.controller');

router.get('/', obtenerCitas);
router.post('/', agendarCita);

module.exports = router;