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

  const { data: icsEvents } = await supabaseAdmin
    .from('analytics_events')
    .select('device_id, platform')
    .eq('event_type', 'ics_fetch')

  const { data: recentEvents } = await supabaseAdmin
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

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

  const platformByDevice: Record<string, string> = {}
  for (const d of devices || []) {
    if (d.platform) platformByDevice[d.device_id] = d.platform
  }

  const platformTotals: Record<string, number> = {}
  for (const d of devices || []) {
    const p = d.platform || 'Unknown'
    platformTotals[p] = (platformTotals[p] || 0) + 1
  }

  const googleByPlatform: Record<string, number> = {}
  for (const link of calendarLinks || []) {
    if (!link.google_refresh_token) continue
    const p = platformByDevice[link.device_id] || 'Unknown'
    googleByPlatform[p] = (googleByPlatform[p] || 0) + 1
  }

  const icsByPlatform: Record<string, number> = {}
  const icsDevicesByPlatform: Record<string, Set<string>> = {}
  for (const ev of icsEvents || []) {
    const p = ev.platform || (ev.device_id ? platformByDevice[ev.device_id] : null) || 'Unknown'
    if (!icsDevicesByPlatform[p]) icsDevicesByPlatform[p] = new Set()
    if (ev.device_id) icsDevicesByPlatform[p].add(ev.device_id)
  }
  for (const p in icsDevicesByPlatform) {
    icsByPlatform[p] = icsDevicesByPlatform[p].size
  }

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
    platformTotals,
    googleByPlatform,
    icsByPlatform,
  })
}
