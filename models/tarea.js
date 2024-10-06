// models/tarea.js
const mongoose = require('mongoose');

// Definir el esquema de la tarea
const tareaSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    tarea: { type: String, required: true },
    usuario: { type: String, required: true },
    estado: { type: Boolean, default: false },
    prioridad: { type: String, required: true },
});

// Exportar el modelo 'Tarea' basado en el esquema
module.exports = mongoose.model('Tarea', tareaSchema);
