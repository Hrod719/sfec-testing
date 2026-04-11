'use client'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Student, TestCycle } from '@/types'
import { enrichStudent, getStudentFullName } from '@/lib/utils'
import AccomBadge from '@/components/AccomBadge'

const TEACHER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'ALAMIE-OMU EBENEZER':  { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
  'LIMA ARIEL':           { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' },
  'PENA CARBALLO ILEANA': { bg: '#F5F3FF', border: '#DDD6FE', text: '#5B21B6' },
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
          <h2 className="text-xl font-semibold text-txt-primary mb-1">Teacher Communication Sheets</h2>
          <p className="text-sm text-txt-secondary">Print and hand to each teacher. One section per teacher.</p>
        </div>
        <div className="flex gap-3">
          <select value={cycleId} onChange={e => setCycleId(e.target.value)}
            className="rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2">
            {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white text-sm font-medium transition-colors">
            🖨 Print All
          </button>
        </div>
      </div>

      {/* Teacher filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5 no-print">
        <button
          onClick={() => setActiveTeacher(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            !activeTeacher ? 'bg-brand-navy text-white border-brand-navy' : 'text-txt-secondary border-surface-border hover:text-txt-primary'
          }`}>
          All Teachers
        </button>
        {teachers.map(t => (
          <button key={t}
            onClick={() => setActiveTeacher(activeTeacher === t ? null : t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              activeTeacher === t ? 'bg-brand-navy text-white border-brand-navy' : 'text-txt-secondary border-surface-border hover:text-txt-primary'
            }`}>
            {t.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Teacher sheets */}
      <div className="space-y-8">
        {visibleTeachers.map(({ teacher, students: ts, periods, room }) => {
          const colors = TEACHER_COLORS[teacher] ?? { bg: '#F8F9FB', border: '#E5E8ED', text: '#1B2D4A' }
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
                    <p className="text-xs uppercase tracking-wider mb-1 opacity-60" style={{ color: colors.text }}>Teacher</p>
                    <h3 className="text-lg font-bold" style={{ color: colors.text }}>{teacher}</h3>
                    <p className="text-sm mt-1" style={{ color: colors.text }}>
                      Class Room: {room} &nbsp;·&nbsp; Periods: {periods.map(p => `Pd ${p}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-60" style={{ color: colors.text }}>Testing: May 15, Friday</p>
                    <p className="text-2xl font-bold font-mono mt-1" style={{ color: colors.text }}>{ts.length}</p>
                    <p className="text-xs opacity-60" style={{ color: colors.text }}>students</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-3 text-xs" style={{ color: colors.text }}>
                  <span>ESOL: <strong>{esolCount}</strong></span>
                  <span>ESE/504: <strong>{eseCount}</strong></span>
                  <span>Standard: <strong>{stdCount}</strong></span>
                </div>
              </div>

              {/* Student table */}
              <div>
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
                        <td className="text-center font-mono text-txt-secondary">{s.period}</td>
                        <td>
                          <span className="font-semibold text-txt-primary">{getStudentFullName(s)}</span>
                          {s.esolStatus === 'no-exit-date' && (
                            <span className="ml-2 text-semantic-error text-xs font-bold">⚠ no exit date</span>
                          )}
                        </td>
                        <td className="font-mono text-xs text-txt-secondary">{s.student_id}</td>
                        <td className="text-center">{s.grade}</td>
                        <td className="text-sm font-medium" style={{ color: colors.text }}>{s.testing_room}</td>
                        <td className="text-center font-mono text-semantic-info">{s.esol_level ?? '—'}</td>
                        <td className="text-center font-mono text-semantic-purple">{s.ese_exceptionality ?? '—'}</td>
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
