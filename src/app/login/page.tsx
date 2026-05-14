'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    shouldCreateUser: true,
    emailRedirectTo: 'https://dev.spicy4tuna.com/auth/callback',
  }
})
    setLoading(false)
    if (error) setError('Email no encontrado.')
    else setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-full max-w-sm text-center space-y-4">
          <p className="text-sm text-white">Revisa tu email</p>
          <p className="text-xs text-white/40">Codigo enviado a {email}</p>
          <a href={'/login/verify?email=' + encodeURIComponent(email)}
            className="block w-full bg-white/5 border border-white/10 text-white text-sm py-2.5 rounded-lg text-center">
            Introducir codigo
          </a>
          <button onClick={() => setSent(false)} className="text-xs text-white/30">
            Usar otro email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-lg font-semibold text-white">Spicy4tuna</h1>
          <p className="text-sm text-white/40 mt-1">Panel de gestion</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black text-sm font-medium py-2.5 rounded-lg hover:bg-white/90 transition-all disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar codigo'}
          </button>
        </form>
      </div>
    </div>
  )
}