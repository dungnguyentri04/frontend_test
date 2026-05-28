import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL

export default function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/todos`)
      .then(r => r.json())
      .then(data => { setTodos(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const addTodo = async () => {
    const title = input.trim()
    if (!title) return
    const res = await fetch(`${API}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })
    const newTodo = await res.json()
    setTodos(prev => [...prev, newTodo])
    setInput('')
  }

  const toggleTodo = async (id) => {
    const res = await fetch(`${API}/todos/${id}/toggle`, { method: 'PATCH' })
    const updated = await res.json()
    setTodos(prev => prev.map(t => t.id === id ? updated : t))
  }

  const deleteTodo = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: 'DELETE' })
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="app">
      <h1>📝 Todo App</h1>

      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Thêm việc cần làm..."
        />
        <button onClick={addTodo}>Thêm</button>
      </div>

      <div className="todo-list">
        {loading && <p className="empty">Đang tải...</p>}
        {!loading && todos.length === 0 && (
          <p className="empty">Chưa có việc gì cả 🎉</p>
        )}
        {todos.map(todo => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.title}</span>
            <button onClick={() => deleteTodo(todo.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  )
}
