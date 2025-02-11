const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Todo = require('../src/models/todo.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Todo.deleteMany({});
});

describe('Todo API', () => {
  it('should create a new todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({
        title: 'Test Todo',
        description: 'Test Description'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Todo');
    expect(res.body.description).toBe('Test Description');
    expect(res.body.completed).toBe(false);
  });

  it('should get all todos', async () => {
    await Todo.create({
      title: 'Test Todo',
      description: 'Test Description'
    });

    const res = await request(app).get('/api/todos');
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBe(1);
  });
});
