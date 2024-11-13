// Importar el módulo mongoose para manejar la conexión y los modelos de MongoDB
const mongoose = require('mongoose');

// Importar el plugin mongoose-unique-validator para validar campos únicos en los esquemas
const uniqueValidator = require('mongoose-unique-validator');

// Definir el esquema de usuario utilizando mongoose.Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String, // Definir el tipo de dato como String
    unique: true // Indicar que este campo debe ser único en la base de datos
  },
  name: String, // Definir el campo name como String
  passwordHash: String, // Almacenar el hash de la contraseña
  posts: [ // Definir un array de publicaciones asociadas al usuario
    {
      type: mongoose.Schema.Types.ObjectId, // Tipo de dato ObjectId, que se refiere a otro documento
      ref: 'Post' // Referencia al modelo 'Post'
    }
  ]
});

// Configurar el esquema para transformar el objeto devuelto al convertir a JSON
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // Convertir _id a string y asignar a id
    delete returnedObject._id; // Eliminar el campo _id del objeto devuelto
    delete returnedObject.__v; // Eliminar la versión del documento (__v) del objeto devuelto
    delete returnedObject.passwordHash; // Eliminar el hash de la contraseña del objeto devuelto
  }
});

// Aplicar el plugin mongoose-unique-validator al esquema para validar campos únicos
userSchema.plugin(uniqueValidator);

// Crear el modelo User basado en el esquema userSchema
const User = mongoose.model('User', userSchema);

// Exportar el modelo User para poder usarlo en otras partes de la aplicación
module.exports = User;
