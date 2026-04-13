'use client'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { TestCycle, Student } from '@/types'
import StatCard from '@/components/StatCard'
import Link from 'next/link'

/** Parse testing date text like "May 15, Friday" into a Date for the current school year */
function parseTestingDate(text: string): Date | null {
  if (!text?.trim()) return null
  const match = text.match(/^(\w+)\s+(\d+)/)
  if (!match) return null
  const [, month, day] = match
  const months: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  }
  const m = months[month]
  if (m === undefined) return null
  const year = m >= 7 ? 2025 : 2026
  return new Date(year, m, parseInt(day))
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function DashboardPage() {
  const [cycles, setCycles] = useState<TestCycle[]>([])
  const [cycleId, setCycleId] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [allStudents, setAllStudents] = useState<(Student & { cycle_subject: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [calMonth, setCalMonth] = useState(() => new Date(2026, 3, 1)) // April 2026
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')

  useEffect(() => {
    supabase
      .from('test_cycles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data?.length) {
          setCycles(data)
          setCycleId(data[0].id)
          // Load all students across all cycles for the calendar
          supabase.from('students').select('*').then(({ data: all }) => {
            if (all) {
              const cycleMap = new Map(data.map(c => [c.id, c.subject]))
              setAllStudents(all.map(s => ({ ...s, cycle_subject: cycleMap.get(s.cycle_id) ?? '' })))
            }
          })
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

  // Calendar data: group all students by parsed testing date
  const testingByDate = useMemo(() => {
    const map = new Map<string, (Student & { cycle_subject: string })[]>()
    for (const s of allStudents) {
      const d = parseTestingDate(s.testing_date)
      if (!d) continue
      const key = dateKey(d)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    }
    return map
  }, [allStudents])

  const calDays = useMemo(() => {
    const year = calMonth.getFullYear()
    const month = calMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: (Date | null)[] = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
    return days
  }, [calMonth])

  const selectedStudents = selectedDate ? (testingByDate.get(selectedDate) ?? []) : []
  const selectedSubjects = [...new Set(selectedStudents.map(s => s.cycle_subject))].sort()

  // All exams for a selected student (matched by student_id)
  const studentExams = useMemo(() => {
    if (!selectedStudentId) return []
    return allStudents
      .filter(s => s.student_id === selectedStudentId)
      .sort((a, b) => {
        const da = parseTestingDate(a.testing_date)
        const db = parseTestingDate(b.testing_date)
        if (da && db) return da.getTime() - db.getTime()
        if (da) return -1
        if (db) return 1
        return a.cycle_subject.localeCompare(b.cycle_subject)
      })
  }, [selectedStudentId, allStudents])

  const selectedStudentName = studentExams.length
    ? `${studentExams[0].first_name.trim()} ${studentExams[0].last_name.trim()}`
    : ''

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

        {/* Testing Calendar */}
        <div className="bg-surface-card border border-surface-border rounded-[10px] overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between">
            <p className="text-sm font-bold text-txt-primary">Testing Calendar</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))}
                className="w-7 h-7 rounded border border-surface-border text-txt-secondary hover:text-txt-primary hover:border-brand-gold flex items-center justify-center text-xs transition-colors"
              >
                &larr;
              </button>
              <span className="text-sm font-semibold text-txt-primary min-w-[120px] text-center">
                {calMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))}
                className="w-7 h-7 rounded border border-surface-border text-txt-secondary hover:text-txt-primary hover:border-brand-gold flex items-center justify-center text-xs transition-colors"
              >
                &rarr;
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="text-[10px] font-semibold text-txt-tertiary text-center py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calDays.map((day, i) => {
                if (!day) return <div key={`e${i}`} />
                const key = dateKey(day)
                const count = testingByDate.get(key)?.length ?? 0
                const isSelected = key === selectedDate
                const isToday = key === dateKey(new Date())
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDate(isSelected ? '' : key)}
                    className={`
                      relative h-12 rounded-lg text-sm font-medium transition-all
                      ${isSelected
                        ? 'bg-brand-navy text-white ring-2 ring-brand-gold'
                        : count > 0
                          ? 'bg-blue-50 text-brand-navy hover:bg-blue-100 border border-blue-200'
                          : 'text-txt-secondary hover:bg-surface-page'
                      }
                      ${isToday && !isSelected ? 'ring-1 ring-brand-gold' : ''}
                    `}
                  >
                    {day.getDate()}
                    {count > 0 && (
                      <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold ${isSelected ? 'text-brand-gold' : 'text-brand-navy'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected date detail */}
          {selectedDate && (
            <div className="border-t border-surface-border">
              <div className="px-4 py-3 border-b border-surface-border bg-surface-page">
                <p className="text-sm font-bold text-txt-primary">
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  <span className="text-txt-secondary font-normal ml-2">— {selectedStudents.length} students</span>
                </p>
                {selectedSubjects.length > 0 && (
                  <p className="text-xs text-txt-secondary mt-0.5">
                    {selectedSubjects.map(sub => {
                      const c = selectedStudents.filter(s => s.cycle_subject === sub).length
                      return `${sub} (${c})`
                    }).join(' · ')}
                  </p>
                )}
              </div>
              {selectedStudents.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-txt-tertiary">No tests scheduled</div>
              ) : (
                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="roster-table">
                    <thead className="sticky top-0 bg-surface-card">
                      <tr>
                        <th>Subject</th>
                        <th>Name</th>
                        <th>Student ID</th>
                        <th>Gr</th>
                        <th>Teacher</th>
                        <th>Testing Room</th>
                        <th>ESOL</th>
                        <th>ESE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudents
                        .sort((a, b) => a.cycle_subject.localeCompare(b.cycle_subject) || a.last_name.localeCompare(b.last_name))
                        .map(s => (
                        <tr key={s.id}>
                          <td className="text-xs font-semibold text-brand-navy">{s.cycle_subject}</td>
                          <td>
                            <button
                              onClick={() => setSelectedStudentId(s.student_id)}
                              className="font-semibold text-txt-primary hover:text-brand-navy hover:underline transition-colors text-left"
                            >
                              {s.last_name}, {s.first_name}
                            </button>
                          </td>
                          <td className="font-mono text-xs text-txt-secondary">{s.student_id}</td>
                          <td className="text-center">{s.grade}</td>
                          <td className="text-xs text-txt-secondary">{s.teacher_name?.split(' ')[0]}</td>
                          <td className="text-xs">{s.testing_room || '—'}</td>
                          <td className="text-center font-mono">{s.esol_level ?? '—'}</td>
                          <td className="text-center font-mono text-xs">{s.ese_exceptionality ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
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

      {/* Student exam schedule modal */}
      {selectedStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedStudentId('')}>
          <div
            className="bg-surface-card border border-surface-border rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #1B2D4A, #243B5C)' }}>
              <div>
                <p className="text-white font-bold">{selectedStudentName}</p>
                <p className="text-[11px] text-brand-gold">
                  ID: {studentExams[0]?.student_id} · Grade {studentExams[0]?.grade}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentId('')}
                className="text-white/60 hover:text-white text-lg transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="px-5 py-3 border-b border-surface-border bg-surface-page">
              <p className="text-xs font-semibold text-txt-secondary">
                {studentExams.length} exam{studentExams.length !== 1 ? 's' : ''} scheduled
              </p>
            </div>
            <div className="divide-y divide-surface-border max-h-80 overflow-y-auto">
              {studentExams.map(s => (
                <div key={s.id} className="px-5 py-3 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-txt-primary">{s.cycle_subject}</p>
                    <p className="text-xs text-txt-secondary">{s.course_title?.trim()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brand-navy">{s.testing_date || 'TBD'}</p>
                    <p className="text-[11px] text-txt-tertiary">
                      Room {s.testing_room || '—'} · {s.teacher_name?.split(' ')[0]}
                    </p>
                  </div>
                </div>
              ))}
              {studentExams.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-txt-tertiary">No exams found</div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-surface-border bg-surface-page flex justify-end">
              <button
                onClick={() => setSelectedStudentId('')}
                className="px-4 py-2 rounded-lg border border-surface-border text-txt-secondary hover:text-txt-primary text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
