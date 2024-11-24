const mongoose = require('mongoose');
const request = require('supertest');
const path = require('path'); // Asegúrate de requerir 'path'
const app = require(path.join(__dirname, '..', '..', 'app')); // Usa 'path.join' para construir la ruta
const { connectDB, closeDB } = require(path.join(__dirname, '..', '..', 'config', 'database'));
const Tarea = require(path.join(__dirname, '..', '..', 'models', 'tarea'));
const { Builder } = require(path.join(__dirname, '..', 'builders', 'tareaBuilder'));

beforeAll(async () => {
    await connectDB();
});

beforeEach(async () => {
    const tarea1 = Builder.tarea({ 
        id: 1, 
        tarea: 'Tarea de prueba 1', 
        usuario: 'Usuario 1',
        area: 'Compras', 
        estado: 'Pendiente', 
        prioridad: 'Media', 
        fechaVencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)  // 7 días en el futuro
    });
    
    const tarea2 = Builder.tarea({ 
        id: 2, 
        tarea: 'Tarea de prueba 2', 
        usuario: 'Usuario 2',
        area: 'Ventas', 
        estado: 'En progreso', 
        prioridad: 'Alta', 
        fechaVencimiento: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)  // 14 días en el futuro
    });
    
    await Tarea.create(tarea1);
    await Tarea.create(tarea2);
});

afterEach(async () => {
    await Tarea.deleteMany();
});

afterAll(async () => {
    await closeDB();
});

describe('API de Tareas', () => {
    test('GET | obtener todas las tareas', async () => {
        const res = await request(app).get('/tareas').expect(200);

        expect(res.body.length).toBe(2);
        expect(res.body[0].tarea).toBe('Tarea de prueba 1');
    });

    test('POST | crear una nueva tarea', async () => {
        const nuevaTarea = Builder.tarea({
            id: 3,
            tarea: 'Nueva tarea de prueba',
            usuario: 'Nuevo usuario',
            area: 'Producción', 
            estado: 'Pendiente', 
            prioridad: 'Baja', 
            fechaVencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)  // 7 días en el futuro
        });

        const res = await request(app)
            .post('/tareas')
            .send(nuevaTarea)
            .set('Accept', 'application/json')
            .expect(201);

        const { _id, __v, fechaCreacion, ...tareaGuardada } = res.body;
        tareaGuardada.fechaVencimiento = new Date(tareaGuardada.fechaVencimiento); // Convertir fecha a objeto Date

        expect(tareaGuardada).toEqual(nuevaTarea);

        const savedTarea = await Tarea.findById(res.body._id);
        expect(savedTarea.tarea).toBe(nuevaTarea.tarea);
    });

    test('GET | obtener una tarea por ID', async () => {
        const tarea = await Tarea.findOne({ id: 1 });
        const res = await request(app).get(`/tareas/${tarea.id}`).expect(200);

        expect(res.body.tarea).toBe(tarea.tarea);
        expect(res.body.usuario).toBe(tarea.usuario);
    });

    test('PUT | actualizar una tarea existente', async () => {
        const tarea = await Tarea.findOne({ id: 1 });
        const actualizacion = { 
            tarea: 'Tarea actualizada', 
            usuario: 'Usuario actualizado',
            area: 'Inventario', 
            estado: 'Completada', 
            prioridad: 'Alta', 
            fechaVencimiento: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)  // 21 días en el futuro
        };

        const res = await request(app)
            .put(`/tareas/${tarea.id}`)
            .send(actualizacion)
            .set('Accept', 'application/json')
            .expect(200);

        expect(res.body.tarea).toBe('Tarea actualizada');

        const tareaActualizada = await Tarea.findById(tarea._id);
        expect(tareaActualizada.tarea).toBe('Tarea actualizada');
    });

    test('DELETE | eliminar una tarea por ID', async () => {
        const tarea = await Tarea.findOne({ id: 1 });

        await request(app)
            .delete(`/tareas/${tarea.id}`)
            .expect(204);

        const tareaEliminada = await Tarea.findById(tarea._id);
        expect(tareaEliminada).toBeNull();
    });

    test('FILTRAR | filtrar tareas por área, estado, prioridad y usuario', async () => {
        // Limpiar la base de datos antes de crear las tareas
        await Tarea.deleteMany();

        const tarea1 = Builder.tarea({ 
            id: 3, 
            tarea: 'Tarea de prueba 3', 
            usuario: 'Usuario 3',
            area: 'Compras', 
            estado: 'Pendiente', 
            prioridad: 'Media', 
            fechaVencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)  // 7 días en el futuro
        });
        const tarea2 = Builder.tarea({ 
            id: 4, 
            tarea: 'Tarea de prueba 4', 
            usuario: 'Usuario 4',
            area: 'Ventas', 
            estado: 'Pendiente', 
            prioridad: 'Baja', 
            fechaVencimiento: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)  // 14 días en el futuro
        });
        await Tarea.create(tarea1);
        await Tarea.create(tarea2);

        const res = await request(app).get('/tareas/filtrar?area=Ventas&estado=Pendiente&prioridad=Baja&usuario=Usuario%204').expect(200);

        expect(res.body.length).toBe(1);
        expect(res.body[0].area).toBe('Ventas');
    });
});
