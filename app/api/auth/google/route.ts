import { NextRequest, NextResponse } from 'next/server'
import { getAuthUrl } from '@/lib/googleCalendar'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const deviceId = req.nextUrl.searchParams.get('deviceId')
  const section = req.nextUrl.searchParams.get('section')
  const mcDivision = req.nextUrl.searchParams.get('mcDivision')

  if (!deviceId || !section || !mcDivision) {
    return NextResponse.json({ error: 'Missing deviceId, section, or mcDivision' }, { status: 400 })
  }
  const url = getAuthUrl(deviceId, section, mcDivision)
  const response = NextResponse.redirect(url)
  response.headers.set('Cache-Control', 'no-store')
  return response
}