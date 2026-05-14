import { Plus, LayoutGrid, List, Calendar } from 'lucide-react'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Calendario from './calendario'

const typeConfig: Record<string, { label: string; color: string }> = {
  semanal: { label: 'Semanal', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  extra_spicy: { label: 'Extra Spicy', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  spicy_games: { label: 'Spicy Games', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
}

const statusConfig: Record<string, { label: string; color: string }> = {
  sin_empezar: { label: 'Sin empezar', color: 'text-white/30 bg-white/5' },
  creado: { label: 'Creado', color: 'text-amber-400 bg-amber-400/10' },
  programado: { label: 'Programado', color: 'text-blue-400 bg-blue-400/10' },
  publicado: { label: 'Publicado', color: 'text-green-400 bg-green-400/10' },
  cancelado: { label: 'Cancelado', color: 'text-red-400 bg-red-400/10' },
}

export const revalidate = 0

export default async function EpisodiosPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; vista?: string }>
}) {
  const { tipo, vista = 'grid' } = await searchParams
  const supabase = await createServerSupabaseClient()

  const { data: episodes } = await supabase
    .from('episodes')
    .select('*')
    .order('published_at', { ascending: false })

  const filtered = tipo && tipo !== 'todos'
    ? episodes?.filter(e => e.type === tipo)
    : episodes

  const counts = {
    todos: episodes?.length || 0,
    semanal: episodes?.filter(e => e.type === 'semanal').length || 0,
    extra_spicy: episodes?.filter(e => e.type === 'extra_spicy').length || 0,
    spicy_games: episodes?.filter(e => e.type === 'spicy_games').length || 0,
  }

  const tipoParam = tipo ? `&tipo=${tipo}` : ''

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Episodios</h1>
          <p className="text-sm text-white/40 mt-1">{filtered?.length || 0} episodios</p>
        </div>
        <Link
          href="/admin/episodios/nuevo"
          className="flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-all"
        >
          <Plus size={14} />
          Nuevo episodio
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'todos', label: `Todos (${counts.todos})` },
            { key: 'semanal', label: `Semanal (${counts.semanal})` },
            { key: 'extra_spicy', label: `Extra Spicy (${counts.extra_spicy})` },
            { key: 'spicy_games', label: `Spicy Games (${counts.spicy_games})` },
          ].map(({ key, label }) => (
            <Link
              key={key}
              href={`/admin/episodios?tipo=${key}&vista=${vista}`}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                (tipo === key || (!tipo && key === 'todos'))
                  ? 'bg-white text-black border-white'
                  : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
          {[
            { key: 'grid', icon: LayoutGrid },
            { key: 'list', icon: List },
            { key: 'calendar', icon: Calendar },
          ].map(({ key, icon: Icon }) => (
            <Link
              key={key}
              href={`/admin/episodios?vista=${key}${tipoParam}`}
              className={`p-1.5 rounded-md transition-all ${
                vista === key ? 'bg-white text-black' : 'text-white/40 hover:text-white'
              }`}
            >
              <Icon size={14} />
            </Link>
          ))}
        </div>
      </div>

      {vista === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((ep) => {
            const type = typeConfig[ep.type] || typeConfig.semanal
            return (
              <Link
                key={ep.id}
                href={`/admin/episodios/${ep.id}`}
                className="bg-white/3 border border-white/8 rounded-xl overflow-hidden hover:border-white/20 transition-all group"
              >
                {ep.thumbnail_url ? (
                  <img src={ep.thumbnail_url} alt={ep.title} className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 transition-all" />
                ) : (
                  <div className="w-full aspect-video bg-white/5 flex items-center justify-center">
                    <span className="text-white/20 text-sm">Sin miniatura</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${type.color}`}>{type.label}</span>
                    <span className="text-xs text-white/30">{ep.episode_number}</span>
                  </div>
                  <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug">{ep.title}</h3>
                  {ep.published_at && (
                    <p className="text-xs text-white/30 mt-2">
                      {new Date(ep.published_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {vista === 'list' && (
        <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 px-5 py-3 border-b border-white/8 text-xs text-white/30 uppercase tracking-wider">
            <span className="w-16">Num</span>
            <span className="w-24">Tipo</span>
            <span className="flex-1">Titulo</span>
            <span className="w-28">Estado</span>
            <span className="w-28">Fecha</span>
          </div>
          {filtered?.map((ep) => {
            const type = typeConfig[ep.type] || typeConfig.semanal
            const status = statusConfig[ep.status] || statusConfig.sin_empezar
            return (
              <Link
                key={ep.id}
                href={`/admin/episodios/${ep.id}`}
                className="flex items-center gap-4 px-5 py-3 border-b border-white/5 hover:bg-white/3 transition-all"
              >
                <span className="w-16 text-xs text-white/30 font-mono">{ep.episode_number}</span>
                <span className={`w-24 text-xs px-2 py-0.5 rounded-full border text-center ${type.color}`}>{type.label}</span>
                <span className="flex-1 text-sm text-white truncate">{ep.title}</span>
                <span className={`w-28 text-xs px-2 py-0.5 rounded-full text-center ${status.color}`}>{status.label}</span>
                <span className="w-28 text-xs text-white/30">
                  {ep.published_at ? new Date(ep.published_at).toLocaleDateString('es-ES') : '-'}
                </span>
              </Link>
            )
          })}
        </div>
      )}

      {vista === 'calendar' && (
        <Calendario episodes={filtered || []} />
      )}
    </div>
  )
}