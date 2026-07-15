import * as XLSX from 'xlsx'

export interface ParsedClass {
  day: string
  startTime: string
  endTime: string
  subject: string
  section: string | null
  mcDivision: string | null
  faculty: string
  room: string
  rescheduled: boolean
}

// Day names line up with fixed row pairs in the timetable sheet
const DAY_ROWS: [string, number, number][] = [
  ['Monday', 3, 4],
  ['Tuesday', 5, 6],
  ['Wednesday', 7, 8],
  ['Thursday', 9, 10],
  ['Friday', 11, 12],
  ['Saturday', 13, 14],
]

// Each time slot maps to 3 columns (0-indexed) where parallel classes are listed
const SLOTS: [string, string, number[]][] = [
  ['08:30', '10:00', [1, 2]],
  ['09:30', '11:00', [3, 4, 5]],
  ['11:15', '12:45', [6, 7, 8]],
  ['13:45', '15:15', [10, 11, 12]],
  ['15:30', '17:00', [13, 14]],
]

function parseCell(raw: string): Omit<ParsedClass, 'day' | 'startTime' | 'endTime'> | null {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return null

  const rescheduled = lines.some((l) => /resched/i.test(l))
  const cleanLines = lines.filter((l) => !/resched/i.test(l))
  if (cleanLines.length < 2) return null

  const subjectDivLine = cleanLines[0]
  const room = cleanLines[cleanLines.length - 1]
  const faculty = cleanLines.length >= 3 ? cleanLines[1] : 'TBA'

  const divMatch = subjectDivLine.match(/Div\s*-?\s*([A-E])\s*-?\s*(\d)?/i)
  const divisionCode = divMatch ? (divMatch[1] + (divMatch[2] ?? '')).toUpperCase() : null
  const subject = subjectDivLine.split(/-?\s*Div/i)[0].trim().replace(/-$/, '').trim()

  // MC-I classes are scheduled per MC Division (e.g. A1, A2)
  // Everything else is scheduled per whole Section (e.g. A)
  const isMcDivision = divisionCode !== null && /\d/.test(divisionCode)

  return {
    subject,
    section: isMcDivision ? null : divisionCode,
    mcDivision: isMcDivision ? divisionCode : null,
    faculty,
    room,
    rescheduled,
  }
}

export function parseTimetableFile(fileBuffer: ArrayBuffer): ParsedClass[] {
  const workbook = XLSX.read(fileBuffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false })

  const entries: ParsedClass[] = []

  for (const [day, row1, row2] of DAY_ROWS) {
    for (const [startTime, endTime, cols] of SLOTS) {
      for (const rowIndex of [row1, row2]) {
        const row = rows[rowIndex]
        if (!row) continue
        for (const colIndex of cols) {
          const cellValue = row[colIndex]
          if (cellValue && String(cellValue).trim()) {
            const parsed = parseCell(String(cellValue))
            if (parsed) {
              entries.push({ day, startTime, endTime, ...parsed })
            }
          }
        }
      }
    }
  }

  return entries
}

// Tries to detect a week label from the filename, e.g. "06_07_2026_to_12_07_2026.xlsx"
export function detectWeekLabel(filename: string): string {
  const match = filename.match(/(\d{2})[._](\d{2})[._](\d{4})\D+(\d{2})[._](\d{2})[._](\d{4})/)
  if (match) {
    const [, d1, m1, y1, d2, m2, y2] = match
    return `${d1}/${m1}/${y1} - ${d2}/${m2}/${y2}`
  }
  return 'Unknown week'
}

// Given a weekLabel like "06/07/2026 - 12/07/2026", returns its start/end dates
export function parseWeekRange(weekLabel: string): { start: Date; end: Date } | null {
  const match = weekLabel.match(/(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{2})\/(\d{2})\/(\d{4})/)
  if (!match) return null
  const [, d1, m1, y1, d2, m2, y2] = match
  const start = new Date(Number(y1), Number(m1) - 1, Number(d1))
  const end = new Date(Number(y2), Number(m2) - 1, Number(d2), 23, 59, 59)
  return { start, end }
}

// Picks the week label that actually contains today's date.
// Falls back to the most recent past week, or the nearest future week, if no exact match.
export function pickCurrentWeekLabel(weekLabels: string[]): string | null {
  if (weekLabels.length === 0) return null
  const today = new Date()

  const parsed = weekLabels
    .map((label) => ({ label, range: parseWeekRange(label) }))
    .filter((w) => w.range !== null) as { label: string; range: { start: Date; end: Date } }[]

  const exactMatch = parsed.find((w) => today >= w.range.start && today <= w.range.end)
  if (exactMatch) return exactMatch.label

  // No exact match (e.g. gap between uploads) — pick the most recent week that already started
  const pastWeeks = parsed.filter((w) => w.range.start <= today)
  if (pastWeeks.length > 0) {
    pastWeeks.sort((a, b) => b.range.start.getTime() - a.range.start.getTime())
    return pastWeeks[0].label
  }

  // Everything is in the future — pick the nearest upcoming week
  parsed.sort((a, b) => a.range.start.getTime() - b.range.start.getTime())
  return parsed[0]?.label ?? weekLabels[0]
}