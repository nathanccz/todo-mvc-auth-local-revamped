const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('td.not')
const todoComplete = document.querySelectorAll('td.completed')
const editItem = document.querySelectorAll('.edit')
const checkboxComplete = Array.from(document.querySelectorAll('.todoCheckbox')).filter(el => el.checked === true)
const checkboxIncomplete = Array.from(document.querySelectorAll('.todoCheckbox')).filter(el => el.checked === false)
const notImportantStars = Array.from(document.querySelectorAll('.notImportant'))
const importantStars = Array.from(document.querySelectorAll('.important'))
const todoItemsAll = document.querySelectorAll('.todoItem')
const closeButton = document.querySelector('.chevron')
const notesTextArea = document.querySelector('.notesTextArea')
const lastUpdatedSpan = document.querySelector('.lastUpdated')

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

Array.from(checkboxIncomplete).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(checkboxComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

Array.from(editItem).forEach((el)=>{
    el.addEventListener('click', editTodo)
})

Array.from(notImportantStars).forEach((el)=>{
    el.addEventListener('click', markImportant)
})

Array.from(importantStars).forEach((el)=>{
    el.addEventListener('click', markNotImportant)
})

Array.from(todoItemsAll).forEach((el)=>{
    el.addEventListener('click', openModal)
})

closeButton.addEventListener('click', closeModal)

document.querySelector('.saveNoteBtn').addEventListener('click', addTodoNote)

window.onload = (event) => {
    console.log(this.childNodes)
    if (localStorage.getItem('todoId')) {
        let todoId = localStorage.getItem('todoId')
        let todoItem = localStorage.getItem('todoItem')
        openModal(event, todoId, todoItem)
    }
};



async function deleteTodo(){
    const todoId = this.parentNode.dataset.id
    console.log(todoId)
    try{
        const response = await fetch('todos/deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const todoId = this.parentNode.dataset.id || this.dataset.id
    // const checkBox = document.querySelector(`[data-id="${todoId}"] input`)
    try{
        const response = await fetch('todos/markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const todoId = this.parentNode.dataset.id || this.dataset.id
    try{
        const response = await fetch('todos/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function editTodo() {
    const todoId = this.parentNode.dataset.id
    const newText = document.querySelector('#edit_modal .modal-box input').value
    
    try {
        const response = await fetch('todos/editTodo', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'editTodoId': todoId,
                'newText': newText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (error) {
        console.log(error)
    }
}

async function markImportant() {
    const todoId = this.parentNode.dataset.id
    console.log(todoId)
    try {
        const response = await fetch('todos/markImportant', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoId': todoId,
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (error) {
        console.log(error)
    }
}

async function markNotImportant() {
    const todoId = this.parentNode.dataset.id

    try {
        const response = await fetch('todos/markNotImportant', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoId': todoId,
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (error) {
        console.log(error)
    }
}

async function openModal(event, todoIdFromLS, todoItemFromLS) {

    if (event.target.tagName === 'I' || event.target.tagName === 'INPUT') return

    document.querySelector('.my-drawer').classList.remove('hidden')
    document.getElementById('pageWrapper').style.opacity = .6

    todoItemsAll.forEach(el => el.removeEventListener('click', openModal))

    let todoId, todoItemText
    
   if (this.childNodes) {
        todoId = this.childNodes[1].dataset.id 
        todoItemText = this.childNodes[1].innerText
   } else {
        todoId = todoIdFromLS
        todoItemText = todoItemFromLS
   }

    document.querySelector('.my-drawer-header').textContent = todoItemText
    document.querySelector('.edit-input').value = todoItemText
    document.querySelector('.saveNoteBtn').setAttribute('data-id', todoId)

    Array.from(document.querySelectorAll('.modal-action')).forEach(el => {
        el.setAttribute('data-id', todoId)
    })
  
    const response = await fetch(`/todos/getTodoNote?id=${todoId}`)
    const data = await response.json()
    console.log(data)
    
    if (data.note === "Note doesn't exist.") notesTextArea.textContent = "Add notes."
        else {
            notesTextArea.textContent = data.note
            lastUpdatedSpan.textContent = `Last updated: ${data.date}`
        }

}

function closeModal() {
    document.querySelector('.my-drawer').classList.add('hidden')
    document.getElementById('pageWrapper').style.opacity = 1

    Array.from(todoItemsAll).forEach((el)=>{
        el.addEventListener('click', openModal)
    })

    notesTextArea.textContent = ''
    lastUpdatedSpan.textContent = ''

    localStorage.clear()
}



notesTextArea.addEventListener('input', () => {
    changedText = notesTextArea.value;
    notesTextArea.textContent = changedText
  });

async function addTodoNote() {
    const todoId = this.dataset.id
    const noteText = document.querySelector('.notesTextArea').textContent
    const todoItem = document.querySelector('.my-drawer-header').textContent
    let method, URI

    if (lastUpdatedSpan.textContent === '') {
        method = 'post'
        URI = 'todos/addTodoNote'
    } else {
        method = 'put'
        URI = 'todos/updateTodoNote'
    }

    try {
        const response = await fetch(URI, {
            method: method,
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoId': todoId,
                'note': noteText
            })
        })
        const data = await response.json()
        console.log(data)
        localStorage.setItem('todoId', todoId)
        localStorage.setItem('todoItem', todoItem)
        location.reload()
    } catch (error) {
        console.log(error)
    }
}