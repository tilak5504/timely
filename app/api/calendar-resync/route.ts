import { NextRequest, NextResponse } from 'next/server'
import { syncCalendarForDevice } from '@/lib/googleCalendar'

export async function POST(req: NextRequest) {
  const { deviceId } = await req.json()

  if (!deviceId) {
    return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 })
  }

  try {
    const result = await syncCalendarForDevice(deviceId)
    return NextResponse.json({ success: true, count: result.count })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Resync failed' }, { status: 500 })
  }
}
