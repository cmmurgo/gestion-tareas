// Importa el modelo de datos "Post" desde la carpeta de modelos para interactuar con la base de datos
const Post = require('../models/post');

// Controlador para renderizar la página de inicio
exports.getHome = (req, res) => {
  // Renderiza la vista 'index' con el título y mensaje de bienvenida especificados
  res.render('index', { title: 'Página Principal', message: 'Bienvenido al Panel de Administración de Tareas' });
};

// Controlador para renderizar la página de inicio de sesión
exports.getLogin = (req, res) => {
  // Renderiza la vista 'login' sin pasar ningún dato adicional
  res.render('login');
};

// Controlador para renderizar la página de registro
exports.getRegister = (req, res) => {
  // Renderiza la vista 'register' sin pasar ningún dato adicional
  res.render('register');
};

// Controlador para renderizar la página de posts (lista de publicaciones)
exports.getPosts = async (req, res) => {
  try {
    // Obtiene todos los documentos de la colección "posts" en la base de datos
    const posts = await Post.find({});
    // Renderiza la vista 'posts' y pasa el arreglo de posts como datos para mostrar en la vista
    res.render('menu', { posts });
  } catch (error) {
    // En caso de error al obtener los posts, responde con un código de estado 500 y un mensaje de error
    res.status(500).send({ error: 'Error al obtener los posts' });
  }
};