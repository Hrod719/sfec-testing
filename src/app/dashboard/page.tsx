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
