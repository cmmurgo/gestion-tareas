const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose'); // Importar mongoose
require('dotenv').config(); // Carga variables de entorno desde un archivo .env
const connectDB = require('./config/database'); // Importar la función de conexión a la base de datos
const tareasRoutes = require('./routes/tareas');

// Importar controladores y middlewares
const viewsController = require('./controllers/viewsController');
const usersRouter = require('./controllers/users');
const tareaTokenRouter = require('./controllers/tareas');
const loginRouter = require('./controllers/login');
const { errorHandler, authenticateToken } = require('./middlewares/middleware');

// Configuración de la aplicación
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
mongoose.set('strictQuery', false); // Asegurarse de que mongoose esté definido

// Conectar a la base de datos (solo si no estamos en un entorno de pruebas)
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// Configuración de sesiones
app.use(session({
    secret: process.env.SECRET || 'orion123',
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

// Middleware para analizar datos en formato URL-encoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Rutas para vistas
app.get('/', viewsController.getHome);
app.get('/login', viewsController.getLogin);
app.get('/register', viewsController.getRegister);
app.get('/menu', viewsController.getMenu);

// Rutas para la API (protegidas con el token)
app.use('/api/users', usersRouter);
app.use('/api/menu', authenticateToken, tareaTokenRouter.crearTareaConToken);
app.use('/api/login', loginRouter);
app.use(errorHandler);

// Montar las rutas de tareas con el prefijo /tareas
app.use('/tareas', tareasRoutes);

// Ruta específica para obtener el último ID
app.use('/api', tareasRoutes);

// Iniciar el servidor - verifica si el archivo app.js se está ejecutando directamente -node app.js o npm run dev
// o si está siendo usado como módulo (como lo hace Vercel). 
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
} else {
    module.exports = app; // Exporta la app si se usa en un entorno como Vercel
}
