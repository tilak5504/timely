'use client'

import { useState } from 'react'
import { parseTimetableFile, detectWeekLabel, ParsedClass } from '@/lib/parseTimetable'

export default function TestParserPage() {
  const [entries, setEntries] = useState<ParsedClass[]>([])
  const [weekLabel, setWeekLabel] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError('')
    setSaveMessage('')
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

  async function handleSave() {
    setSaving(true)
    setSaveMessage('')

    const fileInput = document.querySelector('input[type=file]') as HTMLInputElement
    const file = fileInput?.files?.[0]
    if (!file) {
      setSaving(false)
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload-timetable', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()

    setSaving(false)
    if (data.error) {
      setSaveMessage('❌ Failed to save: ' + data.error)
    } else {
      setSaveMessage(`✅ Saved ${data.count} classes to the database for week: ${data.weekLabel}`)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Timetable Parser Test</h1>
      <input type="file" accept=".xlsx" onChange={handleFile} />

      {error && <p className="text-red-500">{error}</p>}

      {entries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">
              Week detected: {weekLabel} — {entries.length} classes parsed
            </p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save to Database'}
            </button>
          </div>

          {saveMessage && <p className="font-medium">{saveMessage}</p>}

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