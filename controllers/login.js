const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

// Define la ruta POST para la autenticación de login
loginRouter.post('/', async (request, response) => {
  
  const body = request.body;

  // Busca en la base de datos un usuario con el nombre de usuario proporcionado
  const user = await User.findOne({ username: body.username });
  
  const passwordCorrect =
    user === null  // Si el usuario no existe en la base de datos, la contraseña es incorrecta
      ? false
      : await bcrypt.compare(body.password, user.passwordHash); // Si el usuario existe, compara las contraseñas

  // Si el usuario no existe o la contraseña es incorrecta, se responde con un error 401 (Unauthorized)
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'username o password inválidos' 
    });
  }

  // Si las credenciales son correctas, se prepara el objeto que se usará para generar el token
  const userForToken = {
    username: user.username, 
    id: user._id 
  };

  // Genera un token JWT utilizando la clave secreta almacenada en las variables de entorno
  const token = jwt.sign(userForToken, process.env.SECRET); // El token se firma con los datos del usuario y la clave secreta

  // Envía una respuesta con el token generado
  response
    .status(200) 
    .send({ token, username: user.username, name: user.name }); 

});

module.exports = loginRouter;
