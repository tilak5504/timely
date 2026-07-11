import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getOAuthClient, syncCalendarForDevice } from '@/lib/googleCalendar'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const stateRaw = req.nextUrl.searchParams.get('state')

  if (!code || !stateRaw) {
    return NextResponse.redirect(new URL('/?calendar=error', req.url))
  }

  try {
    const { deviceId, section, mcDivision } = JSON.parse(
      Buffer.from(stateRaw, 'base64').toString('utf-8')
    )

    const oauth2Client = getOAuthClient()
    const { tokens } = await oauth2Client.getToken(code)

    if (!tokens.refresh_token) {
      return NextResponse.redirect(new URL('/?calendar=noRefreshToken', req.url))
    }

    await supabaseAdmin.from('device_links').upsert({
      device_id: deviceId,
      section,
      mc_division: mcDivision,
      google_refresh_token: tokens.refresh_token,
    })

    const result = await syncCalendarForDevice(deviceId)
    console.log(`Synced ${result.count} calendar events for device ${deviceId}`)

    await supabaseAdmin.from('analytics_events').insert({
      device_id: deviceId,
      event_type: 'calendar_connected',
      section,
      mc_division: mcDivision,
    })
    return NextResponse.redirect(new URL('/?calendar=connected', req.url))
  } catch (err: any) {
    console.error('Calendar sync error:', err)
    return NextResponse.redirect(new URL('/?calendar=error', req.url))
  }
}