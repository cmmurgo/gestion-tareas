const express = require('express'); 
const mongoose = require('mongoose'); 
require('dotenv').config(); // Carga variables de entorno desde un archivo .env
const path = require('path'); 
const tareasRoutes = require('./routes/tareas');
const session = require('express-session');

// Importar controladores y middlewares
const viewsController = require('./controllers/viewsController'); 
const usersRouter = require('./controllers/users'); 
const tareaTokenRouter = require('./controllers/tareas'); 
const loginRouter = require('./controllers/login'); 
const { errorHandler, authenticateToken } = require('./middlewares/middleware'); 

// Configuración de la aplicación
const app = express(); 
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos desde la carpeta 'public'
mongoose.set('strictQuery', false); 

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
const startServer = async () => {
    if (process.env.NODE_ENV !== 'test') {
        try {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tareasDB', { 
                useNewUrlParser: true, // Configura Mongoose para usar el nuevo analizador de URL de MongoDB
                useUnifiedTopology: true // Configura Mongoose para usar el nuevo motor de administración de conexiones
            });
            console.log('Conectado a la base de datos'); 
        } catch (err) {
            console.error('Error de conexión a la base de datos:', err); 
        }
    }
};

// Middleware para analizar datos en formato URL-encoded
app.use(express.urlencoded({ extended: false })); 
app.use(express.json());
//vercel
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); 

// Rutas para vistas
app.get('/', viewsController.getHome); 
app.get('/login', viewsController.getLogin); 
app.get('/register', viewsController.getRegister); 
app.get('/menu', viewsController.getMenu); 

// Rutas para la API (protegidas con el token)
app.use('/api/users', usersRouter); // Rutas de la API de usuarios (sin autenticación)
app.use('/api/menu', authenticateToken, tareaTokenRouter.crearTareaConToken); // Rutas de la API de tareas, protegidas con token
app.use('/api/login', loginRouter); // Ruta de la API para autenticación (inicio de sesión)
app.use(errorHandler); // Middleware global para manejo de errores

// Montar las rutas de tareas con el prefijo /tareas
app.use('/tareas', tareasRoutes);

// Ruta específica para obtener el último ID
app.use('/api', tareasRoutes);

// Iniciar el servidor - verifica si el archivo app.js se está ejecutando directamente -node app.js o npm run dev
// o si está siendo usado como módulo (como lo hace Vercel). 

if (require.main === module) {
    startServer().then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    });
} else {
    module.exports = app; // Exporta la app si se usa en un entorno como Vercel
}
