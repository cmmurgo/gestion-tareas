const express = require('express');
const mongoose = require('mongoose');
const tareasRoutes = require('./routes/tareas'); // Importar las rutas de tareas
const path = require('path');
const session = require('express-session');
const loginRoutes = require('./routes/login'); 

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

// Usar las rutas de login
app.use(loginRoutes);


// Montar las rutas de tareas con el prefijo /tareas
app.use('/tareas', tareasRoutes);

// Conexión a MongoDB
mongoose.connect('mongodb://localhost/mydatabase')
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Iniciar servidor
const PORT = process.env.PORT || 3000; // Variable de entorno
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
