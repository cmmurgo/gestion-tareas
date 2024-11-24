const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');
const Tarea = require('../../models/tarea');
const connectDB = require('../../config/database');

let request;

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) { // Verificar si no hay una conexión activa antes de conectar
        await connectDB();
    }
    request = supertest(app);
});

afterEach(async () => {
    await Tarea.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect(); // Desconectar la base de datos después de todas las pruebas
});

describe('API de Tareas', () => {
    let primeraTareaId;
    let segundaTareaId;

    beforeEach(async () => {
        const primeraTarea = new Tarea({
            tarea: 'Primera tarea de prueba',
            usuario: 'Test User',
            area: 'Ventas',
            estado: 'Pendiente',
            prioridad: 'Alta',
            fechaCreacion: '2024-11-23T19:46:05.645Z',
            fechaVencimiento: '2024-11-23T19:46:05.643Z'
        });

        const segundaTarea = new Tarea({
            tarea: 'Segunda tarea de prueba',
            usuario: 'Otro Usuario',
            area: 'Compras',
            estado: 'Pendiente',
            prioridad: 'Media',
            fechaCreacion: '2024-11-23T19:46:05.645Z',
            fechaVencimiento: '2024-12-31T00:00:00.000Z'
        });

        const savedPrimeraTarea = await primeraTarea.save();
        const savedSegundaTarea = await segundaTarea.save();
        primeraTareaId = savedPrimeraTarea._id.toString();
        segundaTareaId = savedSegundaTarea._id.toString();
        console.log(`Tareas creadas: ${primeraTareaId}, ${segundaTareaId}`); // Imprimir las tareas creadas
    });

    it('debería crear dos tareas', async () => {
        const tareas = await Tarea.find();
        console.log(`Tareas en la base de datos: ${JSON.stringify(tareas, null, 2)}`); // Imprimir la cantidad de tareas en la base de datos
        expect(tareas.length).toBe(2);
        expect(tareas[0].tarea).toBe('Primera tarea de prueba');
        expect(tareas[1].tarea).toBe('Segunda tarea de prueba');
    });

    it('debería consultar la primera tarea generada', async () => {
        const response = await request.get(`/tareas/${primeraTareaId}`);
        console.log(`Consulta de la primera tarea: ${JSON.stringify(response.body, null, 2)}`); // Imprimir la tarea consultada
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(primeraTareaId);  // Verificar id en lugar de _id
        expect(response.body.prioridad).toBe('Alta');
        expect(response.body.tarea).toBe('Primera tarea de prueba');
    });

    it('debería editar la prioridad de la primera tarea generada', async () => {
        const actualizadaTarea = {
            prioridad: 'Baja'
        };

        const response = await request.put(`/tareas/${primeraTareaId}`).send(actualizadaTarea);
        console.log(`Tarea actualizada: ${JSON.stringify(response.body, null, 2)}`); // Imprimir la tarea actualizada
        expect(response.status).toBe(200);
        expect(response.body.prioridad).toBe(actualizadaTarea.prioridad);
    });

    it('debería eliminar la segunda tarea generada', async () => {
        const response = await request.delete(`/tareas/${segundaTareaId}`);
        expect(response.status).toBe(204);
        console.log(`Tarea eliminada: ${segundaTareaId}`); // Imprimir la tarea eliminada

        const tareas = await Tarea.find();
        console.log(`Tareas restantes en la base de datos: ${JSON.stringify(tareas, null, 2)}`); // Imprimir la cantidad de tareas restantes
        expect(tareas.length).toBe(1);
        expect(tareas[0]._id.toString()).toBe(primeraTareaId);
    });
});
