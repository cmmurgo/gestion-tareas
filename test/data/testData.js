const tareasData = [
  {
    id: 1,
    tarea: 'Tarea de prueba 1',
    usuario: 'Usuario 1',
    area: 'Compras',
    estado: 'Pendiente',
    prioridad: 'Media',
    fechaVencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    tarea: 'Tarea de prueba 2',
    usuario: 'Usuario 2',
    area: 'Ventas',
    estado: 'En progreso',
    prioridad: 'Alta',
    fechaVencimiento: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  },
  {
    id: 3,
    tarea: 'Tarea de prueba 3',
    usuario: 'Usuario 3',
    area: 'Compras',
    estado: 'Pendiente',
    prioridad: 'Media',
    fechaVencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    tarea: 'Tarea de prueba 4',
    usuario: 'Usuario 4',
    area: 'Ventas',
    estado: 'Pendiente',
    prioridad: 'Baja',
    fechaVencimiento: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  },
  {
    id: 5,
    tarea: 'Nueva tarea de prueba',
    usuario: 'Nuevo usuario',
    area: 'Producción',
    estado: 'Pendiente',
    prioridad: 'Baja',
    fechaVencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 6,
    tarea: 'Tarea actualizada',
    usuario: 'Usuario actualizado',
    area: 'Inventario',
    estado: 'Completada',
    prioridad: 'Alta',
    fechaVencimiento: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
  }
];

module.exports = tareasData;


