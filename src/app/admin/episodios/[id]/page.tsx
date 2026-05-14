import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const typeLabels: Record<string, string> = {
  semanal: 'Semanal',
  extra_spicy: 'Extra Spicy',
  spicy_games: 'Spicy Games',
}

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'Borrador', color: 'text-white/30 bg-white/5' },
  published: { label: 'Publicado', color: 'text-green-400 bg-green-400/10' },
  archived: { label: 'Archivado', color: 'text-white/20 bg-white/5' },
}

export default async function EpisodioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: ep } = await supabase
    .from('episodes')
    .select('*')
    .eq('id', id)
    .single()

  if (!ep) notFound()

  const status = statusLabels[ep.status] || statusLabels.draft

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/episodios" className="text-white/30 hover:text-white transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white">{ep.title}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-white/40 mt-0.5">
            #{ep.episode_number} · {typeLabels[ep.type] || ep.type}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {ep.description && (
          <div className="bg-white/3 border border-white/8 rounded-xl p-5">
            <h2 className="text-xs text-white/40 uppercase tracking-wider mb-2">Descripcion</h2>
            <p className="text-sm text-white/80">{ep.description}</p>
          </div>
        )}

        <div className="bg-white/3 border border-white/8 rounded-xl p-5">
          <h2 className="text-xs text-white/40 uppercase tracking-wider mb-4">Enlaces</h2>
          <div className="space-y-2">
            {[
              { label: 'YouTube', url: ep.url_youtube },
              { label: 'Spotify', url: ep.url_spotify },
              { label: 'Ivoox', url: ep.url_ivoox },
              { label: 'iTunes', url: ep.url_itunes },
            ].map(({ label, url }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-white/40">{label}</span>
                {url ? (
                  <a href={url} className="text-xs text-white/70 hover:text-white transition-all">
                    Ver enlace
                  </a>
                ) : (
                  <span className="text-xs text-white/20">No disponible</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
