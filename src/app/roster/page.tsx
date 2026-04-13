'use client'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Student, TestCycle, LANGUAGE_MAP } from '@/types'
import { enrichStudent, getStudentFullName, esolStatusLabel, esolStatusColor } from '@/lib/utils'
import AccomBadge from '@/components/AccomBadge'

export default function RosterPage() {
  const [cycles, setCycles] = useState<TestCycle[]>([])
  const [cycleId, setCycleId] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState('')
  const [filterRoom, setFilterRoom] = useState('')
  const [filterTeacher, setFilterTeacher] = useState('')
  const [filterAccom, setFilterAccom] = useState('')
  const [filterGrade, setFilterGrade] = useState('')
  const [sortCol, setSortCol] = useState('last_name')
  const [sortDir, setSortDir] = useState(1)

  useEffect(() => {
    supabase.from('test_cycles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data?.length) { setCycles(data); setCycleId(data[0].id) } })
  }, [])

  useEffect(() => {
    if (!cycleId) return
    supabase.from('students').select('*').eq('cycle_id', cycleId)
      .then(({ data }) => setStudents(data ?? []))
  }, [cycleId])

  const rooms = [...new Set(students.map(s => s.testing_room.trim()))].sort()
  const teachers = [...new Set(students.map(s => s.teacher_name))].sort()

  const filtered = useMemo(() => {
    let result = students.map(enrichStudent)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        `${s.last_name} ${s.first_name} ${s.student_id} ${s.teacher_name} ${s.testing_room}`.toLowerCase().includes(q)
      )
    }
    if (filterRoom) result = result.filter(s => s.testing_room.trim() === filterRoom)
    if (filterTeacher) result = result.filter(s => s.teacher_name === filterTeacher)
    if (filterGrade) result = result.filter(s => s.grade === parseInt(filterGrade))
    if (filterAccom === 'ESOL') result = result.filter(s => s.esol_level)
    else if (filterAccom === 'ESE') result = result.filter(s => s.ese_exceptionality)
    else if (filterAccom === '504') result = result.filter(s => s.ese_exceptionality === '504')
    else if (filterAccom === 'Standard') result = result.filter(s => !s.esol_level && !s.ese_exceptionality)
    else if (filterAccom === 'no-exit') result = result.filter(s => s.esolStatus === 'no-exit-date')

    result.sort((a, b) => {
      const av = (a as any)[sortCol] ?? ''
      const bv = (b as any)[sortCol] ?? ''
      return av < bv ? -sortDir : av > bv ? sortDir : 0
    })
    return result
  }, [students, search, filterRoom, filterTeacher, filterGrade, filterAccom, sortCol, sortDir])

  const sort = (col: string) => {
    if (sortCol === col) setSortDir(d => d * -1)
    else { setSortCol(col); setSortDir(1) }
  }

  const Th = ({ col, label }: { col: string; label: string }) => (
    <th onClick={() => sort(col)} className="cursor-pointer select-none hover:text-brand-navy transition-colors">
      {label}{sortCol === col ? (sortDir === 1 ? ' ↑' : ' ↓') : ''}
    </th>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4 no-print">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-txt-primary mb-1">Master Roster</h2>
          <p className="text-sm text-txt-secondary">Showing {filtered.length} of {students.length} students</p>
        </div>
        <select
          value={cycleId}
          onChange={e => setCycleId(e.target.value)}
          className="rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2"
        >
          {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Filters */}
      <div className="bg-surface-card border border-surface-border rounded-[10px] p-2.5 mb-4 flex gap-2 flex-wrap items-center no-print">
        <input
          type="text"
          placeholder="Search name, ID, teacher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded bg-surface-page border border-surface-border text-txt-primary placeholder-txt-tertiary text-sm px-3 py-2 min-w-56"
        />
        <select value={filterRoom} onChange={e => setFilterRoom(e.target.value)}
          className="rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2">
          <option value="">All Rooms</option>
          {rooms.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filterTeacher} onChange={e => setFilterTeacher(e.target.value)}
          className="rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2">
          <option value="">All Teachers</option>
          {teachers.map(t => <option key={t} value={t}>{t.split(' ')[0]}</option>)}
        </select>
        <select value={filterAccom} onChange={e => setFilterAccom(e.target.value)}
          className="rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2">
          <option value="">All Accommodations</option>
          <option value="ESOL">ESOL</option>
          <option value="ESE">ESE</option>
          <option value="504">504</option>
          <option value="Standard">Standard</option>
          <option value="no-exit">⚠ No Exit Date</option>
        </select>
        <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)}
          className="rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2">
          <option value="">All Grades</option>
          {[9,10,11,12].map(g => <option key={g} value={g}>Grade {g}</option>)}
        </select>
        {(search || filterRoom || filterTeacher || filterAccom || filterGrade) && (
          <button onClick={() => { setSearch(''); setFilterRoom(''); setFilterTeacher(''); setFilterAccom(''); setFilterGrade('') }}
            className="text-xs text-txt-secondary hover:text-txt-primary border border-surface-border px-3 py-2 rounded transition-colors">
            Clear
          </button>
        )}
      </div>

      <div className="bg-surface-card border border-surface-border rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="roster-table">
            <thead>
              <tr>
                <Th col="last_name" label="Name" />
                <Th col="student_id" label="Student ID" />
                <Th col="grade" label="Gr" />
                <Th col="period" label="Pd" />
                <Th col="teacher_name" label="Teacher" />
                <Th col="testing_room" label="Testing Room" />
                <Th col="testing_date" label="Testing Date" />
                <Th col="student_language" label="Language" />
                <Th col="esol_level" label="ESOL" />
                <th>Exit Date</th>
                <Th col="ese_exceptionality" label="ESE" />
                <th>Accommodation</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className={s.esolStatus === 'no-exit-date' ? 'alert-row' : ''}>
                  <td>
                    <span className="font-semibold text-txt-primary">{getStudentFullName(s)}</span>
                  </td>
                  <td className="font-mono text-xs text-txt-secondary">{s.student_id}</td>
                  <td className="text-center">{s.grade}</td>
                  <td className="text-center">{s.period}</td>
                  <td className="text-xs text-txt-secondary">{s.teacher_name.split(' ')[0]}</td>
                  <td className="text-xs">{s.testing_room}</td>
                  <td className="text-xs text-txt-secondary">{s.testing_date || '—'}</td>
                  <td className="text-xs text-txt-secondary">{s.languageFull}</td>
                  <td className="text-center font-mono">{s.esol_level ?? '—'}</td>
                  <td className={`text-xs ${esolStatusColor(s.esolStatus)}`}>
                    {s.esol_level ? (s.esol_exit_date || '⚠ NOT SET') : '—'}
                  </td>
                  <td className="text-center font-mono text-xs">{s.ese_exceptionality ?? '—'}</td>
                  <td><AccomBadge group={s.accommodationGroup} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
