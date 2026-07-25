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

const DAY_MAP: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

function looksLikeTimeHeader(v: any): boolean {
  return !!v && /\d{1,2}[:.]\d{2}/.test(String(v))
}

function parseTimeToken(tok: string): [number, number, string | null] | null {
  const m = tok.trim().match(/(\d{1,2})[:.](\d{2})\s*(am|pm)?/i)
  if (!m) return null
  return [parseInt(m[1]), parseInt(m[2]), m[3] ? m[3].toLowerCase() : null]
}

function to24(h: number, mi: number, ap: string | null): string {
  if (ap === 'pm' && h !== 12) h += 12
  if (ap === 'am' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`
}

function parseHeaderRange(text: string): [string, string] | null {
  const toks = String(text).match(/\d{1,2}[:.]\d{2}\s*(?:am|pm)?/gi)
  if (!toks || toks.length < 2) return null
  const t1 = parseTimeToken(toks[0])
  const t2 = parseTimeToken(toks[1])
  if (!t1 || !t2) return null
  if (t1[2] === null) t1[2] = t2[2]
  if (t2[2] === null) t2[2] = t1[2]
  return [to24(t1[0], t1[1], t1[2]), to24(t2[0], t2[1], t2[2])]
}

function isRoomLine(line: string): boolean {
  return /^L\d/i.test(line) || /floor/i.test(line)
}

function isFacultyLine(line: string): boolean {
  return /^(Dr|Prof)\b/i.test(line)
}

function parseCell(raw: string): Omit<ParsedClass, 'day' | 'startTime' | 'endTime'> | null {
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return null

  const rescheduled = lines.some((l) => /resched/i.test(l))
  const cleanLines = lines.filter((l) => !/resched/i.test(l))
  if (cleanLines.length < 2) return null

  const subjectDivLine = cleanLines[0]
  const rest = cleanLines.slice(1)

  const divMatch = subjectDivLine.match(/Div\s*-?\s*([A-E])\s*(\d)?/i)
  let divisionCode = divMatch ? (divMatch[1] + (divMatch[2] ?? '')).toUpperCase() : null
  let subject = subjectDivLine.split(/-?\s*Div/i)[0].trim().replace(/-$/, '').trim()

  if (!divisionCode) {
    const trailingMatch = subject.match(/\b([A-E])$/)
    if (trailingMatch) {
      divisionCode = trailingMatch[1]
      subject = subject.slice(0, trailingMatch.index).trim().replace(/-$/, '').trim()
    }
  }

  let room: string | null = null
  let faculty: string | null = null
  for (const line of rest) {
    if (isRoomLine(line) && room === null) room = line
    else if (isFacultyLine(line) && faculty === null) faculty = line
  }
  if (room === null && rest.length > 0) room = rest[rest.length - 1]
  if (faculty === null && rest.length >= 2) faculty = rest[0] !== room ? rest[0] : rest[1] ?? 'TBA'
  if (faculty === null) faculty = 'TBA'

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

  // Find the header row (contains 3+ time-range-looking cells)
  let headerRowIdx = -1
  for (let i = 0; i < rows.length; i++) {
    const count = (rows[i] || []).filter(looksLikeTimeHeader).length
    if (count >= 3) {
      headerRowIdx = i
      break
    }
  }
  if (headerRowIdx === -1) return []

  const headerRow = rows[headerRowIdx]
  const slotStarts: { col: number; start: string; end: string }[] = []
  headerRow.forEach((v, c) => {
    if (looksLikeTimeHeader(v)) {
      const r = parseHeaderRange(v)
      if (r) slotStarts.push({ col: c, start: r[0], end: r[1] })
    }
  })

  let lastUsedCol = 0
  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i] || []
    row.forEach((v, c) => {
      if (v && String(v).trim()) lastUsedCol = Math.max(lastUsedCol, c)
    })
  }

  const slotRanges = slotStarts.map((s, i) => {
    const nextCol = i + 1 < slotStarts.length ? slotStarts[i + 1].col : lastUsedCol + 1
    const cols: number[] = []
    for (let c = s.col; c < nextCol; c++) cols.push(c)
    return { start: s.start, end: s.end, cols }
  })

  // Find day row blocks by scanning column A, using merged-cell spans where available
  const merges = sheet['!merges'] || []
  const dayBlocks: { day: string; rows: number[] }[] = []
  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const cellA = rows[i]?.[0]
    if (!cellA) continue
    const key = String(cellA).trim().toLowerCase().slice(0, 3)
    if (!(key in DAY_MAP)) continue

    let spanRows = [i]
    const merge = merges.find((m: any) => m.s.c === 0 && m.s.r === i)
    if (merge) {
      spanRows = []
      for (let r = merge.s.r; r <= merge.e.r; r++) spanRows.push(r)
    }
    dayBlocks.push({ day: DAY_MAP[key], rows: spanRows })
  }

  const entries: ParsedClass[] = []
  for (const { day, rows: rowIndices } of dayBlocks) {
    for (const { start, end, cols } of slotRanges) {
      for (const rowIndex of rowIndices) {
        const row = rows[rowIndex]
        if (!row) continue
        for (const colIndex of cols) {
          const cellValue = row[colIndex]
          if (cellValue && String(cellValue).trim()) {
            const parsed = parseCell(String(cellValue))
            if (parsed) {
              entries.push({ day, startTime: start, endTime: end, ...parsed })
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
