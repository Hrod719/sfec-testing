'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Student, TestCycle, TESTING_ROOMS, ROOM_COLORS } from '@/types'
import { enrichStudent, getStudentFullName } from '@/lib/utils'
import AccomBadge from '@/components/AccomBadge'

export default function RoomsPage() {
  const [cycles, setCycles] = useState<TestCycle[]>([])
  const [cycleId, setCycleId] = useState('')
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    supabase.from('test_cycles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data?.length) { setCycles(data); setCycleId(data[0].id) }
      })
  }, [])

  useEffect(() => {
    if (!cycleId) return
    supabase.from('students').select('*').eq('cycle_id', cycleId)
      .then(({ data }) => setStudents(data ?? []))
  }, [cycleId])

  const byRoom = TESTING_ROOMS.reduce((acc, room) => {
    acc[room] = students
      .filter(s => s.testing_room.trim() === room)
      .sort((a, b) => a.last_name.localeCompare(b.last_name))
    return acc
  }, {} as Record<string, Student[]>)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h2 className="text-xl font-semibold text-txt-primary mb-1">Testing Room Rosters</h2>
          <p className="text-sm text-txt-secondary">One sheet per room. Print button generates all rooms.</p>
        </div>
        <div className="flex gap-3 items-center">
          <select
            value={cycleId}
            onChange={e => setCycleId(e.target.value)}
            className="rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2"
          >
            {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white text-sm font-medium transition-colors"
          >
            🖨 Print All Rooms
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {TESTING_ROOMS.map(room => {
          const roomStudents = byRoom[room] ?? []
          if (!roomStudents.length) return null
          const colors = ROOM_COLORS[room] ?? { bg: '#1E3A5F', text: '#FFFFFF', light: '#D6EAF8' }
          const esol = roomStudents.filter(s => s.esol_level).length
          const ese = roomStudents.filter(s => s.ese_exceptionality).length
          return (
            <div key={room} className="rounded-xl overflow-hidden border border-surface-border bg-surface-card print-break">
              {/* Room header */}
              <div className="px-4 py-3" style={{ background: colors.bg }}>
                <h3 className="font-bold text-base" style={{ color: colors.text }}>
                  Testing Room: {room}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: colors.text, opacity: 0.75 }}>
                  {roomStudents.length} students · ESOL: {esol} · ESE/504: {ese} · Standard: {roomStudents.length - esol - ese}
                </p>
              </div>

              {/* Roster table */}
              <div className="overflow-x-auto">
                <table className="roster-table">
                  <thead>
                    <tr>
                      <th style={{ width: 28 }}>#</th>
                      <th>Name</th>
                      <th style={{ width: 40 }}>Gr</th>
                      <th style={{ width: 36 }}>Pd</th>
                      <th>Teacher</th>
                      <th>Accommodation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomStudents.map((s, i) => {
                      const enriched = enrichStudent(s)
                      const noExit = s.esol_level && !s.esol_exit_date
                      return (
                        <tr key={s.id} className={noExit ? 'alert-row' : ''}>
                          <td className="text-txt-tertiary text-xs text-center">{i + 1}</td>
                          <td>
                            <span className="font-semibold text-txt-primary">{getStudentFullName(s)}</span>
                            {noExit && <span className="ml-2 text-semantic-error text-xs font-bold">⚠</span>}
                          </td>
                          <td className="text-center text-txt-secondary">{s.grade}</td>
                          <td className="text-center text-txt-secondary">{s.period}</td>
                          <td className="text-xs text-txt-secondary">{s.teacher_name.split(' ')[0]}</td>
                          <td><AccomBadge group={enriched.accommodationGroup} /></td>
                        </tr>
                      )
                    })}
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
