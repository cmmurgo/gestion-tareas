const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

mongoose.Promise = global.Promise;

let mongoServer;

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB Memory Server connected');
    }
  } else {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  }
};

const closeDB = async () => {
  await mongoose.disconnect();
  if (process.env.NODE_ENV === 'test' && mongoServer) {
    await mongoServer.stop();
  }
};

module.exports = { connectDB, closeDB };
