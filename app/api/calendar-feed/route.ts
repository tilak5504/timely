import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

const DAY_OFFSET_FROM_MONDAY: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
}

function getWeekMonday(weekLabel: string): Date {
  const [startPart] = weekLabel.split(' - ')
  const [d, m, y] = startPart.split('/').map(Number)
  return new Date(y, m - 1, d)
}

function toIcsDateTime(weekLabel: string, day: string, time: string) {
  const monday = getWeekMonday(weekLabel)
  const offset = DAY_OFFSET_FROM_MONDAY[day] ?? 0
  const date = new Date(monday)
  date.setDate(monday.getDate() + offset)

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
  const deviceId = req.nextUrl.searchParams.get('deviceId')

  if (!section || !mcDivision) {
    return NextResponse.json({ error: 'Missing section or mcDivision' }, { status: 400 })
  }

  const { data: latestWeek } = await supabaseAdmin
    .from('timetable_entries')
    .select('week_label')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  let platform: string | null = null
  if (deviceId) {
    const { data: deviceRow } = await supabaseAdmin
      .from('analytics_devices')
      .select('platform')
      .eq('device_id', deviceId)
      .single()
    platform = deviceRow?.platform ?? null
  }

  await supabaseAdmin.from('analytics_events').insert({
    device_id: deviceId,
    event_type: 'ics_fetch',
    section,
    mc_division: mcDivision,
    platform,
  })

  if (!latestWeek) {
    return NextResponse.json({ error: 'No timetable entries found' }, { status: 404 })
  }

  const { data } = await supabaseAdmin
    .from('timetable_entries')
    .select('*')
    .eq('week_label', latestWeek.week_label)
    .or(`section.eq.${section},mc_division.eq.${mcDivision}`)
  const classes = data || []

  const events = classes
    .map((cls) => {
      const start = toIcsDateTime(latestWeek.week_label, cls.day, cls.start_time)
      const end = toIcsDateTime(latestWeek.week_label, cls.day, cls.end_time)
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