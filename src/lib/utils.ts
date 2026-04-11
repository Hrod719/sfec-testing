import {
  Student,
  StudentWithMeta,
  EsolStatus,
  LANGUAGE_MAP,
  ESE_MAP,
} from '@/types'

export function getAccommodationGroup(student: Student): string {
  const hasEsol = student.esol_level !== null
  const hasEse = student.ese_exceptionality !== null
  if (hasEsol && hasEse) return `ESOL Lvl ${student.esol_level} + ${student.ese_exceptionality}`
  if (hasEsol) return `ESOL Level ${student.esol_level}`
  if (hasEse) return `ESE — ${ESE_MAP[student.ese_exceptionality!] ?? student.ese_exceptionality}`
  return 'Standard'
}

export function getEsolStatus(student: Student): EsolStatus {
  if (!student.esol_level) return 'not-esol'
  if (!student.esol_exit_date) return 'no-exit-date'
  try {
    const exit = new Date(student.esol_exit_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = Math.floor((exit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return 'past-exit'
    if (diff <= 30) return 'exiting-soon'
    if (diff <= 90) return 'exiting-quarter'
    return 'active'
  } catch {
    return 'no-exit-date'
  }
}

export function getDaysUntilExit(student: Student): number | null {
  if (!student.esol_exit_date) return null
  try {
    const exit = new Date(student.esol_exit_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Math.floor((exit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  } catch {
    return null
  }
}

export function enrichStudent(student: Student): StudentWithMeta {
  return {
    ...student,
    accommodationGroup: getAccommodationGroup(student),
    languageFull: LANGUAGE_MAP[student.student_language] ?? student.student_language,
    esolStatus: getEsolStatus(student),
    daysUntilExit: getDaysUntilExit(student),
    eseDescription: student.ese_exceptionality
      ? (ESE_MAP[student.ese_exceptionality] ?? student.ese_exceptionality)
      : '',
  }
}

export function getStudentFullName(student: Student): string {
  const mi = student.middle_initial ? ` ${student.middle_initial}.` : ''
  return `${student.last_name}, ${student.first_name}${mi}`
}

export function esolStatusLabel(status: EsolStatus): string {
  switch (status) {
    case 'no-exit-date':     return '⚠ No Exit Date'
    case 'past-exit':        return 'Past Exit Date'
    case 'exiting-soon':     return 'Exiting Soon'
    case 'exiting-quarter':  return 'Exiting This Quarter'
    case 'active':           return 'Active ESOL'
    case 'not-esol':         return '—'
  }
}

export function esolStatusColor(status: EsolStatus): string {
  switch (status) {
    case 'no-exit-date':     return 'text-red-700 font-semibold'
    case 'past-exit':        return 'text-orange-700 font-semibold'
    case 'exiting-soon':     return 'text-amber-700 font-semibold'
    case 'exiting-quarter':  return 'text-yellow-700 font-semibold'
    case 'active':           return 'text-green-700'
    case 'not-esol':         return 'text-gray-400'
  }
}

export function accommodationBadgeClass(group: string): string {
  if (group.includes('ESOL') && group.includes('+')) return 'bg-amber-100 text-amber-800 badge-print'
  if (group.includes('ESOL')) return 'bg-blue-100 text-blue-800 badge-print'
  if (group.includes('504')) return 'bg-red-100 text-red-800 badge-print'
  if (group.includes('ESE')) return 'bg-violet-100 text-violet-800 badge-print'
  return 'bg-emerald-100 text-emerald-800 badge-print'
}
