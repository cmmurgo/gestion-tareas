const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareas');
const authController = require('../controllers/auth');

// Rutas para tareas
router.get('/tareas', tareasController.obtenerTareas);
router.post('/tareas', tareasController.crearTarea);
router.put('/tareas/:id', tareasController.actualizarTarea);
router.delete('/tareas/:id', tareasController.eliminarTarea);

// Rutas para autenticación
router.post('/login', authController.iniciarSesion);
router.post('/logout', authController.cerrarSesion);

module.exports = router;
