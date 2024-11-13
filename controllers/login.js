const jwt = require('jsonwebtoken'); // Importa la librería 'jsonwebtoken' para manejar la creación y verificación de JWT (JSON Web Tokens)
const bcrypt = require('bcrypt');// Importa la librería 'bcrypt' para manejar el cifrado de contraseñas y compararlas de manera segura


// Crea un router de Express para manejar las rutas relacionadas con el login
const loginRouter = require('express').Router();

// Importa el modelo de 'User' que representa a los usuarios en la base de datos
const User = require('../models/user');

// Define la ruta POST para la autenticación de login
loginRouter.post('/', async (request, response) => {
  
  // Extrae el cuerpo de la solicitud (nombre de usuario y contraseña) de la petición
  const body = request.body;
  
  // Busca en la base de datos un usuario con el nombre de usuario proporcionado
  const user = await User.findOne({ username: body.username });
  
  // Verifica si la contraseña proporcionada por el usuario coincide con la almacenada en la base de datos
  // 'bcrypt.compare()' compara la contraseña proporcionada con el hash almacenado
  const passwordCorrect =
    user === null  // Si el usuario no existe en la base de datos, la contraseña es incorrecta
      ? false
      : await bcrypt.compare(body.password, user.passwordHash); // Si el usuario existe, compara las contraseñas

  // Si el usuario no existe o la contraseña es incorrecta, se responde con un error 401 (Unauthorized)
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password' // Mensaje de error si el usuario o la contraseña son incorrectos
    });
  }

  // Si las credenciales son correctas, se prepara el objeto que se usará para generar el token
  const userForToken = {
    username: user.username, // Incluye el nombre de usuario en el payload del token
    id: user._id // Incluye el ID del usuario en el payload del token
  };

  // Genera un token JWT utilizando la clave secreta almacenada en las variables de entorno
  const token = jwt.sign(userForToken, process.env.SECRET); // El token se firma con los datos del usuario y la clave secreta

  // Envía una respuesta con el token generado, junto con el nombre de usuario y el nombre completo del usuario
  response
    .status(200) // Responde con un código de estado 200 (OK) si el login es exitoso
    .send({ token, username: user.username, name: user.name }); // Envía el token y la información del usuario

});

// Exporta el router para ser usado en otras partes de la aplicación (como en el archivo principal de la app)
module.exports = loginRouter;
