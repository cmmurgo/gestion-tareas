// Importar módulos necesarios para la aplicación
const express = require('express'); // Importa el framework Express para facilitar la creación del servidor web
const mongoose = require('mongoose'); // Importa Mongoose para interactuar con MongoDB
require('dotenv').config(); // Carga variables de entorno desde un archivo .env
const path = require('path'); // Importa el módulo 'path' para trabajar con rutas de archivos
const tareasRoutes = require('./routes/tareas'); // Importar las rutas de tareas
const session = require('express-session');

// Importar controladores y middlewares
const viewsController = require('./controllers/viewsController'); // Controlador de vistas para manejar las rutas de la interfaz de usuario
const usersRouter = require('./controllers/users'); // Rutas para la API de usuarios
const postsRouter = require('./controllers/posts'); // Rutas para la API de publicaciones
const loginRouter = require('./controllers/login'); // Ruta para la autenticación de usuario (inicio de sesión)
const { errorHandler, authenticateToken } = require('./middlewares/middleware'); // Middlewares: autenticación de token y manejo de errores

// Configuración de la aplicación
const app = express(); // Crea una instancia de la aplicación Express
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos desde la carpeta 'public'
mongoose.set('strictQuery', false); // Configura Mongoose para omitir advertencias de consulta estricta

// Configuración de sesiones
app.use(session({
    secret: 'codecrafters', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tareasDB', { 
    useNewUrlParser: true, // Configura Mongoose para usar el nuevo analizador de URL de MongoDB
    useUnifiedTopology: true // Configura Mongoose para usar el nuevo motor de administración de conexiones
})
.then(() => console.log('Conectado a la base de datos')) // Mensaje de éxito si la conexión es exitosa
.catch(err => console.error('Error de conexión a la base de datos:', err)); // Mensaje de error si la conexión falla

// Middlewares
// Middleware para analizar datos en formato URL-encoded
app.use(express.urlencoded({ extended: false })); 
app.use(express.json()); // Middleware para analizar solicitudes JSON
app.set('view engine', 'pug'); // Configura Pug como el motor de plantillas para las vistas HTML

// Rutas para vistas
app.get('/', viewsController.getHome); // Ruta de inicio para la vista principal
app.get('/login', viewsController.getLogin); // Ruta para la vista de inicio de sesión
app.get('/register', viewsController.getRegister); // Ruta para la vista de registro de usuario
app.get('/posts', viewsController.getPosts); // Ruta para la vista de publicaciones (sin autenticación)

// Rutas para la API (protegidas con el token)
app.use('/api/users', usersRouter); // Rutas de la API de usuarios (sin autenticación)
app.use('/api/posts', authenticateToken, postsRouter); // Rutas de la API de publicaciones, protegidas con token
app.use('/api/login', loginRouter); // Ruta de la API para autenticación (inicio de sesión)
app.use(errorHandler); // Middleware global para manejo de errores

// Montar las rutas de tareas con el prefijo /tareas
app.use('/tareas', tareasRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 8000; // Configura el puerto de escucha (predeterminado: 8000)
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`); // Mensaje de inicio del servidor
});
