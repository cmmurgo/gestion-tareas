const express = require('express');
const mongoose = require('mongoose');
const tareasRoutes = require('./routes/tareas'); // Importar las rutas de tareas
const path = require('path');
const session = require('express-session');
const usersRouter = require('./controllers/users'); // Rutas para la API de usuarios
const loginRouter = require('./controllers/login'); // Ruta para la autenticación de usuario (inicio de sesión)
const viewsController = require('./controllers/viewsController'); // Controlador de vistas para manejar las rutas de la interfaz de usuario
const { errorHandler, authenticateToken } = require('./middlewares/middleware'); // Middlewares: autenticación de token y manejo de errores 

const app = express();

// Configuración de sesiones
app.use(session({
    secret: 'codecrafters', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// Configurar el motor de plantillas Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas para vistas
app.get('/', viewsController.getHome); // Ruta de inicio para la vista principal
app.get('/login', viewsController.getLogin); // Ruta para la vista de inicio de sesión
app.get('/register', viewsController.getRegister); // Ruta para la vista de registro de usuario

// Rutas para la API (protegidas con el token)
app.use('/api/users', usersRouter); // Rutas de la API de usuarios (sin autenticación)
app.use('/index', authenticateToken, tareasRoutes); // Rutas de la API de publicaciones, protegidas con token
app.use('/api/login', loginRouter); // Ruta de la API para autenticación (inicio de sesión)
app.use(errorHandler); // Middleware global para manejo de errores


// Montar las rutas de tareas con el prefijo /tareas
app.use('/tareas', tareasRoutes);

// Conexión a MongoDB
mongoose.connect('mongodb://localhost/tareasDB')
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Iniciar servidor
const PORT = process.env.PORT || 3000; // Variable de entorno
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
