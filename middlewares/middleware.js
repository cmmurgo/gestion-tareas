// Importamos la librería jsonwebtoken para trabajar con tokens JWT
const jwt = require('jsonwebtoken');

// Middleware para autenticar token
const authenticateToken = (req, res, next) => {
    // Extraemos el encabezado 'authorization' de la solicitud HTTP
    const authHeader = req.headers['authorization'];

    // Si el encabezado 'authorization' está presente, extraemos el token (que viene después de 'Bearer')
    const token = authHeader && authHeader.split(' ')[1];

    // Mostramos en consola el token recibido para verificarlo (solo para depuración)
    console.log('Token recibido en middleware:', token); 

    // Si no se encuentra el token en el encabezado de la solicitud, respondemos con un error 401 (No autorizado)
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    // Verificamos el token usando la clave secreta del entorno (process.env.SECRET)
    jwt.verify(token, process.env.SECRET, (err, user) => {
        // Si hay un error con la verificación del token (por ejemplo, el token es inválido), respondemos con un error 403 (Prohibido)
        if (err) return res.status(403).json({ error: 'Token inválido' });

        // Si el token es válido, añadimos los datos del usuario (decodificados) a la solicitud (req.user)
        req.user = user;

        // Llamamos a la siguiente función en la cadena de middlewares (continúa el flujo)
        next();
    });
};

// Middleware para manejo de errores en toda la aplicación
const errorHandler = (error, request, response, next) => {
    // Mostramos el mensaje de error en la consola (para depuración)
    console.error(error.message);

    // Si el error es un 'CastError' (por ejemplo, cuando se pasa un id malformado), respondemos con un error 400 (Petición incorrecta)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } 
    // Si el error es un 'ValidationError' (por ejemplo, error en la validación de los datos), respondemos con un error 400 (Petición incorrecta)
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } 
    // Si el error es un 'JsonWebTokenError' (el token es inválido), respondemos con un error 401 (No autorizado)
    else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' });
    } 
    // Si el error es un 'TokenExpiredError' (el token ha expirado), respondemos con un error 401 (No autorizado)
    else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' });
    }

    // Si el error no es ninguno de los anteriores, lo pasamos al siguiente middleware de manejo de errores
    next(error);
};

// Exportamos los middlewares para que puedan ser utilizados en otras partes de la aplicación
module.exports = { errorHandler, authenticateToken };
