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

  const quickLinks = [
    { href: '/rooms',      label: 'Room Rosters',    desc: 'Print-ready proctor sheets', icon: '🏫' },
    { href: '/roster',     label: 'Master Roster',   desc: 'All students, filterable',   icon: '📋' },
    { href: '/tracker',    label: 'ESOL Tracker',    desc: `${noExit.length} missing exit dates`, icon: '🌐', alert: noExit.length > 0 },
    { href: '/ese',        label: 'ESE & 504',       desc: `${ese.length} students`,     icon: '♿' },
    { href: '/compliance', label: 'Compliance',      desc: 'Summary counts for admin',   icon: '📊' },
    { href: '/teachers',   label: 'Teacher Sheets',  desc: 'Per-teacher comm sheets',    icon: '📧' },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-400 font-mono text-sm">Loading...</p>
    </div>
  )

  if (!cycles.length) return (
    <div className="max-w-lg mx-auto text-center py-20">
      <p className="text-5xl mb-4">📂</p>
      <h2 className="text-xl font-semibold text-white mb-2">No data yet</h2>
      <p className="text-slate-400 text-sm mb-6">Upload your first roster CSV to get started.</p>
      <Link href="/upload" className="px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-medium text-sm transition-colors">
        Upload Roster →
      </Link>
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Cycle selector */}
      <div className="flex items-center gap-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">Test Cycle</label>
          <select
            value={cycleId}
            onChange={e => setCycleId(e.target.value)}
            className="rounded-lg bg-slate-800 border border-slate-600 text-white text-sm px-3 py-2 min-w-64"
          >
            {cycles.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        {cycle && (
          <div className="pt-5">
            <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-3 py-1.5 rounded-full">
              {cycle.test_date} · {cycle.subject}
            </span>
          </div>
        )}
        <div className="ml-auto pt-5">
          <Link href="/upload" className="text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1.5 rounded transition-colors">
            + Upload New Roster
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total Students" value={students.length} />
        <StatCard label="ESOL" value={esol.length} color="blue" sub={`${Math.round(esol.length/students.length*100)}% of total`} />
        <StatCard label="ESE / 504" value={ese.length} color="purple" />
        <StatCard label="Standard" value={standard.length} color="green" />
        <StatCard label="Missing Exit" value={noExit.length} color="red" sub="ESOL no exit date" />
        <StatCard label="Rooms" value={rooms} color="orange" />
      </div>

      {/* Alert banner */}
      {noExit.length > 0 && (
        <div className="rounded-lg border border-red-800/50 px-4 py-3 flex items-center justify-between" style={{ background: '#2D1A1A' }}>
          <div>
            <p className="text-red-400 font-semibold text-sm">⚠ Compliance Alert</p>
            <p className="text-xs text-red-300/70 mt-0.5">
              {noExit.length} ESOL students have no exit date recorded. Review the ESOL Tracker.
            </p>
          </div>
          <Link href="/tracker" className="text-xs text-red-400 border border-red-800 px-3 py-1.5 rounded hover:bg-red-900/30 transition-colors">
            Review →
          </Link>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickLinks.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-lg border p-4 hover:border-blue-600 transition-colors group ${
              l.alert ? 'border-red-800/60' : 'border-blue-900/40'
            }`}
            style={{ background: '#131E2B' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{l.icon}</span>
              <div>
                <p className="font-medium text-white text-sm group-hover:text-blue-300 transition-colors">{l.label}</p>
                <p className={`text-xs mt-0.5 ${l.alert ? 'text-red-400' : 'text-slate-500'}`}>{l.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Teacher summary */}
      <div className="rounded-lg border border-blue-900/40 overflow-hidden" style={{ background: '#131E2B' }}>
        <p className="text-xs text-slate-400 uppercase tracking-wider px-4 py-3 border-b border-blue-900/40">Teacher summary</p>
        <table className="roster-table">
          <thead>
            <tr>
              <th>Teacher</th><th>Class Room</th><th>Periods</th>
              <th>Students</th><th>ESOL</th><th>ESE/504</th><th>Standard</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(t => {
              const ts = students.filter(s => s.teacher_name === t)
              const periods = [...new Set(ts.map(s => s.period))].sort().join(', ')
              const room = ts[0]?.class_room ?? '—'
              return (
                <tr key={t}>
                  <td className="font-medium text-white">{t}</td>
                  <td className="font-mono text-slate-400">{room}</td>
                  <td className="text-slate-300">{periods}</td>
                  <td className="font-mono text-center font-semibold text-white">{ts.length}</td>
                  <td className="text-center text-blue-400 font-mono">{ts.filter(s=>s.esol_level).length}</td>
                  <td className="text-center text-purple-400 font-mono">{ts.filter(s=>s.ese_exceptionality).length}</td>
                  <td className="text-center text-green-400 font-mono">{ts.filter(s=>!s.esol_level&&!s.ese_exceptionality).length}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
