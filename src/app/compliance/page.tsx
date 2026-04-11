'use client'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Student, TestCycle, LANGUAGE_MAP, ESE_MAP, TESTING_ROOMS } from '@/types'
import { enrichStudent } from '@/lib/utils'
import StatCard from '@/components/StatCard'

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

  const esolByLevel = [1,2,3,4,5].map(lvl => ({
    level: lvl,
    count: enriched.filter(s => s.esol_level === lvl).length,
    noExit: enriched.filter(s => s.esol_level === lvl && s.esolStatus === 'no-exit-date').length,
    exitSet: enriched.filter(s => s.esol_level === lvl && s.esol_exit_date).length,
  })).filter(r => r.count > 0)

  const eseByCode = Object.keys(ESE_MAP).map(code => ({
    code,
    desc: ESE_MAP[code],
    count: enriched.filter(s => s.ese_exceptionality === code).length,
  })).filter(r => r.count > 0)

  const roomCounts = TESTING_ROOMS.map(room => {
    const rs = enriched.filter(s => s.testing_room.trim() === room)
    return {
      room,
      total: rs.length,
      esol: rs.filter(s => s.esol_level).length,
      ese: rs.filter(s => s.ese_exceptionality).length,
      standard: rs.filter(s => !s.esol_level && !s.ese_exceptionality).length,
    }
  }).filter(r => r.total > 0)

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
      room: ts[0]?.class_room ?? '—',
      periods: [...new Set(ts.map(s => s.period))].sort().join(', '),
      total: ts.length,
      esol: ts.filter(s => s.esol_level).length,
      ese: ts.filter(s => s.ese_exceptionality).length,
      standard: ts.filter(s => !s.esol_level && !s.ese_exceptionality).length,
      noExit: ts.filter(s => s.esolStatus === 'no-exit-date').length,
    }
  })

  const Table = ({ headers, rows }: { headers: string[], rows: (string|number|JSX.Element)[][] }) => (
    <div className="overflow-x-auto rounded-lg border border-blue-900/40 overflow-hidden">
      <table className="roster-table">
        <thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => (
          <tr key={i}>{row.map((cell, j) => <td key={j} className="text-center first:text-left">{cell}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  )

  return (
    <div className="space-y-7 max-w-4xl">
      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Compliance Dashboard</h2>
          <p className="text-sm text-slate-400">Auto-calculated — share with admin without manual counting</p>
        </div>
        <div className="flex gap-3">
          <select value={cycleId} onChange={e => setCycleId(e.target.value)}
            className="rounded bg-slate-800 border border-slate-600 text-white text-sm px-3 py-2">
            {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium transition-colors">
            🖨 Print
          </button>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Total" value={enriched.length} />
        <StatCard label="ESOL" value={enriched.filter(s=>s.esol_level).length} color="blue" />
        <StatCard label="ESE / 504" value={enriched.filter(s=>s.ese_exceptionality).length} color="purple" />
        <StatCard label="Standard" value={enriched.filter(s=>!s.esol_level&&!s.ese_exceptionality).length} color="green" />
        <StatCard label="Missing Exit" value={enriched.filter(s=>s.esolStatus==='no-exit-date').length} color="red" />
      </div>

      {/* ESOL by level */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">ESOL by Proficiency Level</h3>
        <Table
          headers={['Level', 'Count', '% of ESOL', 'Exit Date Set', 'Missing Exit Date']}
          rows={esolByLevel.map(r => [
            <span key={r.level} className="font-mono text-blue-400 font-bold">Level {r.level}</span>,
            r.count,
            `${Math.round(r.count / enriched.filter(s=>s.esol_level).length * 100)}%`,
            <span key="set" className="text-green-400">{r.exitSet}</span>,
            r.noExit > 0
              ? <span key="no" className="text-red-400 font-bold">⚠ {r.noExit}</span>
              : <span key="ok" className="text-slate-500">0</span>,
          ])}
        />
      </div>

      {/* ESE by code */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">ESE by Exceptionality</h3>
        <Table
          headers={['Code', 'Description', 'Count', '% of ESE']}
          rows={eseByCode.map(r => [
            <span key={r.code} className="font-mono font-bold text-purple-400">{r.code}</span>,
            r.desc,
            r.count,
            `${Math.round(r.count / enriched.filter(s=>s.ese_exceptionality).length * 100)}%`,
          ])}
        />
      </div>

      {/* Room counts */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Students per Testing Room</h3>
        <Table
          headers={['Testing Room', 'Total', 'ESOL', 'ESE / 504', 'Standard']}
          rows={roomCounts.map(r => [
            r.room,
            <span key="t" className="font-mono font-bold text-white">{r.total}</span>,
            <span key="e" className="text-blue-400">{r.esol || '—'}</span>,
            <span key="s" className="text-purple-400">{r.ese || '—'}</span>,
            <span key="n" className="text-green-400">{r.standard || '—'}</span>,
          ])}
        />
      </div>

      {/* Language distribution */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Home Language Distribution</h3>
        <Table
          headers={['Language', 'Code', 'Count', '% Total', 'ESOL', 'ESE']}
          rows={langCounts.map(r => [
            r.name,
            <span key="c" className="font-mono text-slate-400">{r.code}</span>,
            r.count,
            `${Math.round(r.count / enriched.length * 100)}%`,
            r.esol || '—',
            r.ese || '—',
          ])}
        />
      </div>

      {/* Teacher summary */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Teacher Roster Summary</h3>
        <Table
          headers={['Teacher', 'Room', 'Periods', 'Students', 'ESOL', 'ESE/504', 'Standard', 'Missing Exit']}
          rows={teacherSummary.map(t => [
            <span key="n" className="font-medium text-white">{t.name}</span>,
            <span key="r" className="font-mono text-slate-400">{t.room}</span>,
            t.periods,
            <span key="t" className="font-mono font-bold text-white">{t.total}</span>,
            <span key="e" className="text-blue-400">{t.esol || '—'}</span>,
            <span key="s" className="text-purple-400">{t.ese || '—'}</span>,
            <span key="d" className="text-green-400">{t.standard}</span>,
            t.noExit > 0
              ? <span key="x" className="text-red-400 font-bold">⚠ {t.noExit}</span>
              : <span key="ok" className="text-slate-500">0</span>,
          ])}
        />
      </div>
    </div>
  )
}
