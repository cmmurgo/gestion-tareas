# Gestión de Tareas

Este es un proyecto de **gestión de tareas** desarrollado con Node.js, Express y MongoDB.

## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    ```

2. Ve al directorio del proyecto:
    ```bash
    cd gestion-tareas
    ```

3. Instala las dependencias:
    ```bash
    npm install
    ```

4. Inicia la aplicación:
    ```bash
    npm start
    ```

## Uso

Puedes interactuar con la API mediante herramientas como [Postman](https://www.postman.com/) o [Thunder Client](https://www.thunderclient.com/).

### Endpoints disponibles:

- `GET /tareas`: Obtiene todas las tareas.
- `GET /tareas/:id`: Obtiene una tarea específica por su ID.
- `POST /tareas`: Crea una nueva tarea.
- `PUT /tareas/:id`: Actualiza una tarea existente.
- `DELETE /tareas/:id`: Elimina una tarea por su ID.

## Dependencias

- Node.js
- Express
- Mongoose
- MongoDB

## Si se crea el proyecto desde cero

Requisitos previos:
	-tener instalado Node.js
	-tener instalado MongoDB (instalar MongoDB version 5 de https://www.mongodb.com/try/download/community)


Pasos para crear el proyecto:
	1-mkdir sistema-gestion-tareas
	2-cd sistema-gestion-tareas
	3-npm init -y
	4-npm install express
	5-Crear la estructura de archivos
	sistema-gestion-tareas/
	├── controllers
    	└── tareas.js
    ├── models
    	└── tarea.js
	└── app.js
	
	6-npm start //Para iniciar el proyecto

Instalar Mongoose en el proyecto:
	1- instalar Mongoose en el proyecto (npm install mongoose)

Para probar CRUD:

	1- Listar tareas en thunder client (o navegador)
	GET 
	http://localhost:3000/tareas

	2- Obtener una tarea específica (por id) en thunder client:
	GET
	http://localhost:3000/tareas/1

	3- Agregar una nueva tarea en thunder client:
	POST 
	http://localhost:3000/tareas

		{
		  "id": 1,
		  "tarea": "Mi primera tarea",
		  "usuario": "Juan Perez",
		  "estado": false,
		  "prioridad": "alta"
		}

	4- Eliminar una tarea en thunder client:
	DELETE
	 http://localhost:3000/tareas/1
	 
	5- Actualizar una tarea en thunder client: 
	PUT
	 http://localhost:3000/tareas/1

		{
			"tarea": "Tarea actualizada",
			"estado": true
		}
