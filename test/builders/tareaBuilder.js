module.exports.Builder = {
    tarea: ({
        id = 1,
        tarea = 'Tarea de prueba',
        usuario = 'Usuario de prueba',
        area = 'Compras',
        estado = 'Pendiente',
        prioridad = 'Media',
        fechaVencimiento = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días en el futuro
    } = {}) => ({
        id,
        tarea,
        usuario,
        area,
        estado,
        prioridad,
        fechaVencimiento
    })
};
