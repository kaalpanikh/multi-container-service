const mongoose = require('mongoose');

beforeAll(async () => {
  const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/todos_test';
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
});

jest.setTimeout(30000); // Increase timeout for MongoDB operations
