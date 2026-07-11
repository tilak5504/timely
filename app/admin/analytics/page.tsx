'use client'

import { useEffect, useRef, useState } from 'react'

interface AnalyticsData {
  totalDevices: number
  activeNow: number
  activeToday: number
  activeThisWeek: number
  calendarConnections: number
  icsFetchCount: number
  bySection: Record<string, number>
  byDivision: Record<string, number>
  signupsByDay: Record<string, number>
  recentEvents: {
    id: string
    device_id: string | null
    event_type: string
    section: string | null
    mc_division: string | null
    created_at: string
  }[]
}

const EVENT_LABELS: Record<string, string> = {
  pageview: '👀 Opened app',
  calendar_connected: '📅 Connected Google Calendar',
  ics_fetch: '📱 Apple/Outlook synced',
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default function AnalyticsPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const passwordRef = useRef('')

  async function fetchAnalytics(pw: string) {
    const res = await fetch('/api/admin-analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })
    const result = await res.json()
    if (result.error) {
      setError(result.error)
      return false
    }
    setData(result)
    setLastUpdated(new Date())
    return true
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const ok = await fetchAnalytics(password)
    setLoading(false)
    if (ok) {
      passwordRef.current = password
      setAuthed(true)
    }
  }

  useEffect(() => {
    if (!authed) return
    const interval = setInterval(() => {
      fetchAnalytics(passwordRef.current)
    }, 15000)
    return () => clearInterval(interval)
  }, [authed])

  if (!authed || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center">Analytics Login</h1>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'View Analytics'}
          </button>
        </form>
      </div>
    )
  }

  const sections = Object.entries(data.bySection).sort((a, b) => b[1] - a[1])
  const divisions = Object.entries(data.byDivision).sort((a, b) => a[0].localeCompare(b[0]))
  const maxSectionCount = Math.max(...sections.map(([, count]) => count), 1)

  const signupDays = Object.entries(data.signupsByDay)
  const maxSignups = Math.max(...signupDays.map(([, count]) => count), 1)

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Timely Analytics</h1>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live · updated {lastUpdated ? timeAgo(lastUpdated.toISOString()) : ''}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border p-4">
          <p className="text-3xl font-semibold">{data.totalDevices}</p>
          <p className="text-sm text-gray-500">Total students onboarded</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-3xl font-semibold flex items-center gap-2">
            {data.activeNow}
            {data.activeNow > 0 && (
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
          </p>
          <p className="text-sm text-gray-500">Active right now (5 min)</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-3xl font-semibold">{data.activeToday}</p>
          <p className="text-sm text-gray-500">Active today</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-3xl font-semibold">{data.activeThisWeek}</p>
          <p className="text-sm text-gray-500">Active this week</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-3xl font-semibold">{data.calendarConnections}</p>
          <p className="text-sm text-gray-500">Google Calendar connections</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-3xl font-semibold">
            {data.totalDevices > 0
              ? Math.round((data.calendarConnections / data.totalDevices) * 100)
              : 0}
            %
          </p>
          <p className="text-sm text-gray-500">Calendar adoption rate</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-3xl font-semibold">{data.icsFetchCount}</p>
          <p className="text-sm text-gray-500">Apple/Outlook syncs</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Signups — last 14 days
        </h2>
        <div className="flex items-end gap-1 h-32">
          {signupDays.map(([day, count]) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${(count / maxSignups) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
              />
              <span className="text-[9px] text-gray-400">{day.slice(5)}</span>
              <span className="absolute -top-5 text-xs opacity-0 group-hover:opacity-100 transition bg-black text-white px-1.5 py-0.5 rounded">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">By Section</h2>
        <div className="space-y-2">
          {sections.map(([section, count]) => (
            <div key={section} className="flex items-center gap-3">
              <span className="w-6 text-sm font-medium">{section}</span>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full flex items-center px-2"
                  style={{ width: `${(count / maxSectionCount) * 100}%` }}
                >
                  <span className="text-xs text-white font-medium">{count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          By MC Division
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {divisions.map(([division, count]) => (
            <div key={division} className="rounded-lg border p-3 flex justify-between">
              <span className="text-sm font-medium">{division}</span>
              <span className="text-sm text-gray-500">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Recent Activity
        </h2>
        <div className="space-y-1">
          {data.recentEvents.length === 0 && (
            <p className="text-sm text-gray-400">No activity yet.</p>
          )}
          {data.recentEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between text-sm border-b py-2 last:border-0"
            >
              <span>
                {EVENT_LABELS[event.event_type] || event.event_type}
                {event.section && (
                  <span className="text-gray-400">
                    {' '}
                    · Sec {event.section}
                    {event.mc_division ? ` / ${event.mc_division}` : ''}
                  </span>
                )}
              </span>
              <span className="text-gray-400 text-xs">{timeAgo(event.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}