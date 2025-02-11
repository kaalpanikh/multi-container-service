const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for better query performance
todoSchema.index({ completed: 1, dueDate: 1 });
todoSchema.index({ createdAt: -1 });

// Virtual field for status
todoSchema.virtual('status').get(function() {
  if (this.completed) return 'completed';
  if (!this.dueDate) return 'pending';
  return new Date() > this.dueDate ? 'overdue' : 'pending';
});

// Virtual field for timeRemaining
todoSchema.virtual('timeRemaining').get(function() {
  if (!this.dueDate) return null;
  if (this.completed) return 'completed';
  
  const now = new Date();
  const diff = this.dueDate - now;
  
  if (diff < 0) return 'overdue';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  return `${days}d ${hours}h`;
});

// Pre-save middleware to trim strings
todoSchema.pre('save', function(next) {
  if (this.title) this.title = this.title.trim();
  if (this.description) this.description = this.description.trim();
  next();
});

module.exports = mongoose.model('Todo', todoSchema);
