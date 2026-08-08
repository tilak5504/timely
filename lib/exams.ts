export interface ExamEntry {
  id: string
  subject: string
  date: string // YYYY-MM-DD
  startTime: string // 24hr HH:MM
  endTime: string
  mode: string
  notes?: string
}

export const EXAMS: ExamEntry[] = [
  {
    id: 'genai-quiz',
    subject: 'Gen AI Course Quiz',
    date: '2026-08-11',
    startTime: '22:00',
    endTime: '22:15',
    mode: 'Online',
    notes: 'Quiz link will be shared via Outlook Forms prior to the assessment.',
  },
  {
    id: 'microecon-test',
    subject: 'Micro Economics Test',
    date: '2026-08-12',
    startTime: '17:00',
    endTime: '17:45',
    mode: 'Pen and paper',
  },
  {
    id: 'faa-test',
    subject: 'Financial Accounting and Analysis Test',
    date: '2026-08-13',
    startTime: '17:00',
    endTime: '17:45',
    mode: 'Pen and paper',
    notes: 'Time not officially confirmed — likely 5:00-5:45 PM.',
  },
  {
    id: 'sidm-test-2',
    subject: 'SIDM Test-2',
    date: '2026-08-19',
    startTime: '17:00',
    endTime: '17:30',
    mode: 'Pen and paper',
  },
]

export function getUpcomingExams(from: Date = new Date()): ExamEntry[] {
  return EXAMS.filter((e) => {
    const examDateTime = new Date(`${e.date}T${e.endTime}:00`)
    return examDateTime >= from
  }).sort((a, b) => {
    const aTime = new Date(`${a.date}T${a.startTime}:00`).getTime()
    const bTime = new Date(`${b.date}T${b.startTime}:00`).getTime()
    return aTime - bTime
  })
}

export function formatExamDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function formatExamTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}
