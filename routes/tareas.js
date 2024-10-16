// routes/tareas.js
const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea');
const tareasController = require('../controllers/tareas');
const { verTareas } = require('../controllers/tareas');

// Ruta para crear una nueva tarea (POST /api/tareas)
router.post('/', async (req, res) => {
    const { id, tarea, usuario, area, estado, prioridad, fechaVencimiento } = req.body;

    try {
        const nuevaTarea = new Tarea({
            id,
            tarea,
            usuario,
            area,
            estado,
            prioridad,
            fechaVencimiento,
        });

        await nuevaTarea.save(); // Guarda la tarea en la base de datos
        res.redirect('/'); // Redirige al panel principal
    } catch (error) {
        console.error('Error al guardar la tarea:', error);
        res.status(500).send('Hubo un error al crear la tarea.');
    }
});


// Ruta para obtener todas las tareas en formato Json
router.get('/', tareasController.obtenerTareas); 

// Ruta para ver todas las tareas
router.get('/ver', verTareas);

// Ruta para eliminar una tarea
router.post('/eliminar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Tarea.findByIdAndDelete(id); // Elimina la tarea por ID
        res.redirect('/tareas/ver'); // Redirige a la lista de tareas
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).send('Error al eliminar la tarea');
    }
});

// Ruta para mostrar el formulario de edición de tarea
router.get('/editar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tarea = await Tarea.findById(id); // Obtiene la tarea por ID
        if (!tarea) {
            return res.status(404).send('Tarea no encontrada');
        }
        res.render('editarTarea', { tarea }); // Renderiza la vista de edición
    } catch (error) {
        console.error('Error al obtener la tarea para editar:', error);
        res.status(500).send('Error al cargar la tarea para editar');
    }
});

// Ruta para manejar la actualización de una tarea
router.post('/editar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { tarea, usuario, area, estado, prioridad, fechaVencimiento } = req.body;

        // Actualiza la tarea en la base de datos
        await Tarea.findByIdAndUpdate(id, {
            tarea,
            usuario,
            area,
            estado,
            prioridad,
            fechaVencimiento
        });

        res.redirect('/tareas/ver'); // Redirige a la lista de tareas
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).send('Error al actualizar la tarea');
    }
});

module.exports = router;
