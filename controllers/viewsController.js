const Post = require('../models/tarea');

// Controlador para renderizar la página de inicio
exports.getHome = (req, res) => {
  res.render('index', { title: 'Página Principal', message: 'Bienvenido al Panel de Administración de Tareas' });
};

// Controlador para renderizar la página de inicio de sesión
exports.getLogin = (req, res) => {
  res.render('login');
};

// Controlador para renderizar la página de registro
exports.getRegister = (req, res) => {
  res.render('register');
};

// Controlador para renderizar la página Menu
exports.getMenu = async (req, res) => {
  try {
    const menu = await Post.find({});
    res.render('menu', { menu });
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener los menu' });
  }
};