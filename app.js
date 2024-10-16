const express = require('express');
const mongoose = require('mongoose');
const tareasRoutes = require('./routes/tareas'); // Importar las rutas de tareas
const path = require('path');
const session = require('express-session');
const { login } = require('./controllers/auth');

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
app.use(express.urlencoded({ extended: true })); // Asegúrate de agregar esto para manejar datos del formulario

// Ruta para manejar el inicio de sesión (POST)
app.post('/login', login);

// Middleware para verificar si el usuario está autenticado
const requireAuth = (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    next();
};

// Ruta para el formulario de login
app.get('/login', (req, res) => {
    const error = req.query.error || null;
    res.render('login', { error });
});

// Ruta para el panel (restringida a usuarios autenticados)
app.get('/', requireAuth, (req, res) => {
    res.render('index', { usuario: req.session.usuario });
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Montar las rutas de tareas con el prefijo /api/tareas (formato json)
app.use('/tareas', tareasRoutes);

// Montar las rutas de tareas con el prefijo /api/tareas
app.use('/api/tareas', tareasRoutes);

// Ruta para mostrar el formulario de nueva tarea
app.get('/tareas/nueva', (req, res) => {
    res.render('nueva-tarea'); // Renderiza la vista nueva-tarea.pug
});

// Ruta para eliminar tareas
app.use('/tareas', tareasRoutes);

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/tareasDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Ruta para la página de inicio
app.get('/', (req, res) => {
    res.render('login'); 
});

// Iniciar servidor
const PORT = process.env.PORT || 3000; // Usa la variable de entorno si está definida
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
