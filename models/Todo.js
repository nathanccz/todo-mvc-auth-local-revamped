const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  important: {
    type: Boolean,
    required: false,
  },
  userId: {
    type: String,
    required: true
  },
  dueDate: {
    type: String
  }
})

module.exports = mongoose.model('Todo', TodoSchema)
