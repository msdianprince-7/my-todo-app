'use client'

import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import ThemeToggle from './components/ThemeToggle'

interface Todo {
  id: number
  title: string
  done: boolean
  createdAt: string
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => { fetchTodos() }, [])

  async function fetchTodos() {
    const res = await fetch('/api/todos')
    const data = await res.json()
    if (Array.isArray(data)) {
      setTodos(data)
    } else {
      setTodos([])
    }
  }

  async function addTodo() {
    if (!title.trim()) return
    setLoading(true)
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    setTitle('')
    await fetchTodos()
    setLoading(false)
  }

  async function deleteTodo(id: number) {
    setDeletingId(id)
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    await fetchTodos()
    setDeletingId(null)
  }

  async function generateWithAI() {
    if (!prompt.trim()) return
    setAiLoading(true)
    await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    setPrompt('')
    await fetchTodos()
    setAiLoading(false)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* Gold top border line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-6 max-w-6xl mx-auto" style={{ borderBottom: '1px solid var(--border)' }}>
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(to bottom right, var(--accent), var(--accent-dark))`, boxShadow: '0 4px 12px var(--accent-glow)' }}>
      <span className="text-black text-xs font-black">✦</span>
    </div>
    <div>
      <p className="font-bold tracking-widest text-sm uppercase" style={{ color: 'var(--text-primary)' }}>Clarity</p>
      <p className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--accent-muted)' }}>AI Task Manager</p>
    </div>
  </div>

  <div className="flex items-center gap-4">
    <div className="text-right">
      <p className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
      </p>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
      </p>
    </div>
    <div className="h-8 w-px" style={{ background: 'var(--border)' }} />
    <div className="text-xs px-4 py-2 rounded-full font-medium tracking-wide" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
      {todos.length} Tasks
    </div>
    <div className="h-8 w-px" style={{ background: 'var(--border)' }} />
    <ThemeToggle />
    <div className="h-8 w-px" style={{ background: 'var(--border)' }} />
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="text-xs uppercase tracking-widest px-3 py-2 rounded-lg"
      style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      Sign Out
    </button>
  </div>
</nav>

      <main className="max-w-6xl mx-auto px-10 py-10">

        {/* Page Title */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Your Command <span style={{ color: 'var(--accent)' }}>Center</span>
          </h2>
          <p className="text-sm mt-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Plan with intention. Execute with precision.
          </p>
        </div>

        {/* AI Section — Full Width Hero */}
        <div className="relative rounded-2xl overflow-hidden mb-8" style={{ border: '1px solid var(--accent-border)' }}>
          {/* Background */}
          <div className="absolute inset-0" style={{ background: 'var(--bg-card)' }} />
          {/* Glow effects */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full" style={{ background: 'var(--accent)', opacity: 0.05, filter: 'blur(48px)' }} />
          <div className="absolute bottom-0 left-0 w-60 h-40 rounded-full" style={{ background: 'var(--accent)', opacity: 0.05, filter: 'blur(48px)' }} />
          {/* Gold corner accent */}
          <div className="absolute top-0 left-0 w-24 h-24 rounded-tl-2xl" style={{ borderTop: '2px solid var(--accent-border)', borderLeft: '2px solid var(--accent-border)' }} />
          <div className="absolute bottom-0 right-0 w-24 h-24 rounded-br-2xl" style={{ borderBottom: '2px solid var(--accent-border)', borderRight: '2px solid var(--accent-border)' }} />

          <div className="relative z-10 p-8">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
                    AI Generation
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Describe your goal
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                  Llama 3.3 · 70B will craft 5 precise tasks from your intent.
                </p>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. I want to build and launch my portfolio website this weekend..."
                  rows={3}
                  className="w-full rounded-xl px-5 py-4 text-sm outline-none resize-none leading-relaxed"
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-border)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                />

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs tracking-wide" style={{ color: 'var(--text-faint)' }}>Groq · Llama 3.3 70B Versatile</span>
                  </div>
                  <button
                    onClick={generateWithAI}
                    disabled={aiLoading || !prompt.trim()}
                    className="relative group flex items-center gap-2.5 text-black text-sm px-6 py-3 rounded-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: `linear-gradient(to right, var(--accent), var(--accent-dark))`,
                      boxShadow: '0 4px 16px var(--accent-glow)',
                    }}
                  >
                    {aiLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>✦ Generate Tasks</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-3 gap-6">

          {/* Quick Add */}
          <div className="col-span-1">
            <div className="rounded-2xl p-6 h-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-4 rounded-full" style={{ background: 'var(--accent)' }} />
                <h3 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>Quick Add</h3>
              </div>

              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Type a task..."
                rows={4}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-border)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              />

              <button
                onClick={addTodo}
                disabled={loading || !title.trim()}
                className="w-full mt-3 text-sm py-3 rounded-xl font-semibold disabled:opacity-30 tracking-wide"
                style={{
                  border: '1px solid var(--accent-border)',
                  color: 'var(--accent)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-bg)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.background = 'transparent' }}
              >
                {loading ? 'Adding...' : '+ Add Task'}
              </button>

              {/* Stats */}
              <div className="mt-6 pt-5 space-y-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Total</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{todos.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Pending</span>
                  <span className="font-bold" style={{ color: 'var(--accent)' }}>{todos.filter(t => !t.done).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Done</span>
                  <span className="font-bold" style={{ color: 'var(--success)' }}>{todos.filter(t => t.done).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="col-span-2">
            {todos.length === 0 ? (
              <div className="rounded-2xl flex flex-col items-center justify-center py-20 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="text-5xl mb-4 opacity-40">✦</div>
                <p className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>No tasks yet</p>
                <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Generate with AI or add one manually</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todos.map((todo, i) => (
                  <div
                    key={todo.id}
                    className="group flex items-start gap-4 rounded-2xl px-5 py-4"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      animationDelay: `${i * 40}ms`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.background = 'var(--bg-input)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)' }}
                  >
                    <div
                      className="w-5 h-5 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center"
                      style={{ border: '1px solid var(--border-hover)' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'var(--accent)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {todo.title}
                      </p>
                      <p className="text-[11px] mt-1.5 tracking-wide" style={{ color: 'var(--text-faint)' }}>
                        {new Date(todo.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit', minute: '2-digit'
                        })} · {new Date(todo.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      disabled={deletingId === todo.id}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                      style={{
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--danger-border)'; e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
                    >
                      {deletingId === todo.id ? '·' : '×'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Gold bottom border */}
      <div className="h-[1px] w-full mt-10" style={{ background: 'linear-gradient(to right, transparent, var(--accent-border), transparent)' }} />
    </div>
  )
}