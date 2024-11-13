// Importamos la librería bcrypt para encriptar las contraseñas
const bcrypt = require('bcrypt');

// Creamos el enrutador de Express para manejar las rutas relacionadas con los usuarios
const usersRouter = require('express').Router();

// Importamos el modelo de usuario para interactuar con la base de datos
const User = require('../models/user');

// Ruta para crear un nuevo usuario
usersRouter.post('/', async (request, response) => {
  const body = request.body; // Obtenemos los datos del cuerpo de la solicitud (nombre de usuario, nombre, contraseña)
  const saltRounds = 10; // Definimos el número de "saltos" que usará bcrypt para encriptar la contraseña
  // Encriptamos la contraseña usando bcrypt.hash con el número de saltos definido
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  // Creamos un nuevo objeto de usuario con los datos proporcionados (incluida la contraseña encriptada)
  const user = new User({
    username: body.username, // Asignamos el nombre de usuario
    name: body.name, // Asignamos el nombre del usuario
    passwordHash // Asignamos la contraseña encriptada
  });
  
  // Guardamos el usuario en la base de datos
  const savedUser = await user.save();
  
  // Respondemos con el usuario guardado en formato JSON
  response.json(savedUser);
});

// Ruta para obtener todos los usuarios
usersRouter.get('/', async (request, response) => {
  // Obtenemos todos los usuarios de la base de datos, y también usamos .populate('posts') 
  // para incluir los posts relacionados de cada usuario (si existen)
  const users = await User.find({}).populate('posts');
  
  // Respondemos con la lista de usuarios en formato JSON
  response.json(users);
});

// Exportamos el enrutador para que pueda ser utilizado en otras partes de la aplicación
module.exports = usersRouter;
