import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ArrowLeft, Pencil, ExternalLink, Youtube, Music2, Mic2, Apple } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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

const platformLabels: Record<string, { label: string; color: string }> = {
  youtube: { label: 'YouTube', color: 'text-red-400' },
  instagram: { label: 'Instagram', color: 'text-pink-400' },
  tiktok: { label: 'TikTok', color: 'text-white/70' },
}

const clipTypeLabels: Record<string, string> = {
  horizontal: 'Clip',
  short: 'Short',
  reel: 'Reel',
  tiktok: 'TikTok',
}

function formatNumber(n: number | null | undefined): string {
  if (!n) return '—'
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

export const revalidate = 0

export default async function EpisodioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const [
    { data: ep },
    { data: clips },
    { data: metrics },
    { data: episodeSponsors },
  ] = await Promise.all([
    supabase.from('episodes').select('*').eq('id', id).single(),
    supabase.from('clips').select('*').eq('episode_id', id).order('published_at', { ascending: false }),
    supabase.from('episode_metrics').select('*').eq('episode_id', id).order('recorded_at', { ascending: false }),
    supabase.from('episode_sponsors').select('*, sponsors(*)').eq('episode_id', id),
  ])

  if (!ep) notFound()

  const status = statusLabels[ep.status] || { label: ep.status, color: 'text-white/30 bg-white/5' }

  const clipsList = clips?.filter(c => c.type === 'horizontal') || []
  const verticalsList = clips?.filter(c => c.type !== 'horizontal') || []

  // Ultima metrica por plataforma
  const metricsByPlatform: Record<string, typeof metrics[0]> = {}
  metrics?.forEach(m => {
    if (!metricsByPlatform[m.platform]) {
      metricsByPlatform[m.platform] = m
    }
  })

  const enlaces = [
    { label: 'YouTube', url: ep.url_youtube, icon: Youtube },
    { label: 'Spotify', url: ep.url_spotify, icon: Music2 },
    { label: 'Ivoox', url: ep.url_ivoox, icon: Mic2 },
    { label: 'iTunes', url: ep.url_itunes, icon: Apple },
  ]

  const typeLabel = ep.type === 'semanal' ? 'S' : 'E'
  const epCode = `${typeLabel}${ep.episode_number}`

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-3">
          <Link href="/admin/episodios" className="text-white/30 hover:text-white transition-all mt-1">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-white/30 font-mono bg-white/5 px-2 py-0.5 rounded">{epCode}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
              <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded">{typeLabels[ep.type] || ep.type}</span>
            </div>
            <h1 className="text-xl font-semibold text-white leading-snug max-w-2xl">{ep.title}</h1>
            {ep.published_at && (
              <p className="text-sm text-white/30 mt-1">
                {new Date(ep.published_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
        <Link
          href={`/admin/episodios/${id}/editar`}
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-all"
        >
          <Pencil size={12} />
          Editar
        </Link>
      </div>

      <div className="space-y-4">
        {/* Descripcion */}
        {ep.description && (
          <div className="bg-white/3 border border-white/8 rounded-xl p-5">
            <h2 className="text-xs text-white/30 uppercase tracking-wider mb-3">Descripcion</h2>
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{ep.description}</p>
          </div>
        )}

        {/* Metricas del episodio */}
        <div className="bg-white/3 border border-white/8 rounded-xl p-5">
          <h2 className="text-xs text-white/30 uppercase tracking-wider mb-4">Metricas</h2>
          {Object.keys(metricsByPlatform).length === 0 ? (
            <p className="text-xs text-white/20">Sin metricas registradas</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(metricsByPlatform).map(([platform, m]) => (
                <div key={platform}>
                  <p className="text-xs text-white/30 mb-2 capitalize">{platform}</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Visualizaciones', value: formatNumber(m.views) },
                      { label: 'Likes', value: formatNumber(m.likes) },
                      { label: 'Comentarios', value: formatNumber(m.comments) },
                      { label: 'Compartidos', value: formatNumber(m.shares) },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white/3 rounded-lg p-3">
                        <p className="text-xs text-white/30 mb-1">{label}</p>
                        <p className="text-lg font-semibold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enlaces */}
        <div className="bg-white/3 border border-white/8 rounded-xl p-5">
          <h2 className="text-xs text-white/30 uppercase tracking-wider mb-4">Distribucion</h2>
          <div className="grid grid-cols-2 gap-3">
            {enlaces.map(({ label, url, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between bg-white/3 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-white/30" />
                  <span className="text-sm text-white/60">{label}</span>
                </div>
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-all"
                  >
                    <ExternalLink size={11} />
                    Ver
                  </a>
                ) : (
                  <span className="text-xs text-white/20">No disponible</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sponsors */}
        <div className="bg-white/3 border border-white/8 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs text-white/30 uppercase tracking-wider">Sponsors</h2>
            <Link
              href={`/admin/episodios/${id}/editar#sponsors`}
              className="text-xs text-white/30 hover:text-white transition-all"
            >
              + Gestionar
            </Link>
          </div>
          {!episodeSponsors || episodeSponsors.length === 0 ? (
            <p className="text-xs text-white/20">Sin sponsors asignados</p>
          ) : (
            <div className="space-y-2">
              {episodeSponsors.map((es: any) => (
                <div key={es.id} className="flex items-center justify-between bg-white/3 rounded-lg px-4 py-3">
                  <span className="text-sm text-white/70">{es.sponsors?.name}</span>
                  {es.sponsors?.url && (
                    <a href={es.sponsors.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-white/30 hover:text-white transition-all">
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clips horizontales */}
        <div className="bg-white/3 border border-white/8 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs text-white/30 uppercase tracking-wider">Clips</h2>
              <p className="text-xs text-white/20 mt-0.5">Videos largos extraidos del episodio en YouTube</p>
            </div>
            <span className="text-xs text-white/20">{clipsList.length} clips</span>
          </div>
          {clipsList.length === 0 ? (
            <p className="text-xs text-white/20">Sin clips asociados</p>
          ) : (
            <div className="space-y-2">
              {clipsList.map((clip) => (
                <div key={clip.id} className="flex items-center gap-4 bg-white/3 rounded-lg px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{clip.title}</p>
                    {clip.published_at && (
                      <p className="text-xs text-white/30 mt-0.5">
                        {new Date(clip.published_at).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/40 shrink-0">
                    <span>{formatNumber(clip.views)} views</span>
                    <span>{formatNumber(clip.likes)} likes</span>
                    {clip.url && (
                      <a href={clip.url} target="_blank" rel="noopener noreferrer"
                        className="text-white/30 hover:text-white transition-all">
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verticales */}
        <div className="bg-white/3 border border-white/8 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs text-white/30 uppercase tracking-wider">Verticales</h2>
              <p className="text-xs text-white/20 mt-0.5">Shorts, Reels y TikToks extraidos del episodio</p>
            </div>
            <span className="text-xs text-white/20">{verticalsList.length} verticales</span>
          </div>
          {verticalsList.length === 0 ? (
            <p className="text-xs text-white/20">Sin verticales asociados</p>
          ) : (
            <div className="space-y-2">
              {verticalsList.map((clip) => (
                <div key={clip.id} className="flex items-center gap-4 bg-white/3 rounded-lg px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    platformLabels[clip.platform]?.color || 'text-white/40'
                  } bg-white/5`}>
                    {clipTypeLabels[clip.type] || clip.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{clip.title}</p>
                    {clip.published_at && (
                      <p className="text-xs text-white/30 mt-0.5">
                        {new Date(clip.published_at).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/40 shrink-0">
                    <span>{formatNumber(clip.views)} views</span>
                    <span>{formatNumber(clip.likes)} likes</span>
                    {clip.url && (
                      <a href={clip.url} target="_blank" rel="noopener noreferrer"
                        className="text-white/30 hover:text-white transition-all">
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}