import { Plus, Scissors } from 'lucide-react'
import Link from 'next/link'

export default function ClipsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Clips</h1>
          <p className="text-sm text-white/40 mt-1">Gestiona clips, shorts, reels y tiktoks</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-all">
          <Plus size={14} />
          Nuevo clip
        </button>
      </div>
      <div className="bg-white/3 border border-white/8 rounded-xl">
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Scissors size={28} className="text-white/10" />
          <p className="text-sm text-white/25">No hay clips todavía</p>
        </div>
      </div>
    </div>
  )
}