// Importamos el enrutador de Express para gestionar las rutas relacionadas con los posts
const postsRouter = require('express').Router();

// Importamos las bibliotecas necesarias para la verificación de tokens y la base de datos
const jwt = require('jsonwebtoken');
const Post = require('../models/post'); // Modelo de Post
const User = require('../models/user'); // Modelo de User

// Ruta para obtener todos los posts
postsRouter.get('/', async (request, response) => {
  try {
    // Intentamos obtener todos los posts de la base de datos
    const posts = await Post.find({});
    response.json(posts); // Si es exitoso, devolvemos los posts en formato JSON
  } catch (error) {
    // Si ocurre un error, respondemos con un código de error 500
    response.status(500).json({ error: 'Error al obtener los posts' });
  }
});

// Ruta para obtener un post específico por su ID
postsRouter.get('/:id', async (request, response) => {
  try {
    // Intentamos encontrar el post por su ID
    const post = await Post.findById(request.params.id);
    
    // Si el post se encuentra, lo enviamos como respuesta
    if (post) {
      response.json(post.toJSON());
    } else {
      // Si no se encuentra el post, respondemos con un 404 (No encontrado)
      response.status(404).end();
    }
  } catch (error) {
    // Si hay un error al obtener el post, respondemos con un código 500
    response.status(500).json({ error: 'Error al obtener el post' });
  }
});

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
postsRouter.post('/', async (request, response) => {
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
    const post = new Post({
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
});

// Ruta para eliminar un post por su ID
postsRouter.delete('/:id', async (request, response) => {
  try {
    // Intentamos eliminar el post con el ID proporcionado en la URL
    await Post.findByIdAndRemove(request.params.id);
    
    // Si la eliminación es exitosa, respondemos con un código de estado 204 (Sin contenido)
    response.status(204).end();
  } catch (error) {
    // Si ocurre un error, respondemos con un código 500 (Problema interno del servidor)
    response.status(500).json({ error: 'Error al eliminar el post' });
  }
});

// Ruta para actualizar un post por su ID
postsRouter.put('/:id', async (request, response, next) => {
  const body = request.body; // Obtenemos los datos del cuerpo de la solicitud
  const post = {
    title: body.title,
    content: body.content,
    category: body.category
  };

  try {
    // Intentamos actualizar el post con el ID proporcionado en la URL
    const updatedPost = await Post.findByIdAndUpdate(request.params.id, post, { new: true });
    
    // Si la actualización es exitosa, respondemos con el post actualizado
    response.json(updatedPost);
  } catch (error) {
    // Si ocurre un error, lo pasamos al siguiente middleware de manejo de errores
    next(error);
  }
});

// Exportamos el enrutador para que pueda ser utilizado en otras partes de la aplicación
module.exports = postsRouter;
