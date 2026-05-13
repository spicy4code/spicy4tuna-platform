'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function NuevoEpisodioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    episode_number: '',
    type: 'semanal',
    title: '',
    description: '',
    published_at: '',
    url_youtube: '',
    url_spotify: '',
    url_ivoox: '',
    status: 'draft',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('episodes').insert([{
      ...form,
      episode_number: parseInt(form.episode_number),
    }])
    setLoading(false)
    if (!error) router.push('/admin/episodios')
    else alert('Error: ' + error.message)
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/episodios" className="text-white/30 hover:text-white transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-white">Nuevo episodio</h1>
          <p className="text-sm text-white/40 mt-0.5">Rellena la información del episodio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Número de episodio</label>
            <input name="episode_number" type="number" value={form.episode_number} onChange={handleChange} required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
              placeholder="Ej: 142" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Tipo</label>
            <select name="type" value={form.type} onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30">
              <option value="semanal">Semanal</option>
              <option value="extra_spicy">Extra Spicy</option>
              <option value="spicy_games">Spicy Games</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Título</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
            placeholder="Título del episodio" />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 resize-none"
            placeholder="Descripción breve del episodio" />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Fecha de publicación</label>
          <input name="published_at" type="date" value={form.published_at} onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
        </div>

        <div className="border-t border-white/8 pt-5">
          <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">Enlaces</p>
          <div className="space-y-3">
            {[
              { name: 'url_youtube', placeholder: 'URL de YouTube' },
              { name: 'url_spotify', placeholder: 'URL de Spotify' },
              { name: 'url_ivoox', placeholder: 'URL de Ivoox' },
            ].map(({ name, placeholder }) => (
              <input key={name} name={name} value={form[name as keyof typeof form]} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
                placeholder={placeholder} />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Estado</label>
          <select name="status" value={form.status} onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30">
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-white text-black text-sm font-medium px-5 py-2 rounded-lg hover:bg-white/90 transition-all disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar episodio'}
          </button>
          <Link href="/admin/episodios"
            className="text-sm text-white/40 hover:text-white px-5 py-2 rounded-lg border border-white/10 hover:border-white/30 transition-all">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}