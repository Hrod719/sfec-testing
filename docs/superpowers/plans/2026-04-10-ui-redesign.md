# UI Redesign — Executive Command Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the dark-theme student roster app into a Fortune 100-grade hybrid light/dark dashboard branded with Ronald Reagan Doral SHS Bison identity.

**Architecture:** Hybrid theme — dark branded navy header with gold accent (nav + hero stats on dashboard), light #F7F8FA content area with white cards. Recharts for compliance visualizations. All 8 routes restyled consistently. No data logic changes.

**Tech Stack:** Next.js 14, Tailwind CSS 3, Recharts, Supabase (unchanged)

**Design Spec:** `docs/superpowers/specs/2026-04-10-ui-redesign-design.md`

---

### Task 1: Install Recharts and Update Tailwind Config

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Install recharts**

Run: `npm install recharts`
Expected: recharts added to dependencies in package.json

- [ ] **Step 2: Update tailwind.config.ts with new color palette**

Replace entire `tailwind.config.ts` with:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        brand: {
          navy: '#1B2D4A',
          'navy-light': '#243B5C',
          'navy-deep': '#0F1D30',
          gold: '#C5A647',
          green: '#3B8C5E',
        },
        surface: {
          page: '#F7F8FA',
          card: '#FFFFFF',
          stripe: '#FAFBFC',
          hover: '#F0F7FF',
          border: '#E5E8ED',
          'border-light': '#F0F2F5',
        },
        txt: {
          primary: '#1B2D4A',
          secondary: '#6B7A8D',
          tertiary: '#9CA3AF',
        },
        semantic: {
          error: '#DC2626',
          warning: '#EA580C',
          caution: '#D97706',
          success: '#16A34A',
          info: '#2563EB',
          purple: '#7C5CFC',
        },
        header: {
          muted: '#8BA4C4',
        },
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build completes (or only warns about unused classes, not errors)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json tailwind.config.ts
git commit -m "chore: install recharts and update tailwind color palette for redesign"
```

---

### Task 2: Rewrite Global Styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css**

Replace entire `src/app/globals.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #F7F8FA;
  color: #1B2D4A;
  min-height: 100vh;
}

.font-mono { font-family: 'JetBrains Mono', monospace; }

