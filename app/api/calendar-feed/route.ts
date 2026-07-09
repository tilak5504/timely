import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

const DAY_OFFSETS: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}

function nextDateForDay(day: string): Date {
  const today = new Date()
  const todayDay = today.getDay()
  const targetDay = DAY_OFFSETS[day]
  let diff = targetDay - todayDay
  if (diff < 0) diff += 7
  const result = new Date(today)
  result.setDate(today.getDate() + diff)
  return result
}

function toIcsDateTime(day: string, time: string) {
  const date = nextDateForDay(day)
  const [h, m] = time.split(':').map(Number)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const dayOfMonth = String(date.getDate()).padStart(2, '0')
  const hh = String(h).padStart(2, '0')
  const mm = String(m).padStart(2, '0')
  return `${year}${month}${dayOfMonth}T${hh}${mm}00`
}

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get('section')
  const mcDivision = req.nextUrl.searchParams.get('mcDivision')

  if (!section || !mcDivision) {
    return NextResponse.json({ error: 'Missing section or mcDivision' }, { status: 400 })
  }

  const { data: latestWeek } = await supabaseAdmin
    .from('timetable_entries')
    .select('week_label')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  let classes: any[] = []
  if (latestWeek) {
    const { data } = await supabaseAdmin
      .from('timetable_entries')
      .select('*')
      .eq('week_label', latestWeek.week_label)
      .or(`section.eq.${section},mc_division.eq.${mcDivision}`)
    classes = data || []
  }

  const events = classes
    .map((cls) => {
      const start = toIcsDateTime(cls.day, cls.start_time)
      const end = toIcsDateTime(cls.day, cls.end_time)
      return [
        'BEGIN:VEVENT',
        `UID:${cls.id}@timely`,
        `DTSTART;TZID=Asia/Kolkata:${start}`,
        `DTEND;TZID=Asia/Kolkata:${end}`,
        `SUMMARY:${cls.subject}${cls.rescheduled ? ' (Rescheduled)' : ''}`,
        `LOCATION:${cls.room}`,
        `DESCRIPTION:Faculty: ${cls.faculty}`,
        'END:VEVENT',
      ].join('\r\n')
    })
    .join('\r\n')

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Timely//Timetable//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Kolkata',
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0530',
    'TZOFFSETTO:+0530',
    'TZNAME:IST',
    'END:STANDARD',
    'END:VTIMEZONE',
    events,
    'END:VCALENDAR',
  ].join('\r\n')

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="timely.ics"',
    },
  })
}