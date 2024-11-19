const Tarea = require('../models/tarea');

// Importamos las bibliotecas necesarias para la verificación de tokens y la base de datos
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Modelo de User

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

// Controlador para obtener todas las tareas con filtros para Thunder Client
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

// Controlador para crear una nueva tarea para Thunder Client
exports.crearTarea = async (req, res) => {
    const nuevaTarea = new Tarea(req.body);
    try {
        const tareaGuardada = await nuevaTarea.save();
        res.status(201).json(tareaGuardada);
    } catch (err) {
        res.status(500).json({ error: 'Error al agregar la tarea' });
    }
};

// Controlador para crear una nueva tarea para formulario
exports.crearTareaForm = async (req, res) => {
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

// Controlador para editar una tarea por formulario
exports.editarTareaForm = async (req, res) => {
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
};

// Controlador para actualizar una tarea por formulario
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

// Controlador para eliminar una tarea por Thunder Client
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


// Controlador para eliminar una tarea por formulario
exports.eliminarTareaForm = async (req, res) => {
    try {
        const { id } = req.params;
        await Tarea.findByIdAndDelete(id); // Elimina la tarea por ID
        res.redirect('/tareas/ver'); // Redirige a la lista de tareas
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).send('Error al eliminar la tarea');
    }
};

// Función para obtener el token de autorización desde el encabezado de la solicitud
const getTokenFrom = (request) => {
    const authorization = request.get('authorization'); // Obtenemos el encabezado 'Authorization'
    console.log('Authorization Header:', authorization); // Imprimimos el encabezado para depuración
    
    // Si el encabezado existe y comienza con 'Bearer ', extraemos el token
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7); // Devuelve el token quitando 'Bearer ' al principio
    }
    return null; // Si no se encuentra el token, retornamos null
  };
  

// Ruta para crear un nuevo post
exports.crearTareaConToken = async (request, response) => {
    const body = request.body; // Obtenemos los datos del cuerpo de la solicitud
    const token = getTokenFrom(request); // Obtenemos el token de la solicitud
  
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
  
      // Creamos un nuevo post con los datos obtenidos del cuerpo de la solicitud
      const post = new Tarea({
        id: body.id,
        tarea: body.tarea,
        usuario: body.usuario,
        area: body.area,
        estado: body.estado,
        prioridad: body.prioridad,
        //user: user._id // Asociamos el post al usuario
        fechaVencimiento: new Date(),
     
      });
  
      // Guardamos el post en la base de datos
      const savedPost = await post.save();
      
      // Añadimos el ID del nuevo post al arreglo de posts del usuario
      user.posts = user.posts.concat(savedPost._id);
      await user.save(); // Guardamos al usuario con el nuevo post relacionado
  
      // Respondemos con el post recién creado y un código de estado 201 (Creado)
      response.status(201).json(savedPost);
    } catch (error) {
      console.error('Error al crear el post:', error); // Para depuración
      // Si el error es relacionado con el token, respondemos con un error 401 (Token inválido)
      if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'Token inválido' });
      }
      // Si ocurrió otro error, respondemos con un error 500 (Problema interno del servidor)
      response.status(500).json({ error: 'Error al crear el post' });
    }
  };

  
