const express = require('express');
const mongoose = require('mongoose');
const tareasRoutes = require('./routes/tareas'); // Importar las rutas de tareas
const path = require('path');
const session = require('express-session');

const app = express();

// Configuración de sesiones
app.use(session({
    secret: 'tu_secreto', // Cambia esto por una cadena secreta
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Configurar el motor de plantillas Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Asegúrate de agregar esto para manejar datos del formulario

// Ruta para el login
app.get('/login', (req, res) => {
    res.render('login', { error: req.query.error });
});

// Montar las rutas de tareas con el prefijo /api/tareas
app.use('/api/tareas', tareasRoutes);

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/tareasDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Ruta para la página de inicio
app.get('/', (req, res) => {
    res.render('index'); // Renderiza tu página de índice
});

// Ruta para manejar el inicio de sesión (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const usuario = { username: 'admin', password: 'admin' }; // Asegúrate de ajustar esto para usar tus usuarios de la base de datos

    if (!usuario) {
        return res.redirect('/login?error=Credenciales incorrectas'); // Redirige con mensaje de error
    }

    if (username === usuario.username && password === usuario.password) {
        req.session.usuario = usuario;
        res.redirect('/'); // Redirigir a la página de índice si las credenciales son correctas
    } else {
        res.redirect('/login?error=Credenciales incorrectas'); // Redirigir al login con mensaje de error
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000; // Usa la variable de entorno si está definida
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
