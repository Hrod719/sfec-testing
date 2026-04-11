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
