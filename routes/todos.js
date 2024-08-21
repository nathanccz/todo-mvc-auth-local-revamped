const express = require('express')
const router = express.Router()
const todosController = require('../controllers/todos') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, todosController.getTodos)

router.post('/createTodo', todosController.createTodo)

router.put('/markComplete', todosController.markComplete)

router.put('/markIncomplete', todosController.markIncomplete)

router.put('/editTodo', todosController.editTodo)

router.delete('/deleteTodo', todosController.deleteTodo)

router.put('/markImportant', todosController.markImportant)

router.put('/markNotImportant', todosController.markNotImportant)

router.post('/addTodoNote', todosController.addTodoNote)

router.get('/getTodoNote', todosController.getTodoNote)

router.put('/updateTodoNote', todosController.updateTodoNote)

router.delete('/deleteNote', todosController.deleteNote)

router.put('/addDueDate', todosController.addDueDate)

router.get('/getDueDate', todosController.getDueDate)

router.put('/deleteDueDate', todosController.deleteDueDate)

module.exports = router