/* ===== Table Styles (Light Theme) ===== */
.roster-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.roster-table th {
  padding: 8px 14px;
  background: #F8F9FB;
  color: #6B7A8D;
  font-size: 10px;
  font-weight: 700;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  border-bottom: 2px solid #E5E8ED;
}
.roster-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #F0F2F5;
  vertical-align: middle;
  color: #3A4A5C;
}
.roster-table tr:nth-child(even) td { background: #FAFBFC; }
.roster-table tr:hover td { background: #F0F7FF; }

/* Alert rows — missing data */
.roster-table tr.alert-row td {
  background: #FEF2F2 !important;
  border-bottom-color: #FECACA;
}
.roster-table tr.alert-row td:first-child {
  border-left: 3px solid #DC2626;
}
.roster-table tr.alert-row:hover td { background: #FEE2E2 !important; }

/* ===== Print Styles ===== */
@media print {
  body { background: white; color: #1B2D4A; font-size: 12px; }
  .no-print { display: none !important; }
  .print-break { page-break-before: always; }
  .roster-table th {
    background: #F8F9FB;
    color: #1B2D4A;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .roster-table tr:nth-child(even) td {
    background: #F8F9FB;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .roster-table tr.alert-row td {
    background: #FEF2F2 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  /* Preserve badge colors */
  .badge-print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

/* ===== Scrollbar ===== */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #F7F8FA; }
::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
```

- [ ] **Step 2: Verify dev server renders**

Run: `curl -s http://localhost:3000 | head -20`
Expected: HTML response (page loads without CSS errors)

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: rewrite global styles for light content theme"
```

---

### Task 3: Update Utility Functions for Light Theme Badges

**Files:**
- Modify: `src/lib/utils.ts`

- [ ] **Step 1: Update badge and status color functions**

In `src/lib/utils.ts`, replace the `esolStatusColor` function:

```typescript
export function esolStatusColor(status: EsolStatus): string {
  switch (status) {
    case 'no-exit-date':     return 'text-red-700 font-semibold'
    case 'past-exit':        return 'text-orange-700 font-semibold'
    case 'exiting-soon':     return 'text-amber-700 font-semibold'
    case 'exiting-quarter':  return 'text-yellow-700 font-semibold'
    case 'active':           return 'text-green-700'
    case 'not-esol':         return 'text-gray-400'
  }
}
```

Replace the `accommodationBadgeClass` function:

```typescript
export function accommodationBadgeClass(group: string): string {
  if (group.includes('ESOL') && group.includes('+')) return 'bg-amber-100 text-amber-800 badge-print'
  if (group.includes('ESOL')) return 'bg-blue-100 text-blue-800 badge-print'
  if (group.includes('504')) return 'bg-red-100 text-red-800 badge-print'
  if (group.includes('ESE')) return 'bg-violet-100 text-violet-800 badge-print'
  return 'bg-emerald-100 text-emerald-800 badge-print'
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/utils.ts
git commit -m "style: update badge colors for light theme"
```

---

### Task 4: Update Shared Components (StatCard, AccomBadge)

**Files:**
- Modify: `src/components/StatCard.tsx`
- Modify: `src/components/AccomBadge.tsx`

- [ ] **Step 1: Rewrite StatCard with two variants**

Replace entire `src/components/StatCard.tsx`:

```tsx
interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  color?: 'navy' | 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'gold' | 'default'
  variant?: 'light' | 'header'
}

const lightColorMap: Record<string, { border: string; value: string }> = {
  navy:    { border: 'border-t-brand-navy',    value: 'text-brand-navy' },
  blue:    { border: 'border-t-semantic-info',  value: 'text-semantic-info' },
  purple:  { border: 'border-t-semantic-purple',value: 'text-semantic-purple' },
  green:   { border: 'border-t-semantic-success',value: 'text-semantic-success' },
  red:     { border: 'border-t-semantic-error', value: 'text-semantic-error' },
  orange:  { border: 'border-t-semantic-warning',value: 'text-semantic-warning' },
  gold:    { border: 'border-t-brand-gold',    value: 'text-brand-gold' },
  default: { border: 'border-t-brand-navy',    value: 'text-brand-navy' },
}

const headerLabelColors: Record<string, string> = {
  navy: 'text-white/70',
  blue: 'text-blue-400',
  purple: 'text-violet-400',
  green: 'text-emerald-400',
  red: 'text-red-300',
  orange: 'text-orange-400',
  gold: 'text-brand-gold',
  default: 'text-header-muted',
}

const headerValueColors: Record<string, string> = {
  navy: 'text-white',
  blue: 'text-blue-400',
  purple: 'text-violet-400',
  green: 'text-emerald-400',
  red: 'text-red-400',
  orange: 'text-orange-400',
  gold: 'text-emerald-400',
  default: 'text-white',
}

export default function StatCard({ label, value, sub, color = 'default', variant = 'light' }: StatCardProps) {
  if (variant === 'header') {
    const isRed = color === 'red'
    return (
      <div className={`rounded-[10px] p-3.5 border ${
        isRed
          ? 'bg-red-500/10 border-red-500/25'
          : 'bg-white/[0.07] border-white/10'
      }`}>
        <p className={`text-[9px] uppercase tracking-[0.08em] font-medium mb-1 ${
          isRed ? 'text-red-300' : (headerLabelColors[color] || headerLabelColors.default)
        }`}>{label}</p>
        <p className={`text-[28px] font-extrabold font-mono leading-none ${
          isRed ? 'text-red-400' : (headerValueColors[color] || headerValueColors.default)
        }`}>{value}</p>
        {sub && <p className={`text-[9px] mt-1 ${isRed ? 'text-red-300/70' : 'text-[#5A7A9A]'}`}>{sub}</p>}
      </div>
    )
  }

  const colors = lightColorMap[color] || lightColorMap.default
  const isRed = color === 'red'
  return (
    <div className={`rounded-[10px] border border-surface-border p-3 border-t-[3px] ${colors.border} ${
      isRed ? 'bg-red-50' : 'bg-surface-card'
    }`}>
      <p className={`text-[9px] uppercase tracking-[0.06em] font-medium ${
        isRed ? 'text-red-700' : 'text-txt-secondary'
      }`}>{label}</p>
      <p className={`text-2xl font-extrabold font-mono ${colors.value}`}>{value}</p>
      {sub && <p className="text-[9px] text-txt-tertiary mt-0.5">{sub}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Update AccomBadge**

Replace entire `src/components/AccomBadge.tsx`:

```tsx
import { accommodationBadgeClass } from '@/lib/utils'

export default function AccomBadge({ group }: { group: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${accommodationBadgeClass(group)}`}>
      {group}
    </span>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/StatCard.tsx src/components/AccomBadge.tsx
git commit -m "style: update StatCard (header/light variants) and AccomBadge for redesign"
```

---

### Task 5: Rewrite Layout (Branded Header + Pill Nav)

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace layout.tsx**

Replace entire `src/app/layout.tsx`:

```tsx
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
```

Note: The dashboard page manages its own padding since the hero stats extend the header visually.

- [ ] **Step 2: Verify navigation renders**

Open http://localhost:3000 in browser. Confirm:
- Navy gradient header with gold "R" logo
- Pill-style nav links
- Gold bottom border
- Light page background below

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "style: rewrite layout with branded header and pill navigation"
```

---

### Task 6: Rewrite Dashboard Page

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Replace dashboard/page.tsx**

Replace entire `src/app/dashboard/page.tsx`:

```tsx
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { TestCycle, Student } from '@/types'
import StatCard from '@/components/StatCard'
import Link from 'next/link'

export default function DashboardPage() {
  const [cycles, setCycles] = useState<TestCycle[]>([])
  const [cycleId, setCycleId] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('test_cycles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data?.length) {
          setCycles(data)
          setCycleId(data[0].id)
        }
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!cycleId) return
    supabase
      .from('students')
      .select('*')
      .eq('cycle_id', cycleId)
      .then(({ data }) => setStudents(data ?? []))
  }, [cycleId])

  const cycle = cycles.find(c => c.id === cycleId)
  const esol = students.filter(s => s.esol_level)
  const ese = students.filter(s => s.ese_exceptionality)
  const standard = students.filter(s => !s.esol_level && !s.ese_exceptionality)
  const noExit = students.filter(s => s.esol_level && !s.esol_exit_date)
  const rooms = [...new Set(students.map(s => s.testing_room))].length
  const teachers = [...new Set(students.map(s => s.teacher_name))]
  const readiness = students.length > 0
    ? Math.round((students.length - noExit.length) / students.length * 100)
    : 100

  const quickLinks = [
    { href: '/rooms',      label: 'Room Rosters',    desc: `Print-ready sheets for ${rooms} rooms`, iconBg: 'bg-blue-50',    icon: '\u{1F3EB}' },
    { href: '/roster',     label: 'Master Roster',   desc: `All ${students.length} students, filterable`, iconBg: 'bg-green-50',   icon: '\u{1F4CB}' },
    { href: '/tracker',    label: 'ESOL Tracker',    desc: `${noExit.length} missing exit dates`, iconBg: 'bg-red-50',     icon: '\u{1F310}', alert: noExit.length > 0 },
    { href: '/ese',        label: 'ESE & 504',       desc: `${ese.length} students with accommodations`, iconBg: 'bg-violet-50',  icon: '\u267F' },
    { href: '/compliance', label: 'Compliance',      desc: 'Summary counts for admin reporting', iconBg: 'bg-orange-50',  icon: '\u{1F4CA}' },
    { href: '/teachers',   label: 'Teacher Sheets',  desc: 'Per-teacher communication sheets',   iconBg: 'bg-emerald-50', icon: '\u{1F4E7}' },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-txt-secondary font-mono text-sm">Loading...</p>
    </div>
  )

  if (!cycles.length) return (
    <div className="max-w-lg mx-auto text-center py-20">
      <p className="text-5xl mb-4">{'\u{1F4C2}'}</p>
      <h2 className="text-xl font-semibold text-txt-primary mb-2">No data yet</h2>
      <p className="text-txt-secondary text-sm mb-6">Upload your first roster CSV to get started.</p>
      <Link href="/upload" className="px-6 py-3 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white font-medium text-sm transition-colors">
        Upload Roster
      </Link>
    </div>
  )

  return (
    <div>
      {/* ===== EXTENDED HEADER: Cycle + Hero Stats ===== */}
      <div className="border-b-[3px] border-brand-gold"
        style={{ background: 'linear-gradient(135deg, #1B2D4A, #243B5C)' }}>
        <div className="px-5 pt-4 pb-5">
          {/* Cycle selector bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/[0.08] border border-white/[0.12] rounded-lg px-3.5 py-1.5 flex items-center gap-2">
              <span className="text-[10px] text-header-muted uppercase tracking-[0.06em]">Cycle</span>
              <select
                value={cycleId}
                onChange={e => setCycleId(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold outline-none cursor-pointer"
              >
                {cycles.map(c => (
                  <option key={c.id} value={c.id} className="bg-brand-navy text-white">{c.name}</option>
                ))}
              </select>
            </div>
            {cycle && (
              <span className="text-[11px] text-brand-gold font-medium">
                {cycle.test_date} &middot; {cycle.subject} &middot; {cycle.school_year}
              </span>
            )}
            <Link href="/upload" className="ml-auto text-[11px] text-header-muted hover:text-white border border-white/20 px-3 py-1.5 rounded-lg transition-colors">
              + Upload New Roster
            </Link>
          </div>

          {/* Hero stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <StatCard variant="header" label="Total Students" value={students.length} color="navy" sub={`across ${rooms} rooms`} />
            <StatCard variant="header" label="Test Readiness" value={`${readiness}%`} color="gold" sub={readiness >= 90 ? 'on track' : 'needs attention'} />
            <StatCard variant="header" label="ESOL" value={esol.length} color="blue" sub={`${Math.round(esol.length/Math.max(students.length,1)*100)}% of total`} />
            <StatCard variant="header" label="ESE / 504" value={ese.length} color="purple" sub={`${Math.round(ese.length/Math.max(students.length,1)*100)}% of total`} />
            <StatCard variant="header" label="Standard" value={standard.length} color="green" sub={`${Math.round(standard.length/Math.max(students.length,1)*100)}% of total`} />
            <StatCard variant="header" label="Flagged" value={noExit.length} color="red" sub="missing exit dates" />
          </div>
        </div>
      </div>

      {/* ===== LIGHT CONTENT AREA ===== */}
      <div className="p-5 space-y-4">
        {/* Alert banner */}
        {noExit.length > 0 && (
          <div className="bg-red-50 border border-red-200 border-l-4 border-l-semantic-error rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center text-semantic-error font-bold text-sm">!</div>
              <div>
                <p className="text-[13px] font-bold text-red-900">Compliance Alert</p>
                <p className="text-[11px] text-red-700">
                  {noExit.length} ESOL students have no exit date recorded. This must be resolved before test day.
                </p>
              </div>
            </div>
            <Link href="/tracker" className="bg-semantic-error text-white text-[10px] font-semibold px-3.5 py-1.5 rounded-md hover:bg-red-700 transition-colors whitespace-nowrap">
              Review ESOL Tracker
            </Link>
          </div>
        )}

        {/* Quick links grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {quickLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="bg-surface-card border border-surface-border rounded-[10px] p-3.5 flex items-start gap-3 hover:border-brand-gold transition-colors group"
            >
              <div className={`w-9 h-9 ${l.iconBg} rounded-lg flex items-center justify-center text-base flex-shrink-0`}>
                {l.icon}
              </div>
              <div>
                <p className="text-[13px] font-bold text-txt-primary group-hover:text-brand-navy">{l.label}</p>
                <p className={`text-[11px] mt-0.5 ${l.alert ? 'text-semantic-error font-semibold' : 'text-txt-secondary'}`}>{l.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Teacher summary table */}
        <div className="bg-surface-card border border-surface-border rounded-[10px] overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between">
            <p className="text-sm font-bold text-txt-primary">Teacher Summary</p>
            <p className="text-[10px] text-txt-secondary">{teachers.length} teachers</p>
          </div>
          <div className="overflow-x-auto">
            <table className="roster-table">
              <thead>
                <tr>
                  <th>Teacher</th><th>Room</th><th>Periods</th>
                  <th className="text-center">Students</th>
                  <th className="text-center text-semantic-info">ESOL</th>
                  <th className="text-center text-semantic-purple">ESE</th>
                  <th className="text-center text-semantic-success">Std</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(t => {
                  const ts = students.filter(s => s.teacher_name === t)
                  const periods = [...new Set(ts.map(s => s.period))].sort().join(', ')
                  const room = ts[0]?.class_room ?? '\u2014'
                  return (
                    <tr key={t}>
                      <td className="font-semibold text-txt-primary">{t}</td>
                      <td className="font-mono text-txt-secondary text-xs">{room}</td>
                      <td className="text-txt-secondary">{periods}</td>
                      <td className="font-mono text-center font-bold text-txt-primary">{ts.length}</td>
                      <td className="text-center text-semantic-info font-mono">{ts.filter(s=>s.esol_level).length || '\u2014'}</td>
                      <td className="text-center text-semantic-purple font-mono">{ts.filter(s=>s.ese_exceptionality).length || '\u2014'}</td>
                      <td className="text-center text-semantic-success font-mono">{ts.filter(s=>!s.esol_level&&!s.ese_exceptionality).length}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Test in browser**

Open http://localhost:3000. Verify:
- Extended dark header with cycle selector and 6 hero stat cards
- Gold bottom border below stats
- Light content area with alert banner, quick links, teacher table
- Nav pill for Dashboard is active (gold)

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "style: rewrite dashboard with executive command center layout"
```

---

### Task 7: Restyle Upload Page

**Files:**
- Modify: `src/app/upload/page.tsx`

- [ ] **Step 1: Update upload page styling**

In `src/app/upload/page.tsx`, make these replacements:

1. Replace the page title section (lines 145-148):
```tsx
<h2 className="text-xl font-extrabold text-txt-primary mb-1 tracking-tight">Upload Roster CSV</h2>
<p className="text-sm text-txt-secondary mb-6">
  Export from your SIS in the same column format. Uploading to an existing cycle replaces all students in that cycle.
</p>
```

2. Replace drop zone styling — change `border-blue-800` to `border-surface-border border-dashed`, background `style={{ background: '#131E2B' }}` to `style={{ background: '#FFFFFF' }}`, and text colors:
   - `text-white` → `text-txt-primary`
   - `text-xs text-slate-500` → `text-xs text-txt-tertiary`
   - `'Parsing...'` text color: `text-txt-secondary`

3. Replace all card backgrounds `style={{ background: '#131E2B' }}` → `className="bg-surface-card border border-surface-border"`

4. Replace all form inputs: `bg-slate-800 border border-slate-600 text-white` → `bg-surface-page border border-surface-border text-txt-primary`

5. Replace buttons: `bg-blue-700 hover:bg-blue-600 text-white` → `bg-brand-navy hover:bg-brand-navy-light text-white`

6. Replace secondary buttons: `border border-slate-600 text-slate-400 hover:text-white` → `border border-surface-border text-txt-secondary hover:text-txt-primary`

7. Replace progress bar colors: `bg-slate-700` → `bg-surface-border`, `bg-blue-500` → `bg-brand-navy`

8. Replace success state: `border-green-800/40` → `border-emerald-200`, green text → `text-emerald-700`

9. Replace error state: `border-red-800/40` → `border-red-200`, `text-red-400` → `text-semantic-error`

10. Replace all `text-slate-400` → `text-txt-secondary`, `text-white` → `text-txt-primary`, `text-green-400` → `text-semantic-success`

- [ ] **Step 2: Verify upload flow**

Open http://localhost:3000/upload. Confirm:
- White drop zone with dashed border
- Light form inputs
- Navy button styling

- [ ] **Step 3: Commit**

```bash
git add src/app/upload/page.tsx
git commit -m "style: restyle upload page for light theme"
```

---

### Task 8: Restyle Master Roster Page

**Files:**
- Modify: `src/app/roster/page.tsx`

- [ ] **Step 1: Update roster page styling**

In `src/app/roster/page.tsx`, make these changes:

1. Replace page title colors (line 74-75):
   - `text-white` → `text-txt-primary`
   - `text-slate-400` → `text-txt-secondary`

2. Replace cycle selector: `bg-slate-800 border border-slate-600 text-white` → `bg-surface-page border border-surface-border text-txt-primary`

3. Replace filter row (lines 87-125) — wrap all filters in a filter bar card:
   - Add wrapper: `<div className="bg-surface-card border border-surface-border rounded-[10px] p-2.5 mb-4 flex gap-2 flex-wrap items-center no-print">`
   - Search input: `bg-slate-800 border border-slate-600 text-white` → `bg-surface-page border border-surface-border text-txt-primary placeholder-txt-tertiary`
   - All selects: same replacement as search input
   - Clear button: `text-slate-400 hover:text-white border border-slate-700` → `text-txt-secondary hover:text-txt-primary border border-surface-border`

4. Replace table container (line 127-128):
   - `border border-blue-900/40` → `border border-surface-border`
   - Remove `style={{ background: '#0F1923' }}`
   - Add `bg-surface-card`

5. Replace Th component hover: `hover:text-blue-300` → `hover:text-brand-navy`

6. Replace table cell colors:
   - `text-white` → `text-txt-primary`
   - `text-slate-400` → `text-txt-secondary`
   - `text-slate-300` → `text-txt-secondary`
   - `text-blue-400` (ESOL level) → `text-semantic-info`

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000/roster. Confirm:
- White filter bar card with light inputs
- White table with proper alternating rows and hover
- Alert rows show red tint with left border
- Badges render in correct colors

- [ ] **Step 3: Commit**

```bash
git add src/app/roster/page.tsx
git commit -m "style: restyle master roster with light theme filter bar and table"
```

---

### Task 9: Restyle Room Rosters Page

**Files:**
- Modify: `src/app/rooms/page.tsx`

- [ ] **Step 1: Update rooms page styling**

In `src/app/rooms/page.tsx`:

1. Page title: `text-white` → `text-txt-primary`, `text-slate-400` → `text-txt-secondary`

2. Cycle selector and button: same light theme replacements as other pages

3. Print button: `bg-blue-700 hover:bg-blue-600` → `bg-brand-navy hover:bg-brand-navy-light`

4. Room card container: `border border-slate-700` → `border border-surface-border bg-surface-card`

5. Room header: keep the colored backgrounds from ROOM_COLORS (they still work)

6. Table area: remove `style={{ background: '#0F1923' }}`, replace with no background (inherits white from card)

7. Table cell colors: `text-slate-500` → `text-txt-tertiary`, `text-white` → `text-txt-primary`, `text-slate-300` → `text-txt-secondary`, `text-slate-400` → `text-txt-secondary`, `text-red-400` → `text-semantic-error`

- [ ] **Step 2: Verify in browser and print preview**

Open http://localhost:3000/rooms. Check room cards render with colored headers on white cards. Use Cmd+P to verify print layout.

- [ ] **Step 3: Commit**

```bash
git add src/app/rooms/page.tsx
git commit -m "style: restyle room rosters for light theme"
```

---

### Task 10: Restyle ESOL Tracker Page

**Files:**
- Modify: `src/app/tracker/page.tsx`

- [ ] **Step 1: Update tracker page styling**

In `src/app/tracker/page.tsx`:

1. Page title: `text-white` → `text-txt-primary`, `text-slate-400` → `text-txt-secondary`

2. Cycle selector: light theme input styling

3. Status pills (lines 71-84) — replace with light-theme pills:
```tsx
{[
  { key: 'no-exit-date', label: `No Exit Date (${counts.noExit})`, cls: 'bg-red-100 text-red-800 border-red-200' },
  { key: 'past-exit',    label: `Past Exit (${counts.past})`,       cls: 'bg-orange-100 text-orange-800 border-orange-200' },
  { key: 'exiting-soon', label: `Exiting Soon (${counts.soon})`,    cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  { key: 'exiting-quarter', label: `This Quarter (${counts.quarter})`, cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { key: 'active',       label: `Active (${counts.active})`,        cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
].map(s => (
  <button key={s.key}
    onClick={() => setFilterStatus(filterStatus === s.key ? '' : s.key)}
    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${s.cls} ${filterStatus === s.key ? 'ring-2 ring-brand-navy/30' : 'opacity-70 hover:opacity-100'}`}>
    {s.label}
  </button>
))}
```

4. Search and filter inputs: light theme styling

5. Table container: `border border-blue-900/40` → `border border-surface-border bg-surface-card rounded-[10px]`, remove dark background style

6. Table cell colors: all dark theme colors → light theme equivalents

7. Days until exit colors: `text-red-400` → `text-semantic-error`, `text-orange-400` → `text-semantic-warning`, `text-slate-300` → `text-txt-secondary`

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000/tracker. Confirm status pills, table, and alert rows render correctly.

- [ ] **Step 3: Commit**

```bash
git add src/app/tracker/page.tsx
git commit -m "style: restyle ESOL tracker for light theme"
```

---

### Task 11: Restyle ESE & 504 Page

**Files:**
- Modify: `src/app/ese/page.tsx`

- [ ] **Step 1: Update ESE page styling**

In `src/app/ese/page.tsx`:

1. Replace CODE_STYLES with light-theme versions:
```typescript
const CODE_STYLES: Record<string, string> = {
  'K':   'bg-indigo-100 text-indigo-800 border border-indigo-200',
  'J':   'bg-rose-100 text-rose-800 border border-rose-200',
  'V':   'bg-emerald-100 text-emerald-800 border border-emerald-200',
  'P':   'bg-amber-100 text-amber-800 border border-amber-200',
  '504': 'bg-violet-100 text-violet-800 border border-violet-200',
}
```

2. Page title, selectors, buttons: light theme styling

3. Status filter pills: `ring-white/20` → `ring-brand-navy/30`

4. Table container: remove dark background, add `bg-surface-card border border-surface-border rounded-[10px]`

5. Table cell colors: dark → light equivalents

6. Proctor notes input: `bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:border-blue-500` → `bg-surface-page border border-surface-border text-txt-primary placeholder-txt-tertiary focus:border-brand-navy`

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000/ese. Confirm filter pills, table, and note inputs render correctly.

- [ ] **Step 3: Commit**

```bash
git add src/app/ese/page.tsx
git commit -m "style: restyle ESE & 504 page for light theme"
```

---

### Task 12: Rewrite Compliance Page with Recharts

**Files:**
- Modify: `src/app/compliance/page.tsx`

- [ ] **Step 1: Replace compliance/page.tsx with Recharts version**

Replace entire `src/app/compliance/page.tsx`:

```tsx
'use client'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Student, TestCycle, LANGUAGE_MAP, ESE_MAP, TESTING_ROOMS } from '@/types'
import { enrichStudent } from '@/lib/utils'
import StatCard from '@/components/StatCard'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const ESOL_COLORS = ['#DBEAFE', '#C7D2FE', '#A5B4FC', '#818CF8', '#6366F1']
const ACCOM_COLORS = ['#2563EB', '#7C5CFC', '#16A34A']
const ROOM_BAR_COLORS = { standard: '#16A34A', esol: '#2563EB', ese: '#7C5CFC' }

export default function CompliancePage() {
  const [cycles, setCycles] = useState<TestCycle[]>([])
  const [cycleId, setCycleId] = useState('')
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    supabase.from('test_cycles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data?.length) { setCycles(data); setCycleId(data[0].id) } })
  }, [])

  useEffect(() => {
    if (!cycleId) return
    supabase.from('students').select('*').eq('cycle_id', cycleId)
      .then(({ data }) => setStudents(data ?? []))
  }, [cycleId])

  const enriched = useMemo(() => students.map(enrichStudent), [students])

  const esolTotal = enriched.filter(s => s.esol_level).length
  const eseTotal = enriched.filter(s => s.ese_exceptionality).length
  const stdTotal = enriched.filter(s => !s.esol_level && !s.ese_exceptionality).length
  const missingExit = enriched.filter(s => s.esolStatus === 'no-exit-date').length

  const esolByLevel = [1,2,3,4,5].map(lvl => ({
    name: `Level ${lvl}`,
    count: enriched.filter(s => s.esol_level === lvl).length,
    noExit: enriched.filter(s => s.esol_level === lvl && s.esolStatus === 'no-exit-date').length,
  })).filter(r => r.count > 0)

  const accomData = [
    { name: 'ESOL', value: esolTotal },
    { name: 'ESE/504', value: eseTotal },
    { name: 'Standard', value: stdTotal },
  ]

  const roomData = TESTING_ROOMS.map(room => {
    const rs = enriched.filter(s => s.testing_room.trim() === room)
    return {
      name: room.replace('Media Center ', 'MC '),
      standard: rs.filter(s => !s.esol_level && !s.ese_exceptionality).length,
      esol: rs.filter(s => s.esol_level).length,
      ese: rs.filter(s => s.ese_exceptionality).length,
      total: rs.length,
    }
  }).filter(r => r.total > 0)

  const eseByCode = Object.keys(ESE_MAP).map(code => ({
    code,
    desc: ESE_MAP[code],
    count: enriched.filter(s => s.ese_exceptionality === code).length,
  })).filter(r => r.count > 0)

  const langCounts = Object.entries(LANGUAGE_MAP).map(([code, name]) => ({
    code, name,
    count: enriched.filter(s => s.student_language === code).length,
    esol: enriched.filter(s => s.student_language === code && s.esol_level).length,
    ese: enriched.filter(s => s.student_language === code && s.ese_exceptionality).length,
  })).filter(r => r.count > 0).sort((a,b) => b.count - a.count)

  const teachers = [...new Set(students.map(s => s.teacher_name))]
  const teacherSummary = teachers.map(t => {
    const ts = enriched.filter(s => s.teacher_name === t)
    return {
      name: t,
      room: ts[0]?.class_room ?? '\u2014',
      periods: [...new Set(ts.map(s => s.period))].sort().join(', '),
      total: ts.length,
      esol: ts.filter(s => s.esol_level).length,
      ese: ts.filter(s => s.ese_exceptionality).length,
      standard: ts.filter(s => !s.esol_level && !s.ese_exceptionality).length,
      noExit: ts.filter(s => s.esolStatus === 'no-exit-date').length,
    }
  })

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-xl font-extrabold text-txt-primary tracking-tight">Compliance Report</h2>
          <p className="text-sm text-txt-secondary">Auto-calculated from roster data</p>
        </div>
        <div className="flex gap-3">
          <select value={cycleId} onChange={e => setCycleId(e.target.value)}
            className="rounded-lg bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2">
            {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white text-sm font-semibold transition-colors">
            Print Report
          </button>
        </div>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        <StatCard label="Total" value={enriched.length} color="navy" />
        <StatCard label="ESOL" value={esolTotal} color="blue" />
        <StatCard label="ESE / 504" value={eseTotal} color="purple" />
        <StatCard label="Standard" value={stdTotal} color="green" />
        <StatCard label="Missing Exit" value={missingExit} color="red" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* ESOL by Level Bar Chart */}
        <div className="bg-surface-card border border-surface-border rounded-[10px] p-4">
          <h3 className="text-sm font-bold text-txt-primary mb-3">ESOL Students by Level</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={esolByLevel} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7A8D' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7A8D' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E8ED', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]}>
                {esolByLevel.map((_, i) => (
                  <Cell key={i} fill={ESOL_COLORS[i % ESOL_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Accommodation Donut */}
        <div className="bg-surface-card border border-surface-border rounded-[10px] p-4">
          <h3 className="text-sm font-bold text-txt-primary mb-3">Accommodation Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={accomData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {accomData.map((_, i) => (
                  <Cell key={i} fill={ACCOM_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E8ED', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Room Distribution — Stacked Bar */}
      <div className="bg-surface-card border border-surface-border rounded-[10px] p-4">
        <h3 className="text-sm font-bold text-txt-primary mb-3">Students per Testing Room</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={roomData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7A8D' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#3A4A5C', fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E8ED', borderRadius: '8px', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="standard" name="Standard" stackId="a" fill={ROOM_BAR_COLORS.standard} radius={[0, 0, 0, 0]} />
            <Bar dataKey="esol" name="ESOL" stackId="a" fill={ROOM_BAR_COLORS.esol} />
            <Bar dataKey="ese" name="ESE/504" stackId="a" fill={ROOM_BAR_COLORS.ese} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ESE by Code table */}
      <div className="bg-surface-card border border-surface-border rounded-[10px] overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-border">
          <h3 className="text-sm font-bold text-txt-primary">ESE by Exceptionality</h3>
        </div>
        <table className="roster-table">
          <thead><tr><th>Code</th><th>Description</th><th className="text-center">Count</th><th className="text-center">% of ESE</th></tr></thead>
          <tbody>
            {eseByCode.map(r => (
              <tr key={r.code}>
                <td><span className="font-mono font-bold text-semantic-purple">{r.code}</span></td>
                <td className="text-txt-secondary">{r.desc}</td>
                <td className="text-center font-mono font-bold text-txt-primary">{r.count}</td>
                <td className="text-center text-txt-secondary">{eseTotal ? Math.round(r.count / eseTotal * 100) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Language Distribution */}
      <div className="bg-surface-card border border-surface-border rounded-[10px] overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-border">
          <h3 className="text-sm font-bold text-txt-primary">Home Language Distribution</h3>
        </div>
        <table className="roster-table">
          <thead><tr><th>Language</th><th>Code</th><th className="text-center">Count</th><th className="text-center">% Total</th><th className="text-center">ESOL</th><th className="text-center">ESE</th></tr></thead>
          <tbody>
            {langCounts.map(r => (
              <tr key={r.code}>
                <td className="font-semibold text-txt-primary">{r.name}</td>
                <td className="font-mono text-txt-secondary text-xs">{r.code}</td>
                <td className="text-center font-mono font-bold text-txt-primary">{r.count}</td>
                <td className="text-center text-txt-secondary">{enriched.length ? Math.round(r.count / enriched.length * 100) : 0}%</td>
                <td className="text-center text-semantic-info font-mono">{r.esol || '\u2014'}</td>
                <td className="text-center text-semantic-purple font-mono">{r.ese || '\u2014'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Teacher Summary */}
      <div className="bg-surface-card border border-surface-border rounded-[10px] overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-border">
          <h3 className="text-sm font-bold text-txt-primary">Teacher Roster Summary</h3>
        </div>
        <table className="roster-table">
          <thead>
            <tr>
              <th>Teacher</th><th>Room</th><th>Periods</th>
              <th className="text-center">Students</th>
              <th className="text-center text-semantic-info">ESOL</th>
              <th className="text-center text-semantic-purple">ESE</th>
              <th className="text-center text-semantic-success">Std</th>
              <th className="text-center">Missing Exit</th>
            </tr>
          </thead>
          <tbody>
            {teacherSummary.map(t => (
              <tr key={t.name}>
                <td className="font-semibold text-txt-primary">{t.name}</td>
                <td className="font-mono text-txt-secondary text-xs">{t.room}</td>
                <td className="text-txt-secondary">{t.periods}</td>
                <td className="font-mono text-center font-bold text-txt-primary">{t.total}</td>
                <td className="text-center text-semantic-info font-mono">{t.esol || '\u2014'}</td>
                <td className="text-center text-semantic-purple font-mono">{t.ese || '\u2014'}</td>
                <td className="text-center text-semantic-success font-mono">{t.standard}</td>
                <td className="text-center">
                  {t.noExit > 0
                    ? <span className="text-semantic-error font-bold">{t.noExit}</span>
                    : <span className="text-txt-tertiary">0</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000/compliance. Confirm:
- Bar chart for ESOL by level renders
- Donut chart for accommodation breakdown renders
- Stacked horizontal bars for room distribution
- All tables render in light theme

- [ ] **Step 3: Commit**

```bash
git add src/app/compliance/page.tsx
git commit -m "feat: rewrite compliance page with Recharts visualizations"
```

---

### Task 13: Restyle Teacher Sheets Page

**Files:**
- Modify: `src/app/teachers/page.tsx`

- [ ] **Step 1: Update teacher sheets styling**

In `src/app/teachers/page.tsx`:

1. Replace TEACHER_COLORS with light-theme colors:
```typescript
const TEACHER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'ALAMIE-OMU EBENEZER':  { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
  'LIMA ARIEL':           { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' },
  'PENA CARBALLO ILEANA': { bg: '#F5F3FF', border: '#DDD6FE', text: '#5B21B6' },
}
```

2. Page title: `text-white` → `text-txt-primary`, `text-slate-400` → `text-txt-secondary`

3. Cycle selector: light theme input

4. Print button: `bg-blue-700 hover:bg-blue-600` → `bg-brand-navy hover:bg-brand-navy-light`

5. Teacher filter tabs: `bg-blue-700 text-white border-blue-700` → `bg-brand-navy text-white border-brand-navy`, inactive: `text-slate-400 border-slate-700` → `text-txt-secondary border-surface-border`

6. Teacher card container: `border` → `border border-surface-border bg-surface-card rounded-[10px]`

7. Teacher header: use the light TEACHER_COLORS (pastel backgrounds)

8. Header text: `text-white` → use the `text` color from TEACHER_COLORS for the teacher name

9. Student table area: remove `style={{ background: '#0D1821' }}`, table inherits white card bg

10. Table cell colors: all dark → light equivalents
    - `text-white` → `text-txt-primary`
    - `text-slate-400` → `text-txt-secondary`
    - `text-blue-400` → `text-semantic-info`
    - `text-purple-400` → `text-semantic-purple`
    - `text-red-400` → `text-semantic-error`

11. Default fallback color for unknown teachers: `{ bg: '#F8F9FB', border: '#E5E8ED', text: '#1B2D4A' }`

- [ ] **Step 2: Verify in browser and print**

Open http://localhost:3000/teachers. Confirm teacher cards render with pastel headers. Check print preview.

- [ ] **Step 3: Commit**

```bash
git add src/app/teachers/page.tsx
git commit -m "style: restyle teacher sheets for light theme"
```

---

### Task 14: Final Verification and Polish

**Files:** All modified files

- [ ] **Step 1: Build check**

Run: `npx next build 2>&1 | tail -10`
Expected: Build succeeds without errors

- [ ] **Step 2: Full visual audit**

Open each page in browser and verify:
- http://localhost:3000 — Dashboard with hero stats
- http://localhost:3000/upload — Light upload flow
- http://localhost:3000/roster — Filter bar + table
- http://localhost:3000/rooms — Room cards
- http://localhost:3000/tracker — ESOL tracker with status pills
- http://localhost:3000/ese — ESE tracker with code pills
- http://localhost:3000/compliance — Charts render
- http://localhost:3000/teachers — Teacher sheets

Confirm:
- Consistent header across all pages
- Gold bottom border on all non-dashboard pages
- Light content area everywhere
- No dark theme remnants (no #0F1923, #131E2B, #0D1821 backgrounds)
- Alert rows show red tint with left border
- Badges use correct light-theme colors
- Print preview works for rooms and teachers

- [ ] **Step 3: Fix any remaining dark theme remnants**

Search for any remaining inline dark styles:

Run: `grep -rn '#0F1923\|#131E2B\|#0D1821\|bg-slate-800\|border-slate-600\|text-white' src/app/ src/components/ --include='*.tsx'`

Fix any hits by replacing with light theme equivalents.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "style: complete UI redesign — Executive Command Center with Bison branding"
```
