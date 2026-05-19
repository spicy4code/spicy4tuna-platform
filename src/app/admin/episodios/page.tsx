import { Plus, Mic2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const typeLabels: Record<string, string> = {
  semanal: 'Semanal',
  extra_spicy: 'Extra Spicy',
  spicy_games: 'Spicy Games',
}

const statusLabels: Record<string, { label: string; color: string }> = {
  sin_empezar: { label: 'Sin empezar', color: 'text-white/30 bg-white/5' },
  creado: { label: 'Creado', color: 'text-blue-400 bg-blue-400/10' },
  programado: { label: 'Programado', color: 'text-yellow-400 bg-yellow-400/10' },
  publicado: { label: 'Publicado', color: 'text-green-400 bg-green-400/10' },
  cancelado: { label: 'Cancelado', color: 'text-red-400/50 bg-red-400/5' },
}

export const revalidate = 0

export default async function EpisodiosPage() {
  const supabase = createClient()
  const { data: episodes } = await supabase
    .from('episodes')
    .select('*')
    .order('episode_number', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Episodios</h1>
          <p className="text-sm text-white/40 mt-1">Gestiona todos los episodios del podcast</p>
        </div>
        <Link
          href="/admin/episodios/nuevo"
          className="flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-all"
        >
          <Plus size={14} />
          Nuevo episodio
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {['Todos', 'Semanal', 'Extra Spicy', 'Spicy Games'].map((f) => (
          <button key={f} className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white/3 border border-white/8 rounded-xl">
        <div className="flex items-center gap-4 px-5 py-3 border-b border-white/8 text-xs text-white/30 uppercase tracking-wider">
          <span className="w-12">#</span>
          <span className="flex-1">Titulo</span>
          <span className="w-28">Tipo</span>
          <span className="w-28">Fecha</span>
          <span className="w-24">Estado</span>
        </div>

        {!episodes || episodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Mic2 size={28} className="text-white/10" />
            <p className="text-sm text-white/25">No hay episodios todavia</p>
            <Link href="/admin/episodios/nuevo" className="text-xs text-white/40 hover:text-white/70 underline transition-all">
              Crear el primer episodio
            </Link>
          </div>
        ) : (
          episodes.map((ep) => {
            const status = statusLabels[ep.status] || { label: ep.status, color: 'text-white/30 bg-white/5' }
            return (
              <Link
                key={ep.id}
                href={`/admin/episodios/${ep.id}/editar`}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-white/5 hover:bg-white/3 transition-all"
              >
                <span className="w-12 text-sm text-white/30">#{ep.episode_number}</span>
                <span className="flex-1 text-sm text-white truncate">{ep.title}</span>
                <span className="w-28 text-xs text-white/40">{typeLabels[ep.type] || ep.type}</span>
                <span className="w-28 text-xs text-white/40">
                  {ep.published_at ? new Date(ep.published_at).toLocaleDateString('es-ES') : '—'}
                </span>
                <span className={`w-24 text-xs px-2 py-0.5 rounded-full text-center ${status.color}`}>
                  {status.label}
                </span>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}