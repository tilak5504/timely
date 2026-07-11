import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect admin password' }, { status: 401 })
  }

  const { data: devices } = await supabaseAdmin.from('analytics_devices').select('*')
  const { data: calendarLinks } = await supabaseAdmin
    .from('device_links')
    .select('device_id, section, mc_division, google_refresh_token')

  const { data: recentEvents } = await supabaseAdmin
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: last14DaysEvents } = await supabaseAdmin
    .from('analytics_events')
    .select('created_at, event_type')
    .eq('event_type', 'pageview')
    .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())

  const { count: icsFetchCount } = await supabaseAdmin
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'ics_fetch')

  const totalDevices = devices?.length || 0

  const bySection: Record<string, number> = {}
  const byDivision: Record<string, number> = {}
  for (const d of devices || []) {
    if (d.section) bySection[d.section] = (bySection[d.section] || 0) + 1
    if (d.mc_division) byDivision[d.mc_division] = (byDivision[d.mc_division] || 0) + 1
  }

  const calendarConnections = (calendarLinks || []).filter((c) => c.google_refresh_token).length

  const now = Date.now()
  const activeNow = (devices || []).filter(
    (d) => now - new Date(d.last_seen).getTime() < 5 * 60 * 1000
  ).length
  const activeToday = (devices || []).filter(
    (d) => now - new Date(d.last_seen).getTime() < 24 * 60 * 60 * 1000
  ).length
  const activeThisWeek = (devices || []).filter(
    (d) => now - new Date(d.last_seen).getTime() < 7 * 24 * 60 * 60 * 1000
  ).length

  // Build a day-by-day signup count for the last 14 days
  const signupsByDay: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().split('T')[0]
    signupsByDay[key] = 0
  }
  for (const d of devices || []) {
    const key = new Date(d.first_seen).toISOString().split('T')[0]
    if (key in signupsByDay) signupsByDay[key]++
  }

  return NextResponse.json({
    totalDevices,
    activeNow,
    activeToday,
    activeThisWeek,
    calendarConnections,
    icsFetchCount: icsFetchCount || 0,
    bySection,
    byDivision,
    signupsByDay,
    recentEvents: recentEvents || [],
  })
}