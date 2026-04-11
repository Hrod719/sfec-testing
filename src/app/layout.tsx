'use client'
import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/',           label: 'Dashboard' },
  { href: '/upload',     label: 'Upload' },
  { href: '/roster',     label: 'Roster' },
  { href: '/rooms',      label: 'Rooms' },
  { href: '/tracker',    label: 'ESOL' },
  { href: '/ese',        label: 'ESE & 504' },
  { href: '/compliance', label: 'Compliance' },
  { href: '/teachers',   label: 'Teachers' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname === '/' || pathname === '/dashboard'

  return (
    <html lang="en">
      <body>
        {/* Branded Nav — always visible, dashboard extends it */}
        <header className={`no-print sticky top-0 z-50 ${isDashboard ? '' : 'border-b-[3px] border-brand-gold'}`}
          style={{ background: 'linear-gradient(135deg, #1B2D4A, #243B5C)' }}>
          <div className="flex items-center justify-between px-5 py-2.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-gold rounded-lg flex items-center justify-center text-brand-navy font-black text-base">
                R
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">
                  Ronald Reagan Doral SHS
                </h1>
                <p className="text-[10px] text-header-muted">Testing Command Center</p>
              </div>
            </div>
            <nav className="flex gap-0.5">
              {nav.map(n => {
                const active = n.href === '/'
                  ? pathname === '/' || pathname === '/dashboard'
                  : pathname === n.href
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                      active
                        ? 'bg-brand-gold/15 text-brand-gold'
                        : 'text-header-muted hover:text-white'
                    }`}
                  >
                    {n.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </header>
        <main className={isDashboard ? '' : 'p-5'}>
          {children}
        </main>
      </body>
    </html>
  )
}
