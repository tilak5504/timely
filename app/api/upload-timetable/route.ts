import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { parseTimetableFile, detectWeekLabel } from '@/lib/parseTimetable'

// This uses the secret service role key, which bypasses row-level security.
// This file only ever runs on the server, so the key stays safe.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const entries = parseTimetableFile(buffer)
    const weekLabel = detectWeekLabel(file.name)

    // Clear out any existing entries for this week before inserting fresh ones
    await supabaseAdmin.from('timetable_entries').delete().eq('week_label', weekLabel)

    const rows = entries.map((e) => ({
      week_label: weekLabel,
      day: e.day,
      start_time: e.startTime,
      end_time: e.endTime,
      subject: e.subject,
      section: e.section,
      mc_division: e.mcDivision,
      faculty: e.faculty,
      room: e.room,
      rescheduled: e.rescheduled,
    }))

    const { error } = await supabaseAdmin.from('timetable_entries').insert(rows)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      weekLabel,
      count: rows.length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}