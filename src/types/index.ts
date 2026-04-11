export interface TestCycle {
  id: string
  name: string
  test_date: string
  subject: string
  school_year: string
  created_at: string
}

export interface Student {
  id: string
  cycle_id: string
  student_id: string
  fleid: string
  first_name: string
  last_name: string
  middle_initial: string | null
  grade: number
  birth_date: string
  course_title: string
  teacher_name: string
  class_room: string
  term: string
  period: number
  student_language: string
  esol_level: number | null
  esol_exit_date: string | null
  ese_exceptionality: string | null
  testing_date: string
  testing_room: string
  created_at: string
}

export type EsolStatus =
  | 'no-exit-date'
  | 'past-exit'
  | 'exiting-soon'
  | 'exiting-quarter'
  | 'active'
  | 'not-esol'

export interface StudentWithMeta extends Student {
  accommodationGroup: string
  languageFull: string
  esolStatus: EsolStatus
  daysUntilExit: number | null
  eseDescription: string
}

export const LANGUAGE_MAP: Record<string, string> = {
  SP: 'Spanish',
  EN: 'English',
  PR: 'Portuguese',
  AR: 'Arabic',
  CH: 'Chinese',
  TB: 'Tagalog/Bengali',
}

export const ESE_MAP: Record<string, string> = {
  K: 'Specific Learning Disability',
  J: 'Emotionally Disturbed',
  V: 'Speech/Language Impaired',
  P: 'Other Health Impaired',
  '504': 'Section 504 Plan',
}

export const TESTING_ROOMS = [
  '101',
  '102',
  '177',
  'Media Center Center',
  'Media Center Left',
  'Media Center Right',
]

export const ROOM_COLORS: Record<string, { bg: string; text: string; light: string }> = {
  '101':                  { bg: '#2C3E50', text: '#FFFFFF', light: '#D5DBDB' },
  '102':                  { bg: '#34495E', text: '#FFFFFF', light: '#D5DBDB' },
  '177':                  { bg: '#1A5276', text: '#FFFFFF', light: '#D6EAF8' },
  'Media Center Center':  { bg: '#1E8449', text: '#FFFFFF', light: '#D5F5E3' },
  'Media Center Left':    { bg: '#935116', text: '#FFFFFF', light: '#FDEBD0' },
  'Media Center Right':   { bg: '#922B21', text: '#FFFFFF', light: '#F9EBEA' },
}
