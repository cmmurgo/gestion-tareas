const mongoose = require('mongoose');

// Definir el esquema de la tarea
const tareaSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    tarea: { type: String, required: true },
    usuario: { type: String, required: true },  // Usuario asignado
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
    user: {
        type: mongoose.Schema.Types.ObjectId, // Tipo de dato ObjectId que referencia a otro documento
        ref: 'User' // Referencia al modelo 'User'
    }
});

// Exportar el modelo 'Tarea' basado en el esquema
module.exports = mongoose.model('Tarea', tareaSchema);
