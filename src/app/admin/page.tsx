import { Mic2, Users, Scissors, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Episodios', value: '0', icon: Mic2, desc: 'publicados' },
  { label: 'Sponsors', value: '0', icon: Users, desc: 'activos' },
  { label: 'Clips', value: '0', icon: Scissors, desc: 'publicados' },
  { label: 'Visualizaciones', value: '0', icon: TrendingUp, desc: 'este mes' },
]

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Bienvenido al panel de gestión de Spicy4tuna</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, desc }) => (
          <div key={label} className="bg-white/3 border border-white/8 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
              <Icon size={14} className="text-white/20" />
            </div>
            <p className="text-2xl font-semibold text-white">{value}</p>
            <p className="text-xs text-white/30 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/3 border border-white/8 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white/60 mb-4">Últimos episodios</h2>
          <p className="text-sm text-white/25 text-center py-8">No hay episodios todavía</p>
        </div>
        <div className="bg-white/3 border border-white/8 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white/60 mb-4">Sponsors activos</h2>
          <p className="text-sm text-white/25 text-center py-8">No hay sponsors todavía</p>
        </div>
      </div>
    </div>
  )
}