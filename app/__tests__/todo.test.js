const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

beforeAll(async () => {
  const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/todos_test';
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Todo API', () => {
  it('should return empty array when no todos exist', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBe(0);
  });

  it('should create a new todo', async () => {
    const todo = {
      title: 'Test Todo',
      description: 'Test Description'
    };

    const res = await request(app)
      .post('/api/todos')
      .send(todo);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(todo.title);
    expect(res.body.description).toBe(todo.description);
  });
});
