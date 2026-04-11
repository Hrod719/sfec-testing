'use client'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Student, TestCycle, ESE_MAP } from '@/types'
import { enrichStudent, getStudentFullName } from '@/lib/utils'

const CODE_STYLES: Record<string, string> = {
  'K':   'bg-indigo-100 text-indigo-800 border border-indigo-200',
  'J':   'bg-rose-100 text-rose-800 border border-rose-200',
  'V':   'bg-emerald-100 text-emerald-800 border border-emerald-200',
  'P':   'bg-amber-100 text-amber-800 border border-amber-200',
  '504': 'bg-violet-100 text-violet-800 border border-violet-200',
}

export default function EsePage() {
  const [cycles, setCycles] = useState<TestCycle[]>([])
  const [cycleId, setCycleId] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [filterCode, setFilterCode] = useState('')
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Record<string, string>>({})

  useEffect(() => {
    supabase.from('test_cycles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data?.length) { setCycles(data); setCycleId(data[0].id) } })
  }, [])

  useEffect(() => {
    if (!cycleId) return
    supabase.from('students').select('*').eq('cycle_id', cycleId)
      .then(({ data }) => setStudents((data ?? []).filter(s => s.ese_exceptionality)))
    // Load notes from localStorage
    const saved = localStorage.getItem(`ese-notes-${cycleId}`)
    if (saved) setNotes(JSON.parse(saved))
  }, [cycleId])

  const saveNote = (studentId: string, value: string) => {
    const updated = { ...notes, [studentId]: value }
    setNotes(updated)
    localStorage.setItem(`ese-notes-${cycleId}`, JSON.stringify(updated))
  }

  const enriched = useMemo(() => {
    let result = students.map(enrichStudent)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s => `${s.last_name} ${s.first_name} ${s.student_id}`.toLowerCase().includes(q))
    }
    if (filterCode) result = result.filter(s => s.ese_exceptionality === filterCode)
    return result.sort((a, b) => {
      const ca = a.ese_exceptionality ?? ''
      const cb = b.ese_exceptionality ?? ''
      return ca.localeCompare(cb) || a.last_name.localeCompare(b.last_name)
    })
  }, [students, search, filterCode])

  const codes = [...new Set(students.map(s => s.ese_exceptionality ?? ''))].filter(Boolean).sort()

  return (
    <div>
      <div className="flex items-center justify-between mb-4 no-print">
        <div>
          <h2 className="text-xl font-semibold text-txt-primary mb-1">ESE & 504 Tracker</h2>
          <p className="text-sm text-txt-secondary">{students.length} students with accommodations · Notes save locally</p>
        </div>
        <div className="flex gap-3">
          <select value={cycleId} onChange={e => setCycleId(e.target.value)}
            className="rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2">
            {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white text-sm font-medium transition-colors">
            🖨 Print
          </button>
        </div>
      </div>

      {/* Code legend */}
      <div className="flex gap-2 flex-wrap mb-4 no-print">
        {Object.entries(ESE_MAP).map(([code, desc]) => (
          <button key={code}
            onClick={() => setFilterCode(filterCode === code ? '' : code)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${CODE_STYLES[code]} ${filterCode === code ? 'ring-2 ring-brand-navy/30' : 'opacity-70 hover:opacity-100'}`}>
            {code} — {desc} ({students.filter(s => s.ese_exceptionality === code).length})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-4 no-print">
        <input type="text" placeholder="Search name or ID..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2 min-w-48" />
        {(search || filterCode) && (
          <button onClick={() => { setSearch(''); setFilterCode('') }}
            className="text-xs text-txt-secondary hover:text-txt-primary border border-surface-border px-3 py-2 rounded transition-colors">
            Clear
          </button>
        )}
        <span className="text-xs text-txt-tertiary self-center ml-auto">Showing {enriched.length} of {students.length}</span>
      </div>

      <div className="bg-surface-card border border-surface-border rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="roster-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th>Gr</th>
                <th>Pd</th>
                <th>Teacher</th>
                <th>Testing Room</th>
                <th>ESE Code</th>
                <th>Description</th>
                <th>ESOL</th>
                <th>Proctor Notes</th>
              </tr>
            </thead>
            <tbody>
              {enriched.map(s => (
                <tr key={s.id}>
                  <td><span className="font-semibold text-txt-primary">{getStudentFullName(s)}</span></td>
                  <td className="font-mono text-xs text-txt-secondary">{s.student_id}</td>
                  <td className="text-center">{s.grade}</td>
                  <td className="text-center">{s.period}</td>
                  <td className="text-xs text-txt-secondary">{s.teacher_name.split(' ')[0]}</td>
                  <td className="text-xs text-txt-secondary">{s.testing_room}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${CODE_STYLES[s.ese_exceptionality ?? ''] ?? ''}`}>
                      {s.ese_exceptionality}
                    </span>
                  </td>
                  <td className="text-xs text-txt-secondary">{s.eseDescription}</td>
                  <td className="text-center font-mono text-semantic-info">{s.esol_level ?? '—'}</td>
                  <td className="no-print">
                    <input
                      type="text"
                      placeholder="Add note..."
                      value={notes[s.student_id] ?? ''}
                      onChange={e => saveNote(s.student_id, e.target.value)}
                      className="w-full bg-surface-page border border-surface-border rounded px-2 py-1 text-xs text-txt-primary placeholder-txt-tertiary focus:border-brand-navy outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
