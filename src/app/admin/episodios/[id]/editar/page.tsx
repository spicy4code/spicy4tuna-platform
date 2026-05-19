'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const statusColors: Record<string, string> = {
  draft: 'text-white/30 bg-white/5',
  published: 'text-green-400 bg-green-400/10',
  archived: 'text-white/20 bg-white/5',
}

export default function EditarEpisodioPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [saved, setSaved] = useState(false)
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

  useEffect(() => {
    const fetchEpisode = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('id', params.id)
        .single()

     if (error || !data) {
  console.log('Error:', error, 'Data:', data)
  router.push('/admin/episodios')
  return
}

      setForm({
        episode_number: data.episode_number?.toString() ?? '',
        type: data.type ?? 'semanal',
        title: data.title ?? '',
        description: data.description ?? '',
        published_at: data.published_at ? data.published_at.split('T')[0] : '',
        url_youtube: data.url_youtube ?? '',
        url_spotify: data.url_spotify ?? '',
        url_ivoox: data.url_ivoox ?? '',
        status: data.status ?? 'draft',
      })
      setFetching(false)
    }

    fetchEpisode()
  }, [params.id, router])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setSaved(false)
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('episodes')
      .update({
        ...form,
        episode_number: parseInt(form.episode_number),
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    setLoading(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      alert('Error al guardar: ' + error.message)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Seguro que quieres eliminar este episodio? Esta accion no se puede deshacer.')) return
    const supabase = createClient()
    const { error } = await supabase.from('episodes').delete().eq('id', params.id)
    if (!error) router.push('/admin/episodios')
    else alert('Error al eliminar: ' + error.message)
  }

  if (fetching) {
    return (
      <div className="p-8 max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/5 rounded w-48" />
          <div className="h-4 bg-white/5 rounded w-32" />
          <div className="h-10 bg-white/5 rounded" />
          <div className="h-10 bg-white/5 rounded" />
          <div className="h-24 bg-white/5 rounded" />
        </div>
      </div>
    )
  }

  const typeLabel = form.type === 'semanal' ? 'S' : 'E'
  const epCode = `${typeLabel}${form.episode_number}`

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/episodios"
            className="text-white/30 hover:text-white transition-all mt-0.5"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-white">Editar episodio</h1>
              <span className="text-xs text-white/30 font-mono bg-white/5 px-2 py-0.5 rounded">
                {epCode}
              </span>
            </div>
            <p className="text-sm text-white/40 mt-0.5 truncate max-w-sm">{form.title}</p>
          </div>
        </div>

        {/* Links rapidos si hay URL de YouTube */}
        {form.url_youtube && (
          <a
            href={form.url_youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white transition-all border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg"
          >
            <ExternalLink size={12} />
            Ver en YouTube
          </a>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Numero y tipo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Numero de episodio</label>
            <input
              name="episode_number"
              type="number"
              value={form.episode_number}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
              placeholder="Ej: 142"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Tipo</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
            >
              <option value="semanal">Semanal</option>
              <option value="extra_spicy">Extra Spicy</option>
              <option value="spicy_games">Spicy Games</option>
            </select>
          </div>
        </div>

        {/* Titulo */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Titulo</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
            placeholder="Titulo del episodio"
          />
        </div>

        {/* Descripcion */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Descripcion</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 resize-none"
            placeholder="Descripcion breve del episodio"
          />
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Fecha de publicacion</label>
          <input
            name="published_at"
            type="date"
            value={form.published_at}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
          />
        </div>

        {/* URLs */}
        <div className="border-t border-white/8 pt-5">
          <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">Enlaces</p>
          <div className="space-y-3">
            {[
              { name: 'url_youtube', placeholder: 'URL de YouTube' },
              { name: 'url_spotify', placeholder: 'URL de Spotify' },
              { name: 'url_ivoox', placeholder: 'URL de Ivoox' },
            ].map(({ name, placeholder }) => (
              <input
                key={name}
                name={name}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
                placeholder={placeholder}
              />
            ))}
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Estado</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-2 border-t border-white/8">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black text-sm font-medium px-5 py-2 rounded-lg hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : saved ? 'Guardado!' : 'Guardar cambios'}
            </button>
            <Link
              href="/admin/episodios"
              className="text-sm text-white/40 hover:text-white px-5 py-2 rounded-lg border border-white/10 hover:border-white/30 transition-all"
            >
              Cancelar
            </Link>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 text-xs text-red-400/50 hover:text-red-400 transition-all"
          >
            <Trash2 size={13} />
            Eliminar episodio
          </button>
        </div>
      </form>
    </div>
  )
}