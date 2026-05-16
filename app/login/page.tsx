'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setError('')

    if (isRegister) {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
    }

    const result = await signIn('credentials', {
      email, password, redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  async function handleGitHub() {
    await signIn('github', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent fixed top-0" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center shadow-lg shadow-[#C9A84C]/20">
            <span className="text-black font-black">✦</span>
          </div>
          <div>
            <p className="text-white font-bold tracking-widest uppercase">Clarity</p>
            <p className="text-[#C9A84C]/60 text-[10px] tracking-widest uppercase">AI Task Manager</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#0F0F0F] border border-white/8 rounded-2xl p-8">
          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 mb-8">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !isRegister
                  ? 'bg-[#C9A84C] text-black'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isRegister
                  ? 'bg-[#C9A84C] text-black'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Register
            </button>
          </div>

          <div className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#C9A84C]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-200"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/[0.03] border border-white/10 focus:border-[#C9A84C]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-white/[0.03] border border-white/10 focus:border-[#C9A84C]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-200"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#C9A84C] to-[#A8872A] hover:from-[#D4B85C] hover:to-[#C9A84C] text-black font-bold py-3 rounded-xl text-sm transition-all duration-300 disabled:opacity-40 shadow-lg shadow-[#C9A84C]/20 mt-2"
            >
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-white/20 text-xs">or</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <button
              onClick={handleGitHub}
              className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-medium py-3 rounded-xl transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Secured with NextAuth v5 · JWT Sessions
        </p>
      </div>
    </div>
  )
}