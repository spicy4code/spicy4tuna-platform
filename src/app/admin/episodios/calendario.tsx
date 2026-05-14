'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
const statusConfig: Record<string, { label: string; dot: string }> = {
  sin_empezar: { label: 'Sin empezar', dot: 'bg-white/30' },
  creado: { label: 'Creado', dot: 'bg-amber-500' },
  programado: { label: 'Programado', dot: 'bg-blue-500' },
  publicado: { label: 'Publicado', dot: 'bg-green-500' },
  cancelado: { label: 'Cancelado', dot: 'bg-red-500' },
}

const typeConfig: Record<string, { color: string }> = {
  semanal: { color: 'text-blue-400' },
  extra_spicy: { color: 'text-orange-400' },
  spicy_games: { color: 'text-purple-400' },
}

interface Episode {
  id: string
  title: string
  episode_number: string
  type: string
  status: string
  published_at: string | null
}
export default function Calendario({ episodes }: { episodes: Episode[] }) {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  let startDow = firstDay.getDay()
  if (startDow === 0) startDow = 7
  const blanksStart = startDow - 1
  const totalDays = lastDay.getDate()
  const totalCells = Math.ceil((blanksStart + totalDays) / 7) * 7

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - blanksStart + 1
    if (dayNum < 1 || dayNum > totalDays) return null
    return dayNum
  })

  const episodesByDay: Record<number, Episode[]> = {}
  episodes.forEach(ep => {
    if (!ep.published_at) return
    const epDate = new Date(ep.published_at)
    if (epDate.getFullYear() === year && epDate.getMonth() === month) {
      const day = epDate.getDate()
      if (!episodesByDay[day]) episodesByDay[day] = []
      episodesByDay[day].push(ep)
    }
  })

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-white capitalize">{monthName}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="text-xs text-white/40 hover:text-white px-2 py-1 rounded border border-white/10 transition-all"
          >
            Hoy
          </button>
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1 text-white/40 hover:text-white">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1 text-white/40 hover:text-white">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(d => (
          <div key={d} className="text-xs text-white/25 text-center py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l border-t border-white/8">
        {cells.map((day, i) => (
          <div key={i} className="min-h-28 border-r border-b border-white/8 p-1.5">
            {day && (
              <>
                <div className={`text-xs mb-1.5 w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday(day) ? 'bg-white text-black font-semibold' : 'text-white/30'
                }`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {(episodesByDay[day] || []).map(ep => {
                    const status = statusConfig[ep.status] || statusConfig.sin_empezar
                    const type = typeConfig[ep.type] || typeConfig.semanal
                    return (
                      <Link
                        key={ep.id}
                        href={`/admin/episodios/${ep.id}`}
                        className="block bg-white/5 border border-white/8 rounded p-1.5 hover:border-white/20 transition-all"
                      >
                        <p className={`text-xs font-medium truncate ${type.color}`}>
                          {ep.title}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`} />
                          <span className="text-xs text-white/30 truncate">{status.label}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}