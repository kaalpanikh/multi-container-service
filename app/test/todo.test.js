const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, mongoose } = require('../src/app');
const Todo = require('../src/models/todo.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Todo.deleteMany({});
});

describe('Todo API', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Todo API is running');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.uptime).toBeDefined();
    });
  });

  describe('POST /api/todos', () => {
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
      expect(res.body._id).toBeDefined();
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/todos', () => {
    it('should get all todos', async () => {
      await Todo.create([
        { title: 'Todo 1', description: 'Description 1' },
        { title: 'Todo 2', description: 'Description 2' }
      ]);

      const res = await request(app).get('/api/todos');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });
});
