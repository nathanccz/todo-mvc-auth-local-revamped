const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
  note: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  todoId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Note', NoteSchema)
