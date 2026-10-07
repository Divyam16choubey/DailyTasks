import { useEffect, useMemo, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { FaCheck, FaEdit, FaPlus, FaTasks } from 'react-icons/fa'
import { FiCheckCircle, FiCircle, FiInbox } from 'react-icons/fi'
import { v4 as uuidv4 } from 'uuid'
import Navbar from './components/Navbar'

const STORAGE_KEY = 'todos'

function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      return Array.isArray(savedTodos) ? savedTodos : []
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
  })
  const [showFinished, setShowFinished] = useState(true)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const completedCount = useMemo(
    () => todos.filter((item) => item.isCompleted).length,
    [todos],
  )
  const remainingCount = todos.length - completedCount
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0
  const visibleTodos = showFinished ? todos : todos.filter((item) => !item.isCompleted)

  const handleSubmit = (event) => {
    event.preventDefault()
    const value = todo.trim()
    if (!value) return

    if (editingId) {
      setTodos((currentTodos) =>
        currentTodos.map((item) => (item.id === editingId ? { ...item, todo: value } : item)),
      )
      setEditingId(null)
    } else {
      setTodos((currentTodos) => [
        ...currentTodos,
        { id: uuidv4(), todo: value, isCompleted: false },
      ])
    }
    setTodo('')
  }

  const handleEdit = (id) => {
    const selectedTodo = todos.find((item) => item.id === id)
    if (!selectedTodo) return
    setTodo(selectedTodo.todo)
    setEditingId(id)
  }

  const handleDelete = (id) => {
    setTodos((currentTodos) => currentTodos.filter((item) => item.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setTodo('')
    }
  }

  const handleCheckbox = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item,
      ),
    )
  }

  const clearCompleted = () => {
    setTodos((currentTodos) => currentTodos.filter((item) => !item.isCompleted))
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="dashboard">
        <section className="hero-section" id="focus">
          <div>
            <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
            <h1>Make today <span>count.</span></h1>
            <p className="hero-copy">A simple space to capture what matters and keep your momentum.</p>
          </div>
          <div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` }}>
            <div className="progress-ring__inner">
              <strong>{progress}%</strong>
              <small>complete</small>
            </div>
          </div>
        </section>

        <section className="stats-grid" aria-label="Task summary">
          <div className="stat-card stat-card--purple">
            <span className="stat-icon"><FaTasks /></span>
            <div><strong>{todos.length}</strong><span>Total tasks</span></div>
          </div>
          <div className="stat-card stat-card--green">
            <span className="stat-icon"><FiCheckCircle /></span>
            <div><strong>{completedCount}</strong><span>Completed</span></div>
          </div>
          <div className="stat-card stat-card--orange">
            <span className="stat-icon"><FiCircle /></span>
            <div><strong>{remainingCount}</strong><span>Remaining</span></div>
          </div>
        </section>

        <section className="task-panel" id="tasks">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">YOUR LIST</p>
              <h2>{editingId ? 'Update task' : 'What needs doing?'}</h2>
            </div>
            {completedCount > 0 && (
              <button className="text-button" type="button" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </div>

          <form className="task-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="task-input">Task description</label>
            <input
              id="task-input"
              onChange={(event) => setTodo(event.target.value)}
              placeholder="e.g. Prepare presentation for Monday"
              value={todo}
              type="text"
              autoComplete="off"
            />
            <button className="primary-button" type="submit" disabled={!todo.trim()}>
              {editingId ? <FaCheck /> : <FaPlus />}
              {editingId ? 'Update' : 'Add task'}
            </button>
          </form>

          <div className="list-toolbar">
            <h3>Tasks <span>{visibleTodos.length}</span></h3>
            <label className="toggle-label">
              <input
                onChange={() => setShowFinished((current) => !current)}
                type="checkbox"
                checked={showFinished}
              />
              <span className="toggle" aria-hidden="true" />
              Show completed
            </label>
          </div>

          <div className="todo-list">
            {visibleTodos.length === 0 ? (
              <div className="empty-state">
                <span><FiInbox /></span>
                <h3>{todos.length ? 'All caught up!' : 'Your list is empty'}</h3>
                <p>{todos.length ? 'You have completed every task. Nice work.' : 'Add your first task above to get started.'}</p>
              </div>
            ) : (
              visibleTodos.map((item) => (
                <article className={`todo-item ${item.isCompleted ? 'todo-item--completed' : ''}`} key={item.id}>
                  <button
                    className="check-button"
                    onClick={() => handleCheckbox(item.id)}
                    aria-label={item.isCompleted ? `Mark ${item.todo} as incomplete` : `Mark ${item.todo} as complete`}
                    type="button"
                  >
                    {item.isCompleted ? <FiCheckCircle /> : <FiCircle />}
                  </button>
                  <p>{item.todo}</p>
                  <div className="item-actions">
                    <button onClick={() => handleEdit(item.id)} aria-label={`Edit ${item.todo}`} type="button"><FaEdit /></button>
                    <button onClick={() => handleDelete(item.id)} aria-label={`Delete ${item.todo}`} type="button"><AiFillDelete /></button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
