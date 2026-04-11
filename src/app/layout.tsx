'use client'
import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/',           label: 'Dashboard' },
  { href: '/upload',     label: 'Upload Roster' },
  { href: '/roster',     label: 'Master Roster' },
  { href: '/rooms',      label: 'Room Rosters' },
  { href: '/tracker',    label: 'ESOL Tracker' },
  { href: '/ese',        label: 'ESE & 504' },
  { href: '/compliance', label: 'Compliance' },
  { href: '/teachers',   label: 'Teacher Sheets' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <html lang="en">
      <body>
        <header className="no-print sticky top-0 z-50 border-b border-blue-900/40" style={{ background: '#0D1821' }}>
          <div className="flex items-center justify-between px-6 py-3">
            <div>
              <h1 className="text-base font-semibold text-white tracking-tight">
                SFEC Testing Roster
              </h1>
              <p className="text-xs text-blue-400 font-mono">Biology · May 15 · 194 students</p>
            </div>
            <nav className="flex gap-1 flex-wrap">
              {nav.map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    pathname === n.href
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-300 hover:bg-blue-900/40 hover:text-white'
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  )
}
