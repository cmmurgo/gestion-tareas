// routes/tareas.js
const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea');
const tareasController = require('../controllers/tareas');
const { verTareas, obtenerTareasFiltros, obtenerTareaPorId, eliminarTarea } = require('../controllers/tareas');

// Ruta para renderizar la vista de agregar nueva tarea por formulario
router.get('/nueva', (req, res) => {
    res.render('nueva-tarea'); 
});

// Ruta para obtener tareas con filtros en formato Json
router.get('/filtrar', obtenerTareasFiltros);

// Ruta para ver todas las tareas
router.get('/ver', verTareas);

// Ruta para obtener una tarea segun id en formato Json
router.get('/:id', obtenerTareaPorId);

// Ruta para obtener todas las tareas en formato Json
router.get('/', tareasController.obtenerTareas); 

// Ruta para eliminar una tarea por Thunder cliente
router.delete('/:id', eliminarTarea)

// Ruta para crear una tarea por Thunder cliente
router.post('/enviar', tareasController.crearTarea)

// Ruta para crear una nueva tarea o por formulario
router.post('/', tareasController.agregarTarea)

// Ruta para mostrar el formulario de edición de tarea
router.get('/editar/:id', tareasController.mostrarFormularioEdicion);

// Ruta para manejar la actualización de una tarea
router.post('/editar/:id', tareasController.actualizarTarea);

// Ruta para eliminar una tarea
router.post('/eliminar/:id', tareasController.eliminarTarea);

module.exports = router;
