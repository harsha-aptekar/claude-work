import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'claude-work-todos'

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function App() {
  const [todos, setTodos] = useState(loadTodos)
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function addTodo(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: trimmed, done: false },
    ])
    setText('')
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.done))
  }

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.done
    if (filter === 'completed') return t.done
    return true
  })

  const remaining = todos.filter((t) => !t.done).length

  return (
    <div className="app">
      <h1>Todo List</h1>

      <form className="add-form" onSubmit={addTodo}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={todo.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
            </label>
            <button
              type="button"
              className="delete-btn"
              onClick={() => deleteTodo(todo.id)}
              aria-label={`Delete ${todo.text}`}
            >
              ✕
            </button>
          </li>
        ))}
        {filteredTodos.length === 0 && (
          <li className="empty">No todos here</li>
        )}
      </ul>

      {todos.length > 0 && (
        <div className="footer">
          <span>{remaining} item{remaining === 1 ? '' : 's'} left</span>
          <div className="filters">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                type="button"
                className={filter === f ? 'active' : ''}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <button type="button" onClick={clearCompleted}>
            Clear completed
          </button>
        </div>
      )}
    </div>
  )
}

export default App
