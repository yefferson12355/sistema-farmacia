// Rutas simuladas para medicamentos
const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');

router.get('/medicamentos', medicamentoController.getMedicamentos);

module.exports = router;
