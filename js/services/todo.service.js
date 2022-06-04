'use strict'

const STORAGE_KEY = 'todoDB'
let gTodos
let gSortBy
let gFilterBy = {
  txt: '',
  status: '',
}

_createTodos()

function getTodosForDisplay() {
  let todos = gTodos

  if (gFilterBy.status) {
    todos = todos.filter(
      todo =>
        (todo.isDone && gFilterBy.status === 'done') ||
        (!todo.isDone && gFilterBy.status === 'active')
    )
  }

  todos = todos.filter(todo => todo.txt.includes(gFilterBy.txt))
  // _filterTodos(todos)

  if (gSortBy) _sortTodos(todos)

  return todos
}

function getTotalCount() {
  return gTodos.length
}

function getActiveCount() {
  const activeTodos = gTodos.filter(todo => !todo.isDone)
  return activeTodos.length
}

function removeTodo(todoId) {
  const idx = gTodos.findIndex(todo => todo.id === todoId)
  gTodos.splice(idx, 1)

  _saveTodosToStorage()
}

function toggleTodo(todoId) {
  const todo = gTodos.find(todo => todo.id === todoId)
  todo.isDone = !todo.isDone
  _saveTodosToStorage()
}

function moveTodo(todoId, diff) {
  const idx = gTodos.findIndex(todo => todo.id === todoId)

  let temp = gTodos[idx]
  gTodos[idx] = gTodos[idx + diff]
  gTodos[idx + diff] = temp
}

function addTodo(txt, importance) {
  const todo = _createTodo(txt, importance)
  gTodos.push(todo)
  _saveTodosToStorage()
}

function getFilterStatus() {
  return gFilterBy.status
}

function setFilterByStatus(status) {
  gFilterBy.status = status
}
function setFilterByTxt(txt) {
  gFilterBy.txt = txt
}

function setSorter(sortByTxt) {
  gSortBy = sortByTxt
}

function _createTodo(txt, importance = 1) {
  const todo = {
    id: _makeId(),
    txt,
    isDone: false,
    createdAt: Date.now(),
    importance,
  }
  return todo
}

function _createTodos() {
  let todos = loadFromStorage(STORAGE_KEY)

  if (!todos || !todos.length) {
    const txts = ['Learn HTML', 'Study CSS', 'Master JS']
    // todos = txts.map(txt => _createTodo(txt))
    todos = txts.map(_createTodo)
  }

  gTodos = todos
  _saveTodosToStorage()
}

function _saveTodosToStorage() {
  saveToStorage(STORAGE_KEY, gTodos)
}

function _makeId(length = 5) {
  let txt = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function _sortTodos(todos) {
  if (gSortBy === 'created') {
    todos = todos.sort((todo1, todo2) => todo1.createdAt - todo2.createdAt)
  }

  if (gSortBy === 'importance') {
    todos = todos.sort((todo1, todo2) => todo2.importance - todo1.importance)
  }

  if (gSortBy === 'txt') {
    todos = todos.sort((todo1, todo2) => todo1.txt.localeCompare(todo2.txt))
  }
}

function _filterTodos(todos) {
  if (gFilterBy.status) {
    todos = todos.filter(
      todo =>
        (todo.isDone && gFilterBy.status === 'done') ||
        (!todo.isDone && gFilterBy.status === 'active')
    )
  }

  todos = todos.filter(todo => todo.txt.includes(gFilterBy.txt))
}
