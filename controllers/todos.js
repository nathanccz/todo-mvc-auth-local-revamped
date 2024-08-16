const Todo = require('../models/Todo')

module.exports = {
    getTodos: async (req,res)=>{
        console.log(req.user)
        try{
            const todoItems = await Todo.find({userId:req.user.id})
            const itemsLeft = await Todo.countDocuments({userId:req.user.id, completed: false})
            const important = await Todo.countDocuments({userId:req.user.id, important: true})
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft, user: req.user, important, onlyImportant: false})
        }catch(err){
            console.log(err)
        }
    },
    createTodo: async (req, res)=>{
        try{
            await Todo.create({todo: req.body.todoItem, completed: false, important: false, userId: req.user.id})
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
    getImportant: async (req, res) => {
    
        try {
            const todoItems = await Todo.find({userId:req.user.id, important: true})
            const important = todoItems.length
            console.log(todoItems)
            res.render('todos.ejs', {todos: todoItems, user: req.user, important, onlyImportant: true})
        } catch (error) {
            console.log(error)
        }
    }
}    