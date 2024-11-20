const express = require('express');
const router = express.Router();
const {
    obtenerTareas,
    verTareas,
    obtenerTareasFiltros,
    obtenerTareaPorId,
    eliminarTarea,
    crearTarea,
    actualizarTarea,
    crearTareaForm,
    actualizarTareaForm,
    editarTareaForm,
    eliminarTareaForm,
    obtenerUltimoId
} = require('../controllers/tareas');

// Ruta para renderizar la vista de agregar nueva tarea por formulario
router.get('/nueva', (req, res) => {
    res.render('nueva-tarea');
});

// Ruta para obtener el último ID
router.get('/ultimo-id', obtenerUltimoId);

// Ruta para obtener tareas con filtros en formato Json
router.get('/filtrar', obtenerTareasFiltros);

// Ruta para ver todas las tareas
router.get('/ver', verTareas);

// Ruta para obtener todas las tareas para Thunder Client
router.get('/', obtenerTareas);

// Ruta para obtener una tarea para Thunder Client
router.get('/:id', obtenerTareaPorId);

// Ruta para eliminar una tarea por Thunder Client
router.delete('/:id', eliminarTarea);

// Ruta para crear una tarea por Thunder Client
router.post('/', crearTarea);

// Ruta para actualizar una tarea por Thunder Client
router.put('/:id', actualizarTarea);

// Ruta para crear una nueva tarea por formulario
router.post('/crear', crearTareaForm);

// Ruta para mostrar el formulario de edición de tarea
router.get('/editar/:id', editarTareaForm);

// Ruta para manejar la actualización de una tarea por formulario
router.post('/editar/:id', actualizarTareaForm);

// Ruta para eliminar una tarea por formulario
router.post('/eliminar/:id', eliminarTareaForm);

module.exports = router;
