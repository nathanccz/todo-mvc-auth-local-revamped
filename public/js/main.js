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
const deleteNoteBtn = document.querySelector('.del-note')
const dateInput = document.getElementById('date-picker')
const saveDateBtn = document.querySelector('.saveDateBtn')
const deleteDateBtn = document.querySelector('.del-date')

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

deleteNoteBtn.addEventListener('click', deleteNote)

saveDateBtn.addEventListener('click', saveDueDate)

deleteDateBtn.addEventListener('click', deleteDueDate)

document.querySelector('.saveNoteBtn').addEventListener('click', addTodoNote)

window.onload = (event) => {
    
    if (localStorage.getItem('todoId')) {
        let todoId = localStorage.getItem('todoId')
        let todoItem = localStorage.getItem('todoItem')
        openModal(event, todoId, todoItem)
    }
};

//Date format conversion

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
    'August', 'September', 'October', 'November', 'December']

function formatDate(str) {
    let arr = str.split('-')
    return `${months[+arr[1] - 1]} ${+arr[2]}, ${arr[0]}`
}



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
        localStorage.clear()
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

function dateFormat(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

async function openModal(event, todoIdFromLS, todoItemFromLS) {

    if (event.target.tagName === 'I' || event.target.tagName === 'INPUT') return

    document.querySelector('.my-drawer').classList.remove('hidden')
    document.getElementById('pageWrapper').style.opacity = .6

    let today = dateFormat(new Date())

    dateInput.value = today
    dateInput.setAttribute('min', today)

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
    document.querySelector('.saveDateBtn').setAttribute('data-id', todoId)

    Array.from(document.querySelectorAll('.modal-action')).forEach(el => {
        el.setAttribute('data-id', todoId)
    })

    //Fetch due date:

    const dueDateRes = await fetch(`todos/getDueDate?id=${todoId}`)
    const dueDateData = await dueDateRes.json()

    console.log(dueDateData)

    if (dueDateData.dueDate) document.querySelector('.currentlyDue').textContent = 'Due:' + ' ' + formatDate(dueDateData.dueDate)
    
    //Fetch notes:
  
    const response = await fetch(`/todos/getTodoNote?id=${todoId}`)
    const data = await response.json()
    
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
    document.querySelector('.currentlyDue').textContent = ''

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

async function deleteNote() {
    const todoId = this.parentNode.dataset.id
    const todoItem = document.querySelector('.my-drawer-header').textContent

    try {
       const response = await fetch('todos/deleteNote', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoId': todoId,
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

async function saveDueDate() {
    const todoId = this.dataset.id
    const date = dateInput.value
    const todoItem = document.querySelector('.my-drawer-header').textContent

    try {
        const response = await fetch('todos/addDueDate', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoId': todoId,
                'dueDate': date
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

async function deleteDueDate() {
    const todoId = this.parentNode.dataset.id
    const todoItem = document.querySelector('.my-drawer-header').textContent

    try {
        const response = await fetch('todos/deleteDueDate', {
             method: 'put',
             headers: {'Content-type': 'application/json'},
             body: JSON.stringify({
                 'todoId': todoId,
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