import type { Metadata } from 'next'
import Link from 'next/link'
import { LayoutDashboard, Mic2, Users, Scissors, BarChart2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Spicy4tuna · Admin',
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/episodios', label: 'Episodios', icon: Mic2 },
  { href: '/admin/sponsors', label: 'Sponsors', icon: Users },
  { href: '/admin/clips', label: 'Clips', icon: Scissors },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/8 flex flex-col">
        <div className="px-5 py-6 border-b border-white/8">
          <span className="text-sm font-semibold tracking-widest text-white/40 uppercase">Spicy4tuna</span>
          <p className="text-xs text-white/25 mt-0.5">Panel de gestión</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/8">
          <p className="text-xs text-white/20">v0.1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}