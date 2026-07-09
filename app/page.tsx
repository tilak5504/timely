'use client'

import { useEffect, useState } from 'react'
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

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function formatCountdown(ms: number) {
  const totalMinutes = Math.floor(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export default function HomePage() {
  const router = useRouter()
  const [section, setSection] = useState<string | null>(null)
  const [division, setDivision] = useState<string | null>(null)
  const [classes, setClasses] = useState<ClassEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(new Date())

  // Redirect to onboarding if no preferences saved yet
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

  // Tick the clock every 30 seconds for the live countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(interval)
  }, [])

  // Fetch today's classes once we know the student's section/division
  useEffect(() => {
    async function fetchClasses() {
      if (!section || !division) return

      const today = DAYS[new Date().getDay()]

      // First, find the most recently uploaded week
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

      const { data, error } = await supabase
        .from('timetable_entries')
        .select('*')
        .eq('day', today)
        .eq('week_label', latestWeek.week_label)
        .or(`section.eq.${section},mc_division.eq.${division}`)
        .order('start_time', { ascending: true })

      if (!error && data) {
        setClasses(data as ClassEntry[])
      }
      setLoading(false)
    }
    fetchClasses()
  }, [section, division])

  if (loading || !section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your timetable...</p>
      </div>
    )
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const currentClass = classes.find(
    (c) => timeToMinutes(c.start_time) <= nowMinutes && nowMinutes < timeToMinutes(c.end_time)
  )
  const nextClass = classes.find((c) => timeToMinutes(c.start_time) > nowMinutes)

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  let countdownText = ''
  if (nextClass) {
    const msUntil = timeToMinutes(nextClass.start_time) * 60000 - (nowMinutes * 60000 + now.getSeconds() * 1000)
    countdownText = formatCountdown(msUntil)
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">{greeting} 👋</h1>
        <p className="text-muted-foreground">
          Section {section} · Division {division}
        </p>
        <a href="/week" className="text-sm text-blue-600 underline">
          View full week →
        </a>
      </div>

      {currentClass && (
        <div className="rounded-2xl border border-green-300 bg-green-50 p-5 space-y-1">
          <p className="text-xs font-medium text-green-700 uppercase tracking-wide">
            Happening now
          </p>
          <p className="text-lg font-semibold">{currentClass.subject}</p>
          <p className="text-sm text-gray-600">
            {currentClass.faculty} · {currentClass.room}
          </p>
          <p className="text-sm text-gray-500">
            {currentClass.start_time} - {currentClass.end_time}
          </p>
        </div>
      )}

      {nextClass && !currentClass && (
        <div className="rounded-2xl border border-blue-300 bg-blue-50 p-5 space-y-1">
          <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">
            Next class in {countdownText}
          </p>
          <p className="text-lg font-semibold">
            {nextClass.subject} {nextClass.rescheduled && '⚠️'}
          </p>
          <p className="text-sm text-gray-600">
            {nextClass.faculty} · {nextClass.room}
          </p>
          <p className="text-sm text-gray-500">
            {nextClass.start_time} - {nextClass.end_time}
          </p>
        </div>
      )}

      {!currentClass && !nextClass && classes.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm text-gray-500">No more classes today 🎉</p>
        </div>
      )}

      {classes.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm text-gray-500">No classes scheduled for today. Free day!</p>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Today's Schedule
        </h2>
        <div className="space-y-2">
          {classes.map((c) => {
            const isPast = timeToMinutes(c.end_time) <= nowMinutes
            const isCurrent = c.id === currentClass?.id
            return (
              <div
                key={c.id}
                className={`rounded-xl border p-4 flex justify-between items-center ${
                  isCurrent
                    ? 'border-green-300 bg-green-50'
                    : isPast
                    ? 'border-gray-100 bg-gray-50 opacity-50'
                    : 'border-gray-200'
                }`}
              >
                <div>
                  <p className="font-medium">
                    {c.subject} {c.rescheduled && '⚠️'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {c.faculty} · {c.room}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {c.start_time} - {c.end_time}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}