const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Definir el esquema de usuario utilizando mongoose.Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String, 
    unique: true 
  },
  name: String, 
  passwordHash: String, 

});

// Configurar el esquema para transformar el objeto devuelto al convertir a JSON
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // Convertir _id a string y asignar a id
    delete returnedObject._id; 
    delete returnedObject.__v;
    delete returnedObject.passwordHash; 
  }
});

// Aplicar el plugin mongoose-unique-validator al esquema para validar campos únicos
userSchema.plugin(uniqueValidator);

// Crear el modelo User basado en el esquema userSchema
const User = mongoose.model('User', userSchema);

// Exportar el modelo User para poder usarlo en otras partes de la aplicación
module.exports = User;
