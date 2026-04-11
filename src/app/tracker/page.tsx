'use client'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Student, TestCycle } from '@/types'
import { enrichStudent, getStudentFullName, esolStatusLabel, esolStatusColor } from '@/lib/utils'

export default function TrackerPage() {
  const [cycles, setCycles] = useState<TestCycle[]>([])
  const [cycleId, setCycleId] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [filterStatus, setFilterStatus] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('test_cycles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data?.length) { setCycles(data); setCycleId(data[0].id) } })
  }, [])

  useEffect(() => {
    if (!cycleId) return
    supabase.from('students').select('*').eq('cycle_id', cycleId)
      .then(({ data }) => setStudents((data ?? []).filter(s => s.esol_level)))
  }, [cycleId])

  const enriched = useMemo(() => {
    let result = students.map(enrichStudent)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s => `${s.last_name} ${s.first_name} ${s.student_id}`.toLowerCase().includes(q))
    }
    if (filterStatus) result = result.filter(s => s.esolStatus === filterStatus)
    if (filterLevel) result = result.filter(s => s.esol_level === parseInt(filterLevel))
    return result.sort((a, b) => {
      if (a.esolStatus === 'no-exit-date' && b.esolStatus !== 'no-exit-date') return -1
      if (b.esolStatus === 'no-exit-date' && a.esolStatus !== 'no-exit-date') return 1
      return (a.esol_level ?? 0) - (b.esol_level ?? 0)
    })
  }, [students, search, filterStatus, filterLevel])

  const all = students.map(enrichStudent)
  const counts = {
    noExit:   all.filter(s => s.esolStatus === 'no-exit-date').length,
    past:     all.filter(s => s.esolStatus === 'past-exit').length,
    soon:     all.filter(s => s.esolStatus === 'exiting-soon').length,
    quarter:  all.filter(s => s.esolStatus === 'exiting-quarter').length,
    active:   all.filter(s => s.esolStatus === 'active').length,
  }

  const rowBg = (status: string) => {
    if (status === 'no-exit-date') return 'alert-row'
    if (status === 'past-exit') return 'alert-row'
    return ''
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 no-print">
        <div>
          <h2 className="text-xl font-semibold text-txt-primary mb-1">ESOL Tracker</h2>
          <p className="text-sm text-txt-secondary">{students.length} ESOL students · Sorted by urgency</p>
        </div>
        <select value={cycleId} onChange={e => setCycleId(e.target.value)}
          className="rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2">
          {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Status summary pills */}
      <div className="flex gap-3 flex-wrap mb-4 no-print">
        {[
          { key: 'no-exit-date', label: `⚠ No Exit Date (${counts.noExit})`, cls: 'bg-red-100 text-red-800 border-red-200' },
          { key: 'past-exit',    label: `Past Exit (${counts.past})`,         cls: 'bg-orange-100 text-orange-800 border-orange-200' },
          { key: 'exiting-soon', label: `Exiting Soon (${counts.soon})`,      cls: 'bg-amber-100 text-amber-800 border-amber-200' },
          { key: 'exiting-quarter', label: `This Quarter (${counts.quarter})`,cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
          { key: 'active',       label: `Active (${counts.active})`,          cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
        ].map(s => (
          <button key={s.key}
            onClick={() => setFilterStatus(filterStatus === s.key ? '' : s.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${s.cls} ${filterStatus === s.key ? 'ring-2 ring-brand-navy/30' : 'opacity-75 hover:opacity-100'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap mb-4 no-print">
        <input type="text" placeholder="Search name or ID..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2 min-w-48" />
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
          className="rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2">
          <option value="">All Levels</option>
          {[1,2,3,4,5].map(l => <option key={l} value={l}>Level {l}</option>)}
        </select>
        {(search || filterStatus || filterLevel) && (
          <button onClick={() => { setSearch(''); setFilterStatus(''); setFilterLevel('') }}
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
                <th>Language</th>
                <th>ESOL Level</th>
                <th>Exit Date</th>
                <th>Days Until Exit</th>
                <th>Testing Room</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {enriched.map(s => (
                <tr key={s.id} className={rowBg(s.esolStatus)}>
                  <td><span className="font-semibold text-txt-primary">{getStudentFullName(s)}</span></td>
                  <td className="font-mono text-xs text-txt-secondary">{s.student_id}</td>
                  <td className="text-center">{s.grade}</td>
                  <td className="text-center">{s.period}</td>
                  <td className="text-xs text-txt-secondary">{s.teacher_name.split(' ')[0]}</td>
                  <td className="text-xs text-txt-secondary">{s.languageFull}</td>
                  <td className="text-center font-mono font-bold text-semantic-info">{s.esol_level}</td>
                  <td className="text-xs font-mono">
                    {s.esol_exit_date ?? <span className="text-semantic-error font-bold">NOT SET</span>}
                  </td>
                  <td className="text-center font-mono text-sm">
                    {s.daysUntilExit !== null
                      ? <span className={s.daysUntilExit < 0 ? 'text-semantic-error' : s.daysUntilExit <= 30 ? 'text-semantic-warning' : 'text-txt-secondary'}>
                          {s.daysUntilExit}d
                        </span>
                      : <span className="text-txt-tertiary">—</span>
                    }
                  </td>
                  <td className="text-xs text-txt-secondary">{s.testing_room}</td>
                  <td className={`text-xs font-semibold ${esolStatusColor(s.esolStatus)}`}>
                    {esolStatusLabel(s.esolStatus)}
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
