import { google } from 'googleapis'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
}

export function getAuthUrl(deviceId: string, section: string, mcDivision: string) {
  const oauth2Client = getOAuthClient()
  const state = Buffer.from(JSON.stringify({ deviceId, section, mcDivision })).toString('base64')
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    state,
  })
}
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

function buildDateTimeString(day: string, time: string) {
  const date = nextDateForDay(day)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const dayOfMonth = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${dayOfMonth}T${time}:00`
}

// Deletes any previously created events for this device, then creates fresh ones
// for the latest week's classes matching their section/division.
export async function syncCalendarForDevice(deviceId: string) {
  const { data: device } = await supabaseAdmin
    .from('device_links')
    .select('*')
    .eq('device_id', deviceId)
    .single()

  if (!device || !device.google_refresh_token) {
    throw new Error('Device not connected to Google Calendar')
  }

  const oauth2Client = getOAuthClient()
  oauth2Client.setCredentials({ refresh_token: device.google_refresh_token })
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  // Delete previously created events for this device
  const { data: oldEvents } = await supabaseAdmin
    .from('calendar_events')
    .select('*')
    .eq('device_id', deviceId)

  if (oldEvents) {
    for (const ev of oldEvents) {
      try {
        await calendar.events.delete({ calendarId: 'primary', eventId: ev.google_event_id })
      } catch {
        // Event might already be deleted manually by the user; ignore.
      }
    }
    await supabaseAdmin.from('calendar_events').delete().eq('device_id', deviceId)
  }

  // Get the latest week's classes for this device's section/division
  const { data: latestWeek } = await supabaseAdmin
    .from('timetable_entries')
    .select('week_label')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!latestWeek) return { count: 0 }

  const { data: classes } = await supabaseAdmin
    .from('timetable_entries')
    .select('*')
    .eq('week_label', latestWeek.week_label)
    .or(`section.eq.${device.section},mc_division.eq.${device.mc_division}`)

  if (!classes) return { count: 0 }

  let created = 0
  for (const cls of classes) {
    const startDateTime = buildDateTimeString(cls.day, cls.start_time)
    const endDateTime = buildDateTimeString(cls.day, cls.end_time)

    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: cls.subject,
        location: cls.room,
        description: `Faculty: ${cls.faculty}${cls.rescheduled ? '\n⚠️ Rescheduled class' : ''}`,
        start: { dateTime: startDateTime, timeZone: 'Asia/Kolkata' },
        end: { dateTime: endDateTime, timeZone: 'Asia/Kolkata' },
      },
    })

    if (event.data.id) {
      await supabaseAdmin.from('calendar_events').insert({
        device_id: deviceId,
        timetable_entry_id: cls.id,
        google_event_id: event.data.id,
        week_label: latestWeek.week_label,
      })
      created++
    }
  }

  return { count: created }
}