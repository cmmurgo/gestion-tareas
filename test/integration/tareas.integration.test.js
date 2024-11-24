const mongoose = require('mongoose');
const request = require('supertest');
const path = require('path');
const app = require(path.join(__dirname, '..', '..', 'app'));
const { connectDB, closeDB } = require(path.join(__dirname, '..', '..', 'config', 'database'));
const Tarea = require(path.join(__dirname, '..', '..', 'models', 'tarea'));
const tareasData = require(path.join(__dirname, '..', 'data', 'testData'));
const { Builder } = require(path.join(__dirname, '..', 'builders', 'tareaBuilder'));

beforeAll(async () => {
    await connectDB();
});

beforeEach(async () => {
    await Tarea.create(tareasData.slice(0, 5));
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

        expect(res.body.length).toBe(5);

        const tareasOrdenadas = res.body.sort((a, b) => a.id - b.id); // Ordenar tareas por ID
        expect(tareasOrdenadas[0].tarea).toBe('Tarea de prueba 1');
    });

    test('POST | crear una nueva tarea', async () => {
        const nuevaTarea = tareasData[4];

        const res = await request(app)
            .post('/tareas')
            .send(nuevaTarea)
            .set('Accept', 'application/json')
            .expect(201);

        const { _id, __v, fechaCreacion, ...tareaGuardada } = res.body;
        tareaGuardada.fechaVencimiento = new Date(tareaGuardada.fechaVencimiento);

        expect(tareaGuardada).toEqual(nuevaTarea);

        const savedTarea = await Tarea.findById(res.body._id);
        expect(savedTarea.tarea).toBe(nuevaTarea.tarea);
    });

    test('GET | obtener una tarea por ID', async () => {
        const tarea = await Tarea.findOne({ id: 1 });
        const res = await request(app).get(`/tareas/${tarea.id}`).expect(200);

        expect(res.body.id).toBe(tarea.id);
        expect(res.body.tarea).toBe(tarea.tarea);
        expect(res.body.usuario).toBe(tarea.usuario);
        expect(res.body.area).toBe(tarea.area);
        expect(res.body.estado).toBe(tarea.estado);
        expect(res.body.prioridad).toBe(tarea.prioridad);
        expect(new Date(res.body.fechaVencimiento)).toEqual(tarea.fechaVencimiento);
    });

    test('PUT | actualizar una tarea existente', async () => {
        const tarea = await Tarea.findOne({ id: 1 });
        const actualizacion = tareasData[5];

        const res = await request(app)
            .put(`/tareas/${tarea.id}`)
            .send(actualizacion)
            .set('Accept', 'application/json')
            .expect(200);

        const { _id, __v, fechaCreacion, id, ...tareaActualizada } = res.body;
        tareaActualizada.fechaVencimiento = new Date(tareaActualizada.fechaVencimiento);

        const { id: actualizacionId, ...expectedActualizacion } = actualizacion;
        expect(tareaActualizada).toEqual(expectedActualizacion);
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
        const res = await request(app).get('/tareas/filtrar?area=Ventas&estado=Pendiente&prioridad=Baja&usuario=Usuario%204').expect(200);

        expect(res.body.length).toBe(1);
        expect(res.body[0].area).toBe('Ventas');
    });

    test('POST | crear una nueva tarea con token', async () => {
        const nuevaTarea = tareasData[3];

        const token = 'tu_token_de_autenticacion_aqui'; // Reemplaza con el token real

        const res = await request(app)
            .post('/tareas')
            .send(nuevaTarea)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(201);

        const { _id, __v, fechaCreacion, ...tareaGuardada } = res.body;
        tareaGuardada.fechaVencimiento = new Date(tareaGuardada.fechaVencimiento);

        expect(tareaGuardada).toEqual(nuevaTarea);

        const savedTarea = await Tarea.findById(res.body._id);
        expect(savedTarea.tarea).toBe(nuevaTarea.tarea);
    });
});
