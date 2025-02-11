const request = require('supertest');
const app = require('../src/app');
const Todo = require('../src/models/todo.model');

beforeEach(async () => {
  await Todo.deleteMany();
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
    expect(res.body.completed).toBe(false);
  });

  it('should get a todo by id', async () => {
    const todo = new Todo({
      title: 'Test Todo',
      description: 'Test Description'
    });
    await todo.save();

    const res = await request(app).get(`/api/todos/${todo._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(todo.title);
    expect(res.body.description).toBe(todo.description);
  });

  it('should update a todo', async () => {
    const todo = new Todo({
      title: 'Test Todo',
      description: 'Test Description'
    });
    await todo.save();

    const update = {
      title: 'Updated Todo',
      completed: true
    };

    const res = await request(app)
      .put(`/api/todos/${todo._id}`)
      .send(update);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(update.title);
    expect(res.body.description).toBe(todo.description);
    expect(res.body.completed).toBe(true);
  });

  it('should delete a todo', async () => {
    const todo = new Todo({
      title: 'Test Todo',
      description: 'Test Description'
    });
    await todo.save();

    const res = await request(app).delete(`/api/todos/${todo._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Todo deleted');

    const deletedTodo = await Todo.findById(todo._id);
    expect(deletedTodo).toBeNull();
  });
});
