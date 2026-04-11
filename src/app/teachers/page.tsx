'use client'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Student, TestCycle } from '@/types'
import { enrichStudent, getStudentFullName } from '@/lib/utils'
import AccomBadge from '@/components/AccomBadge'

const TEACHER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'ALAMIE-OMU EBENEZER':  { bg: '#0C1F35', border: '#1A5276', text: '#A8C7E8' },
  'LIMA ARIEL':           { bg: '#0C2118', border: '#1E8449', text: '#A9DFBF' },
  'PENA CARBALLO ILEANA': { bg: '#1A0F27', border: '#6C3483', text: '#D2B4DE' },
}

export default function TeachersPage() {
  const [cycles, setCycles] = useState<TestCycle[]>([])
  const [cycleId, setCycleId] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [activeTeacher, setActiveTeacher] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('test_cycles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data?.length) { setCycles(data); setCycleId(data[0].id) } })
  }, [])

  useEffect(() => {
    if (!cycleId) return
    supabase.from('students').select('*').eq('cycle_id', cycleId)
      .then(({ data }) => setStudents(data ?? []))
  }, [cycleId])

  const teachers = [...new Set(students.map(s => s.teacher_name))].sort()

  const teacherData = useMemo(() => {
    return teachers.map(teacher => {
      const ts = students
        .filter(s => s.teacher_name === teacher)
        .sort((a, b) => a.period - b.period || a.last_name.localeCompare(b.last_name))
        .map(enrichStudent)
      const periods = [...new Set(ts.map(s => s.period))].sort()
      const room = ts[0]?.class_room ?? '—'
      return { teacher, students: ts, periods, room }
    })
  }, [students, teachers])

  const visibleTeachers = activeTeacher
    ? teacherData.filter(t => t.teacher === activeTeacher)
    : teacherData

  return (
    <div>
      <div className="flex items-center justify-between mb-4 no-print">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Teacher Communication Sheets</h2>
          <p className="text-sm text-slate-400">Print and hand to each teacher. One section per teacher.</p>
        </div>
        <div className="flex gap-3">
          <select value={cycleId} onChange={e => setCycleId(e.target.value)}
            className="rounded bg-slate-800 border border-slate-600 text-white text-sm px-3 py-2">
            {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium transition-colors">
            🖨 Print All
          </button>
        </div>
      </div>

      {/* Teacher filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5 no-print">
        <button
          onClick={() => setActiveTeacher(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            !activeTeacher ? 'bg-blue-700 text-white border-blue-700' : 'text-slate-400 border-slate-700 hover:text-white'
          }`}>
          All Teachers
        </button>
        {teachers.map(t => (
          <button key={t}
            onClick={() => setActiveTeacher(activeTeacher === t ? null : t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              activeTeacher === t ? 'bg-blue-700 text-white border-blue-700' : 'text-slate-400 border-slate-700 hover:text-white'
            }`}>
            {t.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Teacher sheets */}
      <div className="space-y-8">
        {visibleTeachers.map(({ teacher, students: ts, periods, room }) => {
          const colors = TEACHER_COLORS[teacher] ?? { bg: '#0F1923', border: '#2A3F5A', text: '#A8C7E8' }
          const esolCount = ts.filter(s => s.esol_level).length
          const eseCount = ts.filter(s => s.ese_exceptionality).length
          const stdCount = ts.filter(s => !s.esol_level && !s.ese_exceptionality).length

          return (
            <div key={teacher} className="rounded-xl overflow-hidden border print-break"
              style={{ borderColor: colors.border }}>
              {/* Teacher header */}
              <div className="px-5 py-4" style={{ background: colors.bg, borderBottom: `1px solid ${colors.border}` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: colors.text, opacity: 0.7 }}>Teacher</p>
                    <h3 className="text-lg font-bold text-white">{teacher}</h3>
                    <p className="text-sm mt-1" style={{ color: colors.text }}>
                      Class Room: {room} &nbsp;·&nbsp; Periods: {periods.map(p => `Pd ${p}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>Testing: May 15, Friday</p>
                    <p className="text-2xl font-bold font-mono text-white mt-1">{ts.length}</p>
                    <p className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>students</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-3 text-xs" style={{ color: colors.text }}>
                  <span>ESOL: <strong>{esolCount}</strong></span>
                  <span>ESE/504: <strong>{eseCount}</strong></span>
                  <span>Standard: <strong>{stdCount}</strong></span>
                </div>
              </div>

              {/* Student table */}
              <div style={{ background: '#0D1821' }}>
                <table className="roster-table">
                  <thead>
                    <tr>
                      <th>Pd</th>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Gr</th>
                      <th>Testing Room</th>
                      <th>ESOL</th>
                      <th>ESE</th>
                      <th>Accommodation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ts.map(s => (
                      <tr key={s.id} className={s.esolStatus === 'no-exit-date' ? 'alert-row' : ''}>
                        <td className="text-center font-mono text-slate-400">{s.period}</td>
                        <td>
                          <span className="font-semibold text-white">{getStudentFullName(s)}</span>
                          {s.esolStatus === 'no-exit-date' && (
                            <span className="ml-2 text-red-400 text-xs font-bold">⚠ no exit date</span>
                          )}
                        </td>
                        <td className="font-mono text-xs text-slate-400">{s.student_id}</td>
                        <td className="text-center">{s.grade}</td>
                        <td className="text-sm font-medium" style={{ color: colors.text }}>{s.testing_room}</td>
                        <td className="text-center font-mono text-blue-400">{s.esol_level ?? '—'}</td>
                        <td className="text-center font-mono text-purple-400">{s.ese_exceptionality ?? '—'}</td>
                        <td><AccomBadge group={s.accommodationGroup} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
