const Tarea = require('../models/tarea');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Controlador para obtener todas las tareas
exports.obtenerTareas = async (req, res) => {
    try {
        const tareas = await Tarea.find();
        res.json(tareas);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};

// Controlador para ver todas las tareas
exports.verTareas = async (req, res) => {
    try {
        const tareas = await Tarea.find();
        res.render('tareas', { tareas });
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).send('Error al obtener las tareas');
    }
};

// Controlador para obtener una tarea por ID
exports.obtenerTareaPorId = async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json(tarea);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
};

// Controlador para obtener tareas con filtros
exports.obtenerTareasFiltros = async (req, res) => {
    try {
        const { area, estado, prioridad, usuario } = req.query;
        console.log('Filtros recibidos:', { area, estado, prioridad, usuario });

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

// Controlador para crear una nueva tarea
exports.crearTarea = async (req, res) => {
    const nuevaTarea = new Tarea(req.body);
    try {
        const tareaGuardada = await nuevaTarea.save();
        res.status(201).json(tareaGuardada);
    } catch (err) {
        res.status(500).json({ error: 'Error al agregar la tarea' });
    }
};

// Controlador para crear una nueva tarea desde formulario
exports.crearTareaForm = async (req, res) => {
    const { tarea, usuario, area, estado, prioridad, fechaVencimiento } = req.body;

    try {
        const nuevaTarea = new Tarea({
            tarea,
            usuario,
            area,
            estado,
            prioridad,
            fechaVencimiento,
        });

        await nuevaTarea.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error al guardar la tarea:', error);
        res.status(500).send('Hubo un error al crear la tarea.');
    }
};

// Controlador para actualizar una tarea por ID
exports.actualizarTarea = async (req, res) => {
    try {
        const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tareaActualizada) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json(tareaActualizada);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
};

// Controlador para editar una tarea desde formulario
exports.editarTareaForm = async (req, res) => {
    try {
        const { id } = req.params;
        const tarea = await Tarea.findById(id);
        if (!tarea) {
            return res.status(404).send('Tarea no encontrada');
        }
        res.render('editarTarea', { tarea });
    } catch (error) {
        console.error('Error al obtener la tarea para editar:', error);
        res.status(500).send('Error al cargar la tarea para editar');
    }
};

// Controlador para actualizar una tarea desde formulario
exports.actualizarTareaForm = async (req, res) => {
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
};

// Controlador para eliminar una tarea por ID
exports.eliminarTarea = async (req, res) => {
    try {
        const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);
        if (!tareaEliminada) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
};

// Controlador para eliminar una tarea desde formulario
exports.eliminarTareaForm = async (req, res) => {
    try {
        const { id } = req.params;
        await Tarea.findByIdAndDelete(id);
        res.redirect('/tareas/ver');
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).send('Error al eliminar la tarea');
    }
};

// Controlador para obtener el último ID (opcional si necesario)
exports.obtenerUltimoId = async (req, res) => {
    try {
        const ultimaTarea = await Tarea.findOne().sort({ _id: -1 }); // Buscar la tarea con el ID más alto
        const ultimoId = ultimaTarea ? ultimaTarea._id : null;
        res.json({ ultimoId });
    } catch (err) {
        console.error('Error al obtener el último ID:', err);
        res.status(500).json({ error: 'Error al obtener el último ID' });
    }
};

// Función para obtener el token de autorización desde el encabezado de la solicitud
const getTokenFrom = (request) => {
    const authorization = request.get('authorization');
    console.log('Authorization Header:', authorization);

    // Si el encabezado existe y comienza con 'Bearer ', extraemos el token
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7); // Devuelve el token quitando 'Bearer ' al principio
    }
    return null;
};

// Ruta para crear una nueva tarea con token
exports.crearTareaConToken = async (request, response) => {
    const body = request.body;
    const token = getTokenFrom(request);

    try {
        // Si no existe el token, respondemos con un error 401 (No autorizado)
        if (!token) {
            return response.status(401).json({ error: 'Token faltante' });
        }

        // Intentamos verificar el token usando la clave secreta del entorno
        const decodedToken = jwt.verify(token, process.env.SECRET);

        // Si el token no contiene un ID de usuario, respondemos con un error 401 (Token inválido)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'Token inválido' });
        }

        // Intentamos encontrar al usuario en la base de datos usando el ID decodificado del token
        const user = await User.findById(decodedToken.id);

        // Si el usuario no existe, respondemos con un error 404 (Usuario no encontrado)
        if (!user) {
            return response.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Creamos una nueva tarea con los datos obtenidos del cuerpo de la solicitud
        const nuevaTarea = new Tarea({
            tarea: body.tarea,
            usuario: body.usuario,
            area: body.area,
            estado: body.estado,
            prioridad: body.prioridad,
            fechaVencimiento: new Date(),
        });

        const savednuevaTarea = await nuevaTarea.save();

        await user.save();

        // Respondemos con la tarea recién creada y un código de estado 201 (Creado)
        response.status(201).json(savednuevaTarea);
    } catch (error) {
        console.error('Error al crear nuevaTarea:', error);
        // Si el error es relacionado con el token, respondemos con un error 401 (Token inválido)
        if (error.name === 'JsonWebTokenError') {
            return response.status(401).json({ error: 'Token inválido' });
        }
        // Si ocurrió otro error, respondemos con un error 500 (Problema interno del servidor)
        response.status(500).json({ error: 'Error al crear la nuevaTarea' });
    }
};

