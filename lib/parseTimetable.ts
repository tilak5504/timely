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

const DAY_ROWS: [string, number, number][] = [
  ['Monday', 3, 4],
  ['Tuesday', 5, 6],
  ['Wednesday', 7, 8],
  ['Thursday', 9, 10],
  ['Friday', 11, 12],
  ['Saturday', 13, 14],
]

const SLOTS: [string, string, number[]][] = [
  ['09:30', '11:00', [1, 2, 3]],
  ['11:15', '12:45', [4, 5, 6]],
  ['13:45', '15:15', [8, 9, 10]],
  ['15:30', '17:00', [11, 12, 13]],
]

function isRoomLine(line: string): boolean {
  return /^L\d/i.test(line) || /floor/i.test(line)
}

function isFacultyLine(line: string): boolean {
  return /^(Dr|Prof)\b/i.test(line)
}

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
  const rest = cleanLines.slice(1)

  const divMatch = subjectDivLine.match(/Div\s*-?\s*([A-E])\s*(\d)?/i)
  let divisionCode = divMatch ? (divMatch[1] + (divMatch[2] ?? '')).toUpperCase() : null
  let subject = subjectDivLine.split(/-?\s*Div/i)[0].trim().replace(/-$/, '').trim()

  // Fallback: trailing lone section letter with no "Div" keyword (e.g. "GP Lab B")
  if (!divisionCode) {
    const trailingMatch = subject.match(/\b([A-E])$/)
    if (trailingMatch) {
      divisionCode = trailingMatch[1]
      subject = subject.slice(0, trailingMatch.index).trim().replace(/-$/, '').trim()
    }
  }

  // Classify remaining lines as room vs faculty by their content, not fixed position
  let room: string | null = null
  let faculty: string | null = null
  for (const line of rest) {
    if (isRoomLine(line) && room === null) {
      room = line
    } else if (isFacultyLine(line) && faculty === null) {
      faculty = line
    }
  }
  if (room === null && rest.length > 0) {
    room = rest[rest.length - 1]
  }
  if (faculty === null && rest.length >= 2) {
    faculty = rest[0] !== room ? rest[0] : rest[1] ?? 'TBA'
  }
  if (faculty === null) {
    faculty = 'TBA'
  }

  const isMcDivision = divisionCode !== null && /\d/.test(divisionCode)

  return {
    subject,
    section: isMcDivision ? null : divisionCode,
    mcDivision: isMcDivision ? divisionCode : null,
    faculty,
    room: room ?? 'TBA',
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

export function detectWeekLabel(filename: string): string {
  const match = filename.match(/(\d{2})[._](\d{2})[._](\d{4})\D+(\d{2})[._](\d{2})[._](\d{4})/)
  if (match) {
    const [, d1, m1, y1, d2, m2, y2] = match
    return `${d1}/${m1}/${y1} - ${d2}/${m2}/${y2}`
  }
  return 'Unknown week'
}
