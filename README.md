# Gestión de Tareas

Este es un proyecto de **gestión de tareas** desarrollado con Node.js, Express y MongoDB.

## Instalación

1. Clona el repositorio:
    git clone https://github.com/tu-usuario/tu-repositorio.git

2. Ve al directorio del proyecto:
    cd gestion-tareas

3. Instala las dependencias: 
    npm install

4. Inicia la aplicación: 
    npm start  (en produccion)
	npm run dev (para desarrollo)


## Uso

Puedes interactuar con la API mediante herramientas como [Postman](https://www.postman.com/) o [Thunder Client](https://www.thunderclient.com/).

### Endpoints disponibles:

- `GET /tareas`: Obtiene todas las tareas.
- `GET /tareas/id`: Obtiene una tarea específica por su ID.
- `POST /tareas`: Crea una nueva tarea.
- `PUT /tareas/id`: Actualiza una tarea existente.
- `DELETE /tareas/id`: Elimina una tarea por su ID.
- `FILTRAR /tareas/filtrar`: Filtra una tarea por area, estado, prioridad, usuario. 

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
		├── config/
		│   └── database.js
		├── controllers/
		│   └── tareas.js
		├── middlewares/
		│   └── authMiddleware.js
		├── models/
		│   └── tarea.js
		├── routes/
		│   └── tareas.js
		├── tests/
		│   ├── integration/
		│   │   └── tareas.integration.test.js
		│   ├── data/
		│   │   └── testData.js
		│   └── builders/
		│       └── tareaBuilder.js
		├── app.js


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
    		"tarea": "Solicitar cotización a proveedores",
    		"usuario": "Juan Pérez",
    		"area": "Compras",
    		"estado": "Pendiente",
    		"prioridad": "Alta",
    		"fechaVencimiento": "2024-10-20T00:00:00.000Z"
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

	6- Pruebas Endpoints Tareas

		Estructura de las Pruebas

		sistema-gestion-tareas/
		├── tests/
		│   ├── integration/
		│   │   └── tareas.integration.test.js
		│   ├── data/
		│   │   └── testData.js
		│   └── builders/
		│       └── tareaBuilder.js
		
		
		Descripción de las Pruebas
		
		GET | Obtener todas las tareas

		Objetivo: Verificar que la API puede obtener todas las tareas correctamente.

		POST | Crear una nueva tarea

		Objetivo: Verificar que se puede crear una nueva tarea.

		
		GET | Obtener una tarea por ID

		Objetivo: Verificar que se puede obtener una tarea específica por su ID.

		
		PUT | Actualizar una tarea existente

		Objetivo: Verificar que se puede actualizar una tarea existente.

		
		DELETE | Eliminar una tarea por ID

		Objetivo: Verificar que se puede eliminar una tarea por su ID.

		
		FILTRAR | Filtrar tareas por área, estado, prioridad y usuario

		Objetivo: Verificar que se pueden filtrar tareas por diferentes criterios, en este caso área.

		
		Configuración de la Base de Datos para Pruebas
		


		Cómo Ejecutar las Pruebas
		
		npm run test -- --watchAll

		Resultado :

			Las Impresiones por  Consola : 	

			console.log
				MongoDB Memory Server connected

			console.log
				Filtros recibidos: {
				area: 'Ventas',
				estado: 'Pendiente',
				prioridad: 'Baja',
				usuario: 'Usuario 4'
				}

			Resultados de las Pruebas:
				PASS  test/integration/tareas.integration.test.js
					API de Tareas
						√ GET | obtener todas las tareas (57 ms)
						√ POST | crear una nueva tarea (18 ms)
						√ GET | obtener una tarea por ID (8 ms)
						√ PUT | actualizar una tarea existente (11 ms)
						√ DELETE | eliminar una tarea por ID (14 ms)
						√ FILTRAR | filtrar tareas por área, estado, prioridad y usuario (19 ms)

					Test Suites: 1 passed, 1 total
					Tests:       6 passed, 6 total
					Snapshots:   0 total
					Time:        1.719 s, estimated 2 s
						


		
