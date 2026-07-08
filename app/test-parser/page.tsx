'use client'

import { useState } from 'react'
import { parseTimetableFile, detectWeekLabel, ParsedClass } from '@/lib/parseTimetable'

export default function TestParserPage() {
  const [entries, setEntries] = useState<ParsedClass[]>([])
  const [weekLabel, setWeekLabel] = useState('')
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError('')
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const buffer = await file.arrayBuffer()
      const parsed = parseTimetableFile(buffer)
      setEntries(parsed)
      setWeekLabel(detectWeekLabel(file.name))
    } catch (err: any) {
      setError(err.message || 'Failed to parse file')
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Timetable Parser Test</h1>
      <input type="file" accept=".xlsx" onChange={handleFile} />

      {error && <p className="text-red-500">{error}</p>}

      {entries.length > 0 && (
        <div className="space-y-4">
          <p className="font-medium">
            Week detected: {weekLabel} — {entries.length} classes parsed
          </p>
          <div className="overflow-auto max-h-[600px] border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 text-left">Day</th>
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-left">Subject</th>
                  <th className="p-2 text-left">Section</th>
                  <th className="p-2 text-left">MC Div</th>
                  <th className="p-2 text-left">Faculty</th>
                  <th className="p-2 text-left">Room</th>
                  <th className="p-2 text-left">Resched?</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{e.day}</td>
                    <td className="p-2">{e.startTime}-{e.endTime}</td>
                    <td className="p-2">{e.subject}</td>
                    <td className="p-2">{e.section ?? '-'}</td>
                    <td className="p-2">{e.mcDivision ?? '-'}</td>
                    <td className="p-2">{e.faculty}</td>
                    <td className="p-2">{e.room}</td>
                    <td className="p-2">{e.rescheduled ? '⚠️' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}