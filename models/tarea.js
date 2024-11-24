const mongoose = require('mongoose');

// Definir el esquema de la tarea
const tareaSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    tarea: { type: String, required: true },
    usuario: { type: String, required: true },
    area: { 
        type: String, 
        enum: ['Compras', 'Ventas', 'Producción', 'Inventario'], 
        required: true 
    },
    estado: { 
        type: String, 
        enum: ['Pendiente', 'En progreso', 'Completada'], 
        default: 'Pendiente' 
    },
    prioridad: { 
        type: String, 
        enum: ['Baja', 'Media', 'Alta'], 
        required: true 
    },
    fechaCreacion: { type: Date, default: Date.now },
    fechaVencimiento: { type: Date, required: true },

});

module.exports = mongoose.model('Tarea', tareaSchema);
