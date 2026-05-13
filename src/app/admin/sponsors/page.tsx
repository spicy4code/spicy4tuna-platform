import { Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const typeLabels: Record<string, { label: string; color: string }> = {
  sponsor: { label: 'Sponsor', color: 'text-blue-400 bg-blue-400/10' },
  afiliado: { label: 'Afiliado', color: 'text-purple-400 bg-purple-400/10' },
  media4equity: { label: 'Media4Equity', color: 'text-amber-400 bg-amber-400/10' },
}

export const revalidate = 0

export default async function SponsorsPage() {
  const supabase = createClient()
  const { data: sponsors } = await supabase
    .from('sponsors')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Sponsors</h1>
          <p className="text-sm text-white/40 mt-1">Sponsors, afiliados y media4equity</p>
        </div>
        <Link
          href="/admin/sponsors/nuevo"
          className="flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-all"
        >
          <Plus size={14} />
          Nuevo sponsor
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {['Todos', 'Sponsors', 'Afiliados', 'Media4Equity'].map((f) => (
          <button key={f} className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white/3 border border-white/8 rounded-xl">
        <div className="flex items-center gap-4 px-5 py-3 border-b border-white/8 text-xs text-white/30 uppercase tracking-wider">
          <span className="flex-1">Nombre</span>
          <span className="w-32">Tipo</span>
          <span className="w-32">Deal hasta</span>
          <span className="w-24">Estado</span>
        </div>

        {!sponsors || sponsors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Users size={28} className="text-white/10" />
            <p className="text-sm text-white/25">No hay sponsors todavía</p>
            <Link href="/admin/sponsors/nuevo" className="text-xs text-white/40 hover:text-white/70 underline transition-all">
              Añadir el primer sponsor
            </Link>
          </div>
        ) : (
          sponsors.map((sp) => {
            const type = typeLabels[sp.type] || typeLabels.sponsor
            return (
              <Link
                key={sp.id}
                href={`/admin/sponsors/${sp.id}`}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-white/5 hover:bg-white/3 transition-all"
              >
                <span className="flex-1 text-sm text-white">{sp.name}</span>
                <span className={`w-32 text-xs px-2 py-0.5 rounded-full text-center ${type.color}`}>
                  {type.label}
                </span>
                <span className="w-32 text-xs text-white/40">
                  {sp.deal_end ? new Date(sp.deal_end).toLocaleDateString('es-ES') : '—'}
                </span>
                <span className={`w-24 text-xs px-2 py-0.5 rounded-full text-center ${sp.is_active ? 'text-green-400 bg-green-400/10' : 'text-white/30 bg-white/5'}`}>
                  {sp.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}