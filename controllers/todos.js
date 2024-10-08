const Todo = require('../models/Todo')
const Note = require('../models/Note')
const moment = require('moment')

module.exports = {
    getTodos: async (req,res)=>{
        console.log(req.query.type)

        if (req.query.type === 'important') {
            try {
                const todoItems = await Todo.find({userId:req.user.id, important: true})
                const important = todoItems.length
                const planned = await Todo.countDocuments({userId:req.user.id, dueDate: { $ne: null }})
                console.log(todoItems)
                return res.render('todos.ejs', {todos: todoItems, user: req.user, important, onlyImportant: true, planned, onlyPlanned: false})
            } catch (error) {
                console.log(error)
            }
        } else if (req.query.type === 'planned') {
                try {
                    const todoItems = await Todo.find({userId:req.user.id, dueDate: { $ne: null }})
                    const important = await Todo.countDocuments({userId:req.user.id, important: true})
                    const planned = todoItems.length
                    console.log(todoItems)
                    return res.render('todos.ejs', {todos: todoItems, user: req.user, important, onlyImportant: false, planned, onlyPlanned: true})
                } catch (error) {
                    console.log(error)
                }
        } else {
            try{
                const todoItems = await Todo.find({userId:req.user.id})
                const itemsLeft = await Todo.countDocuments({userId:req.user.id, completed: false})
                const important = await Todo.countDocuments({userId:req.user.id, important: true})
                const planned = await Todo.countDocuments({userId:req.user.id, dueDate: { $ne: null }})
                console.log(planned)
                res.render('todos.ejs', {todos: todoItems, left: itemsLeft, user: req.user, onlyImportant: false, important, planned, onlyPlanned: false})
            }catch(err){
                console.log(err)
            }
        }
    },
    createTodo: async (req, res)=>{
        try{
            await Todo.create({todo: req.body.todoItem, completed: false, important: false, dueDate: null, userId: req.user.id})
            console.log('Todo has been added!')
            res.redirect('/todos')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteTodo: async (req, res)=>{
        const toDoId = req.body.todoIdFromJSFile || req.query.id
        try{
            await Todo.findOneAndDelete({_id: toDoId})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    },
    editTodo: async (req, res)=>{
        const toDoId = req.body.editTodoId 
        const text = req.body.newText 
        try{
            await Todo.findOneAndUpdate({_id: toDoId}, {
                todo: text
            })
            console.log('Updated Todo')
            res.json('Updated It')
        }catch(err){
            console.log(err)
        }
    },
    markImportant: async (req, res) => {
        const toDoId = req.body.todoId

        try {
            await Todo.findOneAndUpdate({_id: toDoId}, {
                important: true
            })
            console.log('Marked Important')
            res.json('Marked Important')
        } catch (error) {
            console.log(error)
        }
    },
    markNotImportant: async (req, res) => {
        const toDoId = req.body.todoId

        try {
            await Todo.findOneAndUpdate({_id: toDoId}, {
                important: false
            })
            console.log('Marked Not Important')
            res.json('Marked Not Important')
        } catch (error) {
            console.log(error)
        }
    },
    addTodoNote: async (req, res) => {
    
        try{
            const date = Date.now()
            await Note.create({note: req.body.note, userId: req.user.id, todoId: req.body.todoId})
            console.log('Note has been added!')
            res.json('Note has been added!')
        }catch(err){
            console.log(err)
        }
    },
    getTodoNote: async (req, res) => {
        console.log(req.query.id)
        try {
            const notes = await Note.find({userId: req.user.id, todoId: req.query.id})
            if (notes.length === 0) return res.json({"note": "Note doesn't exist."})
                else {
                    const date = moment(notes[0].modifiedAt).calendar()
                    return res.json({"note": notes[0].note, "date": date})
                }
        } catch (error) {
            console.log(error)
        }
    },
    updateTodoNote: async (req, res) => {
        try {
            await Note.findOneAndUpdate({userId: req.user.id, todoId: req.body.todoId}, {
                note: req.body.note,
                modifiedAt: new Date()
            })
            res.json('Note updated!')
        } catch (error) {
            console.log(error)
        }
    },
    deleteNote: async (req, res) => {
        try {
            await Note.findOneAndDelete({userId: req.user.id, todoId: req.body.todoId})
            console.log('Note deleted')
            res.json('Note deleted.')
        } catch (error) {
            console.log(error)
        }
    },
    addDueDate: async (req, res) => {
        try {
            await Todo.findOneAndUpdate({userId: req.user.id, _id: req.body.todoId}, {
                dueDate: req.body.dueDate
            })
            console.log('Due date saved!')
            res.json('Due date saved!')
        } catch (error) {
            console.log(error)
        }
    },
    getDueDate: async (req, res) => {
        
        try {
            const result = await Todo.find({userId: req.user.id, _id: req.query.id})
            console.log(result)
            res.json({dueDate: result[0].dueDate})
        } catch (error) {
            console.log(error)
        }
    },
    deleteDueDate: async (req, res) => {
        try {
            await Todo.findOneAndUpdate({userId: req.user.id, _id: req.body.todoId}, {
                dueDate: null
            })
            console.log('Due date deleted!')
            res.json('Due date deleted!')
        } catch (error) {
            console.log(error)
        }
    }
}    