'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function NuevoSponsorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'sponsor',
    website: '',
    contact_name: '',
    contact_email: '',
    deal_start: '',
    deal_end: '',
    fee_structure: 'fixed',
    fee_per_episode: '',
    total_mentions_agreed: '',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('sponsors').insert([{
      ...form,
      fee_per_episode: form.fee_per_episode ? parseFloat(form.fee_per_episode) : null,
      total_mentions_agreed: form.total_mentions_agreed ? parseInt(form.total_mentions_agreed) : null,
      deal_start: form.deal_start || null,
      deal_end: form.deal_end || null,
    }])
    setLoading(false)
    if (!error) router.push('/admin/sponsors')
    else alert('Error: ' + error.message)
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/sponsors" className="text-white/30 hover:text-white transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-white">Nuevo sponsor</h1>
          <p className="text-sm text-white/40 mt-0.5">Añade un sponsor, afiliado o media4equity</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Nombre</label>
            <input name="name" value={form.name} onChange={handleChange} required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
              placeholder="Nombre de la empresa" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Tipo</label>
            <select name="type" value={form.type} onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30">
              <option value="sponsor">Sponsor</option>
              <option value="afiliado">Afiliado</option>
              <option value="media4equity">Media4Equity</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Web</label>
          <input name="website" value={form.website} onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
            placeholder="https://empresa.com" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Contacto</label>
            <input name="contact_name" value={form.contact_name} onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
              placeholder="Nombre del contacto" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Email contacto</label>
            <input name="contact_email" type="email" value={form.contact_email} onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
              placeholder="contacto@empresa.com" />
          </div>
        </div>

        <div className="border-t border-white/8 pt-5">
          <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">Deal</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Inicio del deal</label>
              <input name="deal_start" type="date" value={form.deal_start} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Fin del deal</label>
              <input name="deal_end" type="date" value={form.deal_end} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Estructura de pago</label>
              <select name="fee_structure" value={form.fee_structure} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30">
                <option value="fixed">Fijo</option>
                <option value="fixed_variable">Fijo + Variable</option>
                <option value="variable_only">Solo variable</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Fee por episodio (€)</label>
              <input name="fee_per_episode" type="number" value={form.fee_per_episode} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
                placeholder="0.00" />
            </div>
          </div>
        </div>

        {form.type === 'media4equity' && (
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Menciones acordadas por contrato</label>
            <input name="total_mentions_agreed" type="number" value={form.total_mentions_agreed} onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
              placeholder="Nº de menciones acordadas" />
          </div>
        )}

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Notas internas</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 resize-none"
            placeholder="Notas privadas sobre este sponsor..." />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-white text-black text-sm font-medium px-5 py-2 rounded-lg hover:bg-white/90 transition-all disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar sponsor'}
          </button>
          <Link href="/admin/sponsors"
            className="text-sm text-white/40 hover:text-white px-5 py-2 rounded-lg border border-white/10 hover:border-white/30 transition-all">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}