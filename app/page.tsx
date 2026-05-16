'use client'

import { useState, useEffect } from 'react'

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
    setTodos(data)
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
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Gold top border line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-6 max-w-6xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center shadow-lg shadow-[#C9A84C]/20">
            <span className="text-black text-xs font-black">✦</span>
          </div>
          <div>
            <p className="text-white font-bold tracking-widest text-sm uppercase">Clarity</p>
            <p className="text-[#C9A84C]/60 text-[10px] tracking-widest uppercase">AI Task Manager</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-white/30 text-[11px] uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
            <p className="text-white/60 text-xs">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-xs px-4 py-2 rounded-full font-medium tracking-wide">
            {todos.length} Tasks
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-10 py-10">

        {/* Page Title */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
            Your Command <span className="text-[#C9A84C]">Center</span>
          </h2>
          <p className="text-white/30 text-sm mt-2 tracking-wide">
            Plan with intention. Execute with precision.
          </p>
        </div>

        {/* AI Section — Full Width Hero */}
        <div className="relative rounded-2xl overflow-hidden mb-8 border border-[#C9A84C]/20">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F0F] via-[#111008] to-[#0A0800]" />
          {/* Glow effects */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A84C] opacity-5 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-60 h-40 bg-[#C9A84C] opacity-5 blur-3xl rounded-full" />
          {/* Gold corner accent */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#C9A84C]/40 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#C9A84C]/40 rounded-br-2xl" />

          <div className="relative z-10 p-8">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-pulse" />
                  <span className="text-[#C9A84C] text-[11px] font-semibold uppercase tracking-[0.2em]">
                    AI Generation
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Describe your goal
                </h3>
                <p className="text-white/30 text-sm mb-6">
                  Llama 3.3 · 70B will craft 5 precise tasks from your intent.
                </p>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. I want to build and launch my portfolio website this weekend..."
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/10 hover:border-[#C9A84C]/30 focus:border-[#C9A84C]/50 rounded-xl px-5 py-4 text-sm text-white/80 placeholder:text-white/20 outline-none resize-none transition-all duration-300 leading-relaxed"
                />

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white/25 text-xs tracking-wide">Groq · Llama 3.3 70B Versatile</span>
                  </div>
                  <button
                    onClick={generateWithAI}
                    disabled={aiLoading || !prompt.trim()}
                    className="relative group flex items-center gap-2.5 bg-gradient-to-r from-[#C9A84C] to-[#A8872A] hover:from-[#D4B85C] hover:to-[#C9A84C] text-black text-sm px-6 py-3 rounded-xl font-bold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#C9A84C]/20 hover:shadow-[#C9A84C]/40"
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
            <div className="bg-[#0F0F0F] border border-white/8 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-4 bg-[#C9A84C] rounded-full" />
                <h3 className="text-sm font-semibold text-white tracking-wide">Quick Add</h3>
              </div>

              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Type a task..."
                rows={4}
                className="w-full bg-white/[0.03] border border-white/8 hover:border-[#C9A84C]/20 focus:border-[#C9A84C]/40 rounded-xl px-4 py-3 text-sm text-white/70 placeholder:text-white/15 outline-none resize-none transition-all duration-300"
              />

              <button
                onClick={addTodo}
                disabled={loading || !title.trim()}
                className="w-full mt-3 border border-[#C9A84C]/40 hover:border-[#C9A84C] hover:bg-[#C9A84C]/5 text-[#C9A84C] text-sm py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-30 tracking-wide"
              >
                {loading ? 'Adding...' : '+ Add Task'}
              </button>

              {/* Stats */}
              <div className="mt-6 pt-5 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/30 text-xs uppercase tracking-widest">Total</span>
                  <span className="text-white font-bold">{todos.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/30 text-xs uppercase tracking-widest">Pending</span>
                  <span className="text-[#C9A84C] font-bold">{todos.filter(t => !t.done).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/30 text-xs uppercase tracking-widest">Done</span>
                  <span className="text-emerald-400 font-bold">{todos.filter(t => t.done).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="col-span-2">
            {todos.length === 0 ? (
              <div className="bg-[#0F0F0F] border border-white/8 rounded-2xl flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4 opacity-40">✦</div>
                <p className="text-white/50 font-medium mb-1">No tasks yet</p>
                <p className="text-white/20 text-sm">Generate with AI or add one manually</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todos.map((todo, i) => (
                  <div
                    key={todo.id}
                    className="group flex items-start gap-4 bg-[#0F0F0F] border border-white/8 hover:border-[#C9A84C]/30 rounded-2xl px-5 py-4 transition-all duration-300 hover:bg-[#111008]"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="w-5 h-5 rounded-full border border-white/20 mt-0.5 flex-shrink-0 group-hover:border-[#C9A84C]/60 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm leading-relaxed group-hover:text-white transition-colors duration-200">
                        {todo.title}
                      </p>
                      <p className="text-white/20 text-[11px] mt-1.5 tracking-wide">
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
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 flex items-center justify-center text-white/30 hover:text-red-400 transition-all duration-200 flex-shrink-0 text-base"
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
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent mt-10" />
    </div>
  )
}