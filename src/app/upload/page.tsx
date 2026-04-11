'use client'
import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { supabase } from '@/lib/supabase'
import { TestCycle } from '@/types'

interface ParsedRow {
  'Student ID': string
  'FLEID': string
  'Grade': string
  'First Name': string
  'Last Name': string
  'Middle Initial': string
  'Birth Date': string
  'Course Title': string
  'Teacher Name': string
  'Room Number': string
  'Term': string
  'Period': string
  'Student Language': string
  'ESOL Level': string
  'ESOL Exit Date': string
  'ESE Exceptionality': string
  'TESTING DATE': string
  'TESTING ROOM': string
}

type UploadState = 'idle' | 'parsing' | 'preview' | 'uploading' | 'done' | 'error'

export default function UploadPage() {
  const [state, setState] = useState<UploadState>('idle')
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [cycles, setCycles] = useState<TestCycle[]>([])
  const [selectedCycle, setSelectedCycle] = useState('')
  const [newCycleName, setNewCycleName] = useState('')
  const [newCycleDate, setNewCycleDate] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [uploaded, setUploaded] = useState(0)

  const loadCycles = useCallback(async () => {
    const { data } = await supabase
      .from('test_cycles')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setCycles(data)
  }, [])

  const handleFile = (file: File) => {
    setState('parsing')
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const raw = results.data as string[][]

        // Find the real header row (first row containing "Student ID")
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

        const mapped: ParsedRow[] = dataRows
          .map(row => {
            const obj: Record<string, string> = {}
            headers.forEach((h, i) => { obj[h] = row[i] ?? '' })
            return obj as unknown as ParsedRow
          })
          .filter(r => r['Student ID']?.trim())

        setRows(mapped)
        setState('preview')
        loadCycles()
      },
      error: (err) => {
        setError(err.message)
        setState('error')
      },
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.name.endsWith('.csv')) handleFile(file)
  }

  const handleUpload = async () => {
    if (!selectedCycle && (!newCycleName || !newCycleDate)) {
      setError('Select an existing cycle or enter a new cycle name and date.')
      return
    }
    setState('uploading')
    setProgress(0)

    let cycleId = selectedCycle

    // Create new cycle if needed
    if (!cycleId) {
      const { data, error: cycleErr } = await supabase
        .from('test_cycles')
        .insert({ name: newCycleName, test_date: newCycleDate, subject: 'Biology', school_year: '2025-2026' })
        .select()
        .single()
      if (cycleErr || !data) {
        setError('Failed to create test cycle: ' + cycleErr?.message)
        setState('error')
        return
      }
      cycleId = data.id
    }

    // Delete existing students for this cycle before re-upload
    await supabase.from('students').delete().eq('cycle_id', cycleId)

    // Batch insert in chunks of 50
    const CHUNK = 50
    let inserted = 0
    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK).map(r => ({
        cycle_id:           cycleId,
        student_id:         r['Student ID']?.trim() ?? '',
        fleid:              r['FLEID']?.trim() ?? '',
        first_name:         r['First Name']?.trim() ?? '',
        last_name:          r['Last Name']?.trim() ?? '',
        middle_initial:     r['Middle Initial']?.trim() || null,
        grade:              parseInt(r['Grade']) || 0,
        birth_date:         r['Birth Date']?.trim() ?? '',
        course_title:       r['Course Title']?.trim() ?? '',
        teacher_name:       r['Teacher Name']?.trim() ?? '',
        class_room:         r['Room Number']?.trim() ?? '',
        term:               r['Term']?.trim() ?? '',
        period:             parseInt(r['Period']) || 0,
        student_language:   r['Student Language']?.trim() ?? '',
        esol_level:         r['ESOL Level'] ? parseInt(r['ESOL Level']) || null : null,
        esol_exit_date:     r['ESOL Exit Date']?.trim() || null,
        ese_exceptionality: r['ESE Exceptionality']?.trim() || null,
        testing_date:       r['TESTING DATE']?.trim() ?? '',
        testing_room:       r['TESTING ROOM']?.trim() ?? '',
      }))

      const { error: insertErr } = await supabase.from('students').insert(chunk)
      if (insertErr) {
        setError('Insert error: ' + insertErr.message)
        setState('error')
        return
      }
      inserted += chunk.length
      setUploaded(inserted)
      setProgress(Math.round((inserted / rows.length) * 100))
    }

    setState('done')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-white mb-1">Upload Roster CSV</h2>
      <p className="text-sm text-slate-400 mb-6">
        Export from your SIS in the same column format. Uploading to an existing cycle replaces all students in that cycle.
      </p>

      {/* Drop zone */}
      {(state === 'idle' || state === 'parsing') && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className="border-2 border-dashed border-blue-800 rounded-xl p-12 text-center cursor-pointer hover:border-blue-600 transition-colors"
          style={{ background: '#131E2B' }}
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
          <p className="text-white font-medium mb-1">
            {state === 'parsing' ? 'Parsing...' : 'Drop CSV here or click to browse'}
          </p>
          <p className="text-xs text-slate-500">Accepts the standard SIS export format</p>
        </div>
      )}

      {/* Preview + cycle selection */}
      {state === 'preview' && (
        <div className="space-y-5">
          {/* Parsed summary */}
          <div className="rounded-lg border border-blue-900/40 p-4" style={{ background: '#131E2B' }}>
            <p className="text-green-400 font-semibold mb-1">✓ Parsed {rows.length} students</p>
            <p className="text-xs text-slate-400">
              {[...new Set(rows.map(r => r['Teacher Name']))].join(' · ')}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              ESOL: {rows.filter(r => r['ESOL Level']).length} ·
              ESE/504: {rows.filter(r => r['ESE Exceptionality']).length} ·
              Standard: {rows.filter(r => !r['ESOL Level'] && !r['ESE Exceptionality']).length}
            </p>
          </div>

          {/* Cycle selection */}
          <div className="rounded-lg border border-blue-900/40 p-4 space-y-4" style={{ background: '#131E2B' }}>
            <p className="text-sm font-medium text-white">Assign to test cycle</p>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Existing cycle</label>
              <select
                value={selectedCycle}
                onChange={e => setSelectedCycle(e.target.value)}
                className="w-full rounded bg-slate-800 border border-slate-600 text-white text-sm px-3 py-2"
              >
                <option value="">— create new —</option>
                {cycles.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.test_date})</option>
                ))}
              </select>
            </div>

            {!selectedCycle && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">New cycle name</label>
                  <input
                    type="text"
                    placeholder="Biology EOC — May 2026"
                    value={newCycleName}
                    onChange={e => setNewCycleName(e.target.value)}
                    className="w-full rounded bg-slate-800 border border-slate-600 text-white text-sm px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Test date</label>
                  <input
                    type="text"
                    placeholder="May 15, Friday"
                    value={newCycleDate}
                    onChange={e => setNewCycleDate(e.target.value)}
                    className="w-full rounded bg-slate-800 border border-slate-600 text-white text-sm px-3 py-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview table — first 5 rows */}
          <div className="rounded-lg border border-blue-900/40 overflow-hidden" style={{ background: '#131E2B' }}>
            <p className="text-xs text-slate-400 px-4 py-2 border-b border-blue-900/40">Preview — first 5 rows</p>
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
                      <td className="font-mono text-xs text-slate-400">{r['Student ID']}</td>
                      <td className="font-medium text-white">{r['Last Name']}</td>
                      <td>{r['First Name']}</td>
                      <td className="text-center">{r['Grade']}</td>
                      <td className="text-xs">{r['Teacher Name']?.split(' ')[0]}</td>
                      <td className="text-xs">{r['TESTING ROOM']}</td>
                      <td className="text-center">{r['ESOL Level'] || '—'}</td>
                      <td className="text-center">{r['ESE Exceptionality'] || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              className="px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-semibold text-sm transition-colors"
            >
              Upload {rows.length} Students →
            </button>
            <button
              onClick={() => { setState('idle'); setRows([]); setError('') }}
              className="px-4 py-2.5 rounded-lg border border-slate-600 text-slate-400 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Uploading */}
      {state === 'uploading' && (
        <div className="rounded-lg border border-blue-900/40 p-8 text-center" style={{ background: '#131E2B' }}>
          <p className="text-white font-medium mb-4">Uploading {uploaded} / {rows.length} students...</p>
          <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">{progress}%</p>
        </div>
      )}

      {/* Done */}
      {state === 'done' && (
        <div className="rounded-lg border border-green-800/40 p-8 text-center" style={{ background: '#131E2B' }}>
          <p className="text-4xl mb-3">✅</p>
          <p className="text-green-400 font-semibold text-lg mb-1">{rows.length} students uploaded</p>
          <p className="text-sm text-slate-400 mb-6">All views are now live with this data.</p>
          <div className="flex gap-3 justify-center">
            <a href="/dashboard" className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium transition-colors">
              Go to Dashboard →
            </a>
            <button
              onClick={() => { setState('idle'); setRows([]); setProgress(0); setUploaded(0) }}
              className="px-5 py-2 rounded-lg border border-slate-600 text-slate-400 hover:text-white text-sm transition-colors"
            >
              Upload Another
            </button>
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="rounded-lg border border-red-800/40 p-6" style={{ background: '#131E2B' }}>
          <p className="text-red-400 font-semibold mb-2">Upload failed</p>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => { setState('idle'); setError('') }}
            className="px-4 py-2 rounded border border-slate-600 text-slate-400 hover:text-white text-sm"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
