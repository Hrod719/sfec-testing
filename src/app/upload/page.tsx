'use client'
import { useState, useCallback, useMemo, useEffect } from 'react'
import Papa from 'papaparse'
import { supabase } from '@/lib/supabase'
import { TestCycle } from '@/types'

const DEFAULT_SCHOOL_YEAR = '2025-2026'
const INSERT_CHUNK_SIZE = 50

const SUBJECTS = [
  'Algebra',
  'BEST Writing',
  'Biology',
  'FAST Reading',
  'FCLE',
  'Geometry',
  'US History',
] as const

type ParsedRow = Record<string, string>

/** Resolve column name variations across different subject CSVs */
function getField(row: ParsedRow, ...keys: string[]): string {
  for (const k of keys) {
    if (row[k]?.trim()) return row[k].trim()
  }
  return ''
}

/** Auto-detect subject from course titles in parsed rows */
function detectSubject(rows: ParsedRow[]): string {
  const sample = rows.slice(0, 10).map(r => (r['Course Title'] ?? '').toLowerCase())
  if (sample.some(c => c.includes('algebra'))) return 'Algebra'
  if (sample.some(c => c.includes('geometry') || c.includes('mathematics 2'))) return 'Geometry'
  if (sample.some(c => c.includes('biology'))) return 'Biology'
  if (sample.some(c => c.includes('history'))) return 'US History'
  if (sample.some(c => c.includes('government'))) return 'FCLE'
  if (sample.some(c => c.includes('english') && !c.includes('writing'))) return 'FAST Reading'
  if (sample.some(c => c.includes('writing') || c.includes('aice english'))) return 'BEST Writing'
  return ''
}

type UploadState = 'idle' | 'parsing' | 'preview' | 'uploading' | 'done' | 'error'

