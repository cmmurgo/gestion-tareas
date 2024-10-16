// routes/tareas.js
const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareas');

// Ruta para obtener todas las tareas
router.get('/', tareasController.obtenerTareas); // Usa '/' ya que será montada como /api/tareas

// Ruta POST para crear una tarea
router.post('/', tareasController.crearTarea);

module.exports = router;
