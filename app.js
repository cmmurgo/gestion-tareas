const express = require('express');
const mongoose = require('mongoose');
const tareaController = require('./controllers/tareas');

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/gestion_tareas', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Conectado a MongoDB');
})
.catch(err => {
    console.error('Error al conectar a MongoDB:', err);
});

// Rutas para las tareas
app.get('/tareas', tareaController.obtenerTareas);
app.get('/tareas/:id', tareaController.obtenerTareaPorId);
app.post('/tareas', tareaController.crearTarea);
app.put('/tareas/:id', tareaController.actualizarTarea);
app.delete('/tareas/:id', tareaController.eliminarTarea);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