export default function UploadPage() {
  const [state, setState] = useState<UploadState>('idle')
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [cycles, setCycles] = useState<TestCycle[]>([])
  const [selectedCycle, setSelectedCycle] = useState('')
  const [newCycleName, setNewCycleName] = useState('')
  const [newCycleDate, setNewCycleDate] = useState('')
  const [subject, setSubject] = useState('')
  const [error, setError] = useState('')
  const [uploaded, setUploaded] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState('')
  const [deleting, setDeleting] = useState(false)

  const progress = rows.length ? Math.round((uploaded / rows.length) * 100) : 0

  const teacherNames = useMemo(
    () => [...new Set(rows.map(r => r['Teacher Name']))],
    [rows]
  )

  const loadCycles = useCallback(async () => {
    const { data } = await supabase
      .from('test_cycles')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setCycles(data)
  }, [])

  useEffect(() => { loadCycles() }, [loadCycles])

  const handleDeleteCycle = async (id: string) => {
    setDeleting(true)
    await supabase.from('students').delete().eq('cycle_id', id)
    await supabase.from('test_cycles').delete().eq('id', id)
    setConfirmDelete('')
    setSelectedCycle('')
    await loadCycles()
    setDeleting(false)
  }

  const handleFile = useCallback((file: File) => {
    setState('parsing')
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const raw = results.data as string[][]

        const headerIdx = raw.findIndex(row =>
          row.some(cell => cell.trim() === 'Student ID')
        )
        if (headerIdx === -1) {
          setError('Could not find a header row with "Student ID" in the CSV.')
          setState('error')
          return
        }

        const headers = raw[headerIdx].map(h => h.trim())
        const dataRows = raw.slice(headerIdx + 1)
          .filter(row => row[headers.indexOf('Student ID')]?.trim())

        const mapped: ParsedRow[] = dataRows.map(row => {
          const obj: Record<string, string> = {}
          headers.forEach((h, i) => { obj[h] = row[i] ?? '' })
          return obj as unknown as ParsedRow
        })

        const detected = detectSubject(mapped)
        setSubject(detected)
        if (detected) {
          setNewCycleName(`${detected} — ${new Date().getFullYear()}`)
        }
        const firstDate = getField(mapped[0] ?? {}, 'TESTING DATE')
        if (firstDate) setNewCycleDate(firstDate)

        setRows(mapped)
        setState('preview')
        loadCycles()
      },
      error: (err) => {
        setError(err.message)
        setState('error')
      },
    })
  }, [loadCycles])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.name.endsWith('.csv')) handleFile(file)
  }

  const handleUpload = async () => {
    if (!selectedCycle && (!newCycleName || !newCycleDate || !subject)) {
      setError('Select an existing cycle or fill in cycle name, date, and subject.')
      return
    }
    setState('uploading')
    setUploaded(0)

    let cycleId = selectedCycle

    // Create new cycle if needed
    if (!cycleId) {
      const { data, error: cycleErr } = await supabase
        .from('test_cycles')
        .insert({ name: newCycleName, test_date: newCycleDate, subject, school_year: DEFAULT_SCHOOL_YEAR })
        .select()
        .single()
      if (cycleErr || !data) {
        setError('Failed to create test cycle: ' + cycleErr?.message)
        setState('error')
        return
      }
      cycleId = data.id
    }

    await supabase.from('students').delete().eq('cycle_id', cycleId)

    const mapRow = (r: ParsedRow) => {
      const ese = getField(r, 'ESE Exceptionality', 'ESE Exceptionality/504')
      const section504 = getField(r, 'Section 504')
      return {
        cycle_id:           cycleId,
        student_id:         getField(r, 'Student ID'),
        fleid:              getField(r, 'FLEID'),
        first_name:         getField(r, 'First Name'),
        last_name:          getField(r, 'Last Name'),
        middle_initial:     getField(r, 'Middle Initial') || null,
        grade:              parseInt(getField(r, 'Grade')) || 0,
        birth_date:         getField(r, 'Birth Date'),
        course_title:       getField(r, 'Course Title'),
        teacher_name:       getField(r, 'Teacher Name'),
        class_room:         getField(r, 'Room Number'),
        term:               getField(r, 'Term'),
        period:             parseInt(getField(r, 'Period')) || 0,
        student_language:   getField(r, 'Student Language'),
        esol_level:         getField(r, 'ESOL Level') ? parseInt(getField(r, 'ESOL Level')) || null : null,
        esol_exit_date:     getField(r, 'ESOL Exit Date') || null,
        ese_exceptionality: ese || (section504 === 'Y' ? '504' : null),
        testing_date:       getField(r, 'TESTING DATE'),
        testing_room:       getField(r, 'TESTING ROOM'),
      }
    }

    const chunks: ParsedRow[][] = []
    for (let i = 0; i < rows.length; i += INSERT_CHUNK_SIZE) {
      chunks.push(rows.slice(i, i + INSERT_CHUNK_SIZE))
    }

    const results = await Promise.all(
      chunks.map(async (chunk) => {
        const { error: insertErr } = await supabase
          .from('students')
          .insert(chunk.map(mapRow))
        return { count: chunk.length, error: insertErr }
      })
    )

    const failed = results.find(r => r.error)
    if (failed) {
      setError('Insert error: ' + failed.error!.message)
      setState('error')
      return
    }

    setUploaded(rows.length)
    setState('done')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-txt-primary mb-1">Upload Roster CSV</h2>
      <p className="text-sm text-txt-secondary mb-6">
        Export from your SIS in the same column format. Uploading to an existing cycle replaces all students in that cycle.
      </p>

      {/* Drop zone */}
      {(state === 'idle' || state === 'parsing') && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className="border-2 border-dashed border-surface-border rounded-xl p-12 text-center cursor-pointer hover:border-blue-600 transition-colors bg-surface-card"
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <p className="text-4xl mb-3">📂</p>
          <p className="text-txt-primary font-medium mb-1">
            {state === 'parsing' ? 'Parsing...' : 'Drop CSV here or click to browse'}
          </p>
          <p className="text-xs text-txt-tertiary">Accepts the standard SIS export format</p>
        </div>
      )}

      {/* Preview + cycle selection */}
      {state === 'preview' && (
        <div className="space-y-5">
          {/* Parsed summary */}
          <div className="rounded-[10px] border border-surface-border p-4 bg-surface-card">
            <p className="text-semantic-success font-semibold mb-1">✓ Parsed {rows.length} students</p>
            <p className="text-xs text-txt-secondary">
              {teacherNames.join(' · ')}
            </p>
            <p className="text-xs text-txt-secondary mt-1">
              ESOL: {rows.filter(r => getField(r, 'ESOL Level')).length} ·
              ESE/504: {rows.filter(r => getField(r, 'ESE Exceptionality', 'ESE Exceptionality/504')).length} ·
              Standard: {rows.filter(r => !getField(r, 'ESOL Level') && !getField(r, 'ESE Exceptionality', 'ESE Exceptionality/504')).length}
            </p>
            {subject && (
              <p className="text-xs text-txt-secondary mt-1">Detected subject: <span className="font-semibold text-txt-primary">{subject}</span></p>
            )}
          </div>

          {/* Cycle selection */}
          <div className="rounded-[10px] border border-surface-border p-4 space-y-4 bg-surface-card">
            <p className="text-sm font-medium text-txt-primary">Assign to test cycle</p>

            <div>
              <label className="text-xs text-txt-secondary block mb-1">Existing cycle</label>
              <select
                value={selectedCycle}
                onChange={e => setSelectedCycle(e.target.value)}
                className="w-full rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2"
              >
                <option value="">— create new —</option>
                {cycles.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.test_date})</option>
                ))}
              </select>
            </div>

            {!selectedCycle && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-txt-secondary block mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2"
                  >
                    <option value="">— select —</option>
                    {SUBJECTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-txt-secondary block mb-1">Cycle name</label>
                  <input
                    type="text"
                    placeholder="Algebra EOC — May 2026"
                    value={newCycleName}
                    onChange={e => setNewCycleName(e.target.value)}
                    className="w-full rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-txt-secondary block mb-1">Test date</label>
                  <input
                    type="text"
                    placeholder="May 15, Friday"
                    value={newCycleDate}
                    onChange={e => setNewCycleDate(e.target.value)}
                    className="w-full rounded bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview table — first 5 rows */}
          <div className="rounded-[10px] border border-surface-border overflow-hidden bg-surface-card">
            <p className="text-xs text-txt-secondary px-4 py-2 border-b border-surface-border">Preview — first 5 rows</p>
            <div className="overflow-x-auto">
              <table className="roster-table">
                <thead>
                  <tr>
                    <th>Student ID</th><th>Last Name</th><th>First Name</th>
                    <th>Grade</th><th>Teacher</th><th>Testing Room</th><th>ESOL</th><th>ESE</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((r, i) => (
                    <tr key={i}>
                      <td className="font-mono text-xs text-txt-tertiary">{getField(r, 'Student ID')}</td>
                      <td className="font-medium text-txt-primary">{getField(r, 'Last Name')}</td>
                      <td>{getField(r, 'First Name')}</td>
                      <td className="text-center">{getField(r, 'Grade')}</td>
                      <td className="text-xs">{getField(r, 'Teacher Name').split(' ')[0]}</td>
                      <td className="text-xs">{getField(r, 'TESTING ROOM') || '—'}</td>
                      <td className="text-center">{getField(r, 'ESOL Level') || '—'}</td>
                      <td className="text-center">{getField(r, 'ESE Exceptionality', 'ESE Exceptionality/504') || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {error && <p className="text-semantic-error text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              className="px-6 py-2.5 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white font-semibold text-sm transition-colors"
            >
              Upload {rows.length} Students →
            </button>
            <button
              onClick={() => { setState('idle'); setRows([]); setError('') }}
              className="px-4 py-2.5 rounded-lg border border-surface-border text-txt-secondary hover:text-txt-primary text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Uploading */}
      {state === 'uploading' && (
        <div className="rounded-[10px] border border-surface-border p-8 text-center bg-surface-card">
          <p className="text-txt-primary font-medium mb-4">Uploading {uploaded} / {rows.length} students...</p>
          <div className="w-full bg-surface-border rounded-full h-2 mb-2">
            <div
              className="bg-brand-navy h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-txt-secondary">{progress}%</p>
        </div>
      )}

      {/* Done */}
      {state === 'done' && (
        <div className="rounded-[10px] border border-emerald-200 p-8 text-center bg-surface-card">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-semantic-success font-semibold text-lg mb-1">{uploaded} students uploaded</p>
          <p className="text-sm text-txt-secondary mb-6">All views are now live with this data.</p>
          <div className="flex gap-3 justify-center">
            <a href="/dashboard" className="px-5 py-2 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white text-sm font-medium transition-colors">
              Go to Dashboard →
            </a>
            <button
              onClick={() => { setState('idle'); setRows([]); setUploaded(0) }}
              className="px-5 py-2 rounded-lg border border-surface-border text-txt-secondary hover:text-txt-primary text-sm transition-colors"
            >
              Upload Another
            </button>
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="rounded-[10px] border border-red-200 p-6 bg-surface-card">
          <p className="text-semantic-error font-semibold mb-2">Upload failed</p>
          <p className="text-sm text-txt-secondary mb-4">{error}</p>
          <button
            onClick={() => { setState('idle'); setError('') }}
            className="px-4 py-2 rounded border border-surface-border text-txt-secondary hover:text-txt-primary text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Manage existing cycles */}
      {cycles.length > 0 && (
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-txt-primary mb-3">Manage Test Cycles</h3>
          <div className="rounded-[10px] border border-surface-border overflow-hidden bg-surface-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border text-xs text-txt-tertiary">
                  <th className="text-left px-4 py-2 font-medium">Cycle</th>
                  <th className="text-left px-4 py-2 font-medium">Subject</th>
                  <th className="text-left px-4 py-2 font-medium">Date</th>
                  <th className="text-right px-4 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {cycles.map(c => (
                  <tr key={c.id} className="border-b border-surface-border last:border-0">
                    <td className="px-4 py-2.5 text-txt-primary">{c.name}</td>
                    <td className="px-4 py-2.5 text-txt-secondary">{c.subject}</td>
                    <td className="px-4 py-2.5 text-txt-secondary">{c.test_date}</td>
                    <td className="px-4 py-2.5 text-right">
                      {confirmDelete === c.id ? (
                        <span className="flex items-center justify-end gap-2">
                          <span className="text-xs text-semantic-error">Delete all students?</span>
                          <button
                            onClick={() => handleDeleteCycle(c.id)}
                            disabled={deleting}
                            className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            {deleting ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setConfirmDelete('')}
                            className="px-3 py-1 rounded border border-surface-border text-txt-secondary text-xs hover:text-txt-primary transition-colors"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(c.id)}
                          className="px-3 py-1 rounded border border-red-300 text-red-400 hover:text-red-300 hover:border-red-400 text-xs transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
