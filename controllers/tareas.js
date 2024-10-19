// controllers/tareas.js
const Tarea = require('../models/Tarea');

// Controlador para obtener todas las tareas
exports.obtenerTareas = async (req, res) => {
    try {
        const tareas = await Tarea.find();
        res.json(tareas);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};

// Controlador para obtener todas las tareas
exports.verTareas = async (req, res) => {
    try {
        const tareas = await Tarea.find(); // Obtener todas las tareas de la BD
        res.render('tareas', { tareas });  // Renderiza la vista y pasa las tareas
      } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).send('Error al obtener las tareas');
      }
    };

// Controlador para obtener una tarea por ID para Thunder Client
exports.obtenerTareaPorId = async (req, res) => {
    try {
        // Busca por el campo 'id'
        const tarea = await Tarea.findOne({ id: req.params.id });
        if (!tarea) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json(tarea);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
};

// Obtener todas las tareas con filtros para Thunder Client
exports.obtenerTareasFiltros = async (req, res) => {
    try {
        const { area, estado, prioridad, usuario } = req.query;
        console.log('Filtros recibidos:', { area, estado, prioridad, usuario }); // Agrega esta línea

        const filtro = {};

        if (area) filtro.area = area;
        if (estado) filtro.estado = estado;
        if (prioridad) filtro.prioridad = prioridad;
        if (usuario) filtro.usuario = usuario;

        const tareas = await Tarea.find(filtro);
        res.json(tareas);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};

// Controlador para crear una nueva tarea para Thunder Client
exports.crearTarea = async (req, res) => {
    const nuevaTarea = new Tarea(req.body);
    try {
        const tareaGuardada = await nuevaTarea.save();
        res.status(201).json({ message: 'Tarea creada exitosamente', tarea: tareaGuardada });
    } catch (err) {
        res.status(500).json({ error: 'Error al agregar la tarea' });
    }
};

// Controlador para actualizar una tarea para Thunder Client
exports.actualizarTarea = async (req, res) => {
    try {
        const tareaActualizada = await Tarea.findOneAndUpdate(
            { id: req.params.id },   // Busca por el campo `id` numérico
            req.body, 
            { new: true }             // Retorna la tarea actualizada
        );
        if (!tareaActualizada) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json(tareaActualizada);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
};


// Controlador para eliminar una tarea para Thunder Client
exports.eliminarTarea = async (req, res) => {
    try {
        const tareaEliminada = await Tarea.findOneAndDelete({ id: req.params.id });  // Busca por el campo `id` numérico
        if (!tareaEliminada) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.status(204).send();  // No retorna contenido después de eliminar
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
};

