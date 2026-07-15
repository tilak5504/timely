'use client'

import { useEffect, useState, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface ClassEntry {
  id: string
  day: string
  start_time: string
  end_time: string
  subject: string
  section: string | null
  mc_division: string | null
  faculty: string
  room: string
  rescheduled: boolean
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_SLOTS = [
  { start: '08:30', end: '10:00', label: '08:30 - 10:00' },
  { start: '09:30', end: '11:00', label: '09:30 - 11:00' },
  { start: '11:15', end: '12:45', label: '11:15 - 12:45' },
  { start: '13:45', end: '15:15', label: '13:45 - 15:15' },
  { start: '15:30', end: '17:00', label: '15:30 - 17:00' },
]
const SUBJECT_COLORS: Record<string, string> = {
  'MC-I': 'bg-purple-100 border-purple-300 text-purple-900',
  ME: 'bg-blue-100 border-blue-300 text-blue-900',
  FAA: 'bg-amber-100 border-amber-300 text-amber-900',
  OB: 'bg-pink-100 border-pink-300 text-pink-900',
  SIDM: 'bg-teal-100 border-teal-300 text-teal-900',
  EIM: 'bg-orange-100 border-orange-300 text-orange-900',
  CCL: 'bg-indigo-100 border-indigo-300 text-indigo-900',
  'MM-I': 'bg-emerald-100 border-emerald-300 text-emerald-900',
}

function colorFor(subject: string) {
  return SUBJECT_COLORS[subject] || 'bg-gray-100 border-gray-300 text-gray-900'
}

export default function WeekPage() {
  const router = useRouter()
  const [section, setSection] = useState<string | null>(null)
  const [division, setDivision] = useState<string | null>(null)
  const [classes, setClasses] = useState<ClassEntry[]>([])
  const [loading, setLoading] = useState(true)
const [selected, setSelected] = useState<ClassEntry | null>(null)

  useEffect(() => {
    const savedSection = localStorage.getItem('timely_section')
    const savedDivision = localStorage.getItem('timely_division')
    if (!savedSection || !savedDivision) {
      router.push('/onboarding')
    } else {
      setSection(savedSection)
      setDivision(savedDivision)
    }
  }, [router])

  useEffect(() => {
    async function fetchWeek() {
      if (!section || !division) return

      const { data: latestWeek } = await supabase
        .from('timetable_entries')
        .select('week_label')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!latestWeek) {
        setLoading(false)
        return
      }

      const currentWeekLabel = latestWeek.week_label

      const { data, error } = await supabase
  .from('timetable_entries')
  .select('*')
  .eq('week_label', currentWeekLabel)
  .or(`section.eq.${section},mc_division.eq.${division}`)

console.log('Current Week:', currentWeekLabel)
console.log('Fetched Classes:', data)

      if (!error && data) {
  console.log('TIMETABLE DATA', data)
  setClasses(data as ClassEntry[])
}
      setLoading(false)
    }
    fetchWeek()
  }, [section, division])

  if (loading || !section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your timetable...</p>
      </div>
    )
  }

  function findClass(day: string, start: string) {
    return classes.find((c) => c.day === day && c.start_time === start)
  }

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Weekly Timetable</h1>
        <p className="text-muted-foreground">
          Section {section} · Division {division}
        </p>
      </div>

      {/* Desktop grid view */}
      <div className="hidden md:block overflow-x-auto">
        <div className="grid grid-cols-[100px_repeat(6,1fr)] gap-2 min-w-[900px]">
          <div />
          {DAYS.map((day) => (
            <div key={day} className="text-center font-medium text-sm text-gray-500 pb-2">
              {day}
            </div>
          ))}

{TIME_SLOTS.map((slot) => (
            <Fragment key={slot.label}>
              <div className="text-xs text-gray-400 pt-3">
                {slot.label}
              </div>
              {DAYS.map((day) => {
                const cls = findClass(day, slot.start)
                return (
                  <div key={day + slot.label} className="min-h-[90px]">
                    {cls ? (
                      <button
                        onClick={() => setSelected(cls)}
                        className={`w-full h-full rounded-lg border p-2 text-left text-xs space-y-1 hover:opacity-80 transition ${colorFor(
                          cls.subject
                        )}`}
                      >
                        <p className="font-semibold">
                          {cls.subject} {cls.rescheduled && '⚠️'}
                        </p>
                        <p className="opacity-80">{cls.room}</p>
                      </button>
                    ) : (
                      <div className="w-full h-full rounded-lg border border-dashed border-gray-100" />
                    )}
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Mobile stacked view */}
      <div className="md:hidden space-y-6">
        {DAYS.map((day) => {
          const dayClasses = TIME_SLOTS.map((slot) => findClass(day, slot.start)).filter(
            Boolean
          ) as ClassEntry[]
          return (
            <div key={day} className="space-y-2">
              <h2 className="font-medium text-sm text-gray-500">{day}</h2>
              {dayClasses.length === 0 && (
                <p className="text-xs text-gray-400">No classes</p>
              )}
              {dayClasses.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelected(cls)}
                  className={`w-full rounded-lg border p-3 text-left text-sm space-y-1 ${colorFor(
                    cls.subject
                  )}`}
                >
                  <p className="font-semibold">
                    {cls.subject} {cls.rescheduled && '⚠️'}
                  </p>
                  <p className="text-xs opacity-80">
                    {cls.start_time} - {cls.end_time} · {cls.room}
                  </p>
                </button>
              ))}
            </div>
          )
        })}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold">
              {selected.subject} {selected.rescheduled && '⚠️'}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>👤 {selected.faculty}</p>
              <p>📍 {selected.room}</p>
              <p>
                🕐 {selected.day}, {selected.start_time} - {selected.end_time}
              </p>
              <p>
                🎓 {selected.mc_division ? `Division ${selected.mc_division}` : `Section ${selected.section}`}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-black text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}