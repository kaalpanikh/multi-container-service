const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { config } = require('dotenv');

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/todos';

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/todos', require('./routes/todos'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

let server;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  // Start server only after successful database connection
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
  console.log('Received shutdown signal');
  
  // Close HTTP server
  if (server) {
    console.log('Closing HTTP server');
    await new Promise(resolve => server.close(resolve));
    console.log('HTTP server closed');
  }

  // Close MongoDB connection
  if (mongoose.connection.readyState === 1) {
    console.log('Closing MongoDB connection');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }

  console.log('Graceful shutdown completed');
  process.exit(0);
}
