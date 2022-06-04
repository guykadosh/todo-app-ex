'use strict'

function onInit() {
  renderTodos()
}

function renderTodos() {
  const todos = getTodosForDisplay()

  if (!todos || todos.length === 0) {
    renderEmptyTodos()
    return
  }

  let status = getFilterStatus()

  const strHTMLs = todos.map((todo, idx) => {
    let elBtns
    if (!status) {
      const elBtnUp = `<button class="btn btn-up" onclick="onMove(event, 'up', '${todo.id}')">↑</button>`
      const elBtnDown = `<button class="btn btn-down" onclick="onMove(event, 'down', '${todo.id}')">↓</button>`

      elBtns = elBtnUp + elBtnDown

      if (idx === 0) elBtns = elBtnDown
      if (idx === todos.length - 1) elBtns = elBtnUp
    } else elBtns = ''
    return `<li
              class="${todo.isDone ? 'done' : ''}" 
              onclick="onToggleTodo('${todo.id}')"> 
              <span>${todo.txt}</span>
              <div>
              ${elBtns}
              <button class="btn" onclick="onRemoveTodo(event, '${
                todo.id
              }')">x</button>
              </div>
            </li>`
  })

  document.querySelector('ul').innerHTML = strHTMLs.join('')
  document.querySelector('.total-count').innerText = getTotalCount()
  document.querySelector('.active-count').innerText = getActiveCount()
}

function renderEmptyTodos() {
  var strHTML = ''
  switch (getFilterStatus()) {
    case 'done':
      strHTML = 'No Done Todos'
      break
    case 'active':
      strHTML = 'No Active Todos'
      break
    default:
      strHTML = 'No Todos'
  }

  document.querySelector('ul').innerHTML = strHTML
}

function onRemoveTodo(ev, todoId) {
  ev.stopPropagation()

  if (!confirm('Are you sure?')) return

  removeTodo(todoId)
  renderTodos()
}

function onToggleTodo(todoId) {
  toggleTodo(todoId)
  renderTodos()
}

function onAddTodo(ev) {
  ev.preventDefault()
  const elTxt = document.querySelector('[name=txt]')
  const elImportance = document.querySelector('[name=importance]')
  const txt = elTxt.value
  const importance = elImportance.value

  if (!txt) return

  addTodo(txt, importance)
  renderTodos()
  elTxt.value = ''
}

function onSetFilter(ev) {
  console.log(ev)
  ev.stopPropagation()

  const elBtn = ev.target
  if (elBtn.localName === 'div') return

  document
    .querySelectorAll('.btns-filter a')
    .forEach(elBtn => elBtn.classList.remove('selected'))

  elBtn.classList.add('selected')

  const status = elBtn.dataset.filter
  setFilterByStatus(status)
  renderTodos()
}

function onSetFilterByTxt(filterByTxt) {
  console.log('i got called')
  console.log(filterByTxt)
  setFilterByTxt(filterByTxt)
  renderTodos()
}

function onSortTodos(sortByTxt) {
  setSorter(sortByTxt)
  renderTodos()
}

function onMove(ev, direction, id) {
  ev.stopPropagation()

  if (direction === 'up') moveTodo(id, -1)

  if (direction === 'down') moveTodo(id, 1)

  renderTodos()
}
