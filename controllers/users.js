const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

// Ruta para crear un nuevo usuario
usersRouter.post('/', async (request, response) => {
  const body = request.body;
  const saltRounds = 10; // Definimos el número de "saltos" que usará bcrypt para encriptar la contraseña
  // Encriptamos la contraseña usando bcrypt.hash con el número de saltos definido
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  // Creamos un nuevo objeto de usuario con los datos proporcionados (incluida la contraseña encriptada)
  const user = new User({
    username: body.username, 
    name: body.name, 
    passwordHash 
  });
  
  const savedUser = await user.save();
  
  // Respondemos con el usuario guardado en formato JSON
  response.json(savedUser);
});

// Ruta para obtener todos los usuarios
usersRouter.get('/', async (request, response) => {
  
  // Respondemos con la lista de usuarios en formato JSON
  response.json(users);
});

// Exportamos el enrutador para que pueda ser utilizado en otras partes de la aplicación
module.exports = usersRouter;
