'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SECTIONS = ['A', 'B', 'C', 'D', 'E']

export default function OnboardingPage() {
  const router = useRouter()
  const [section, setSection] = useState<string | null>(null)

  function handleSave() {
    if (!section) return
    localStorage.setItem('timely_section', section)
    // Division kept in sync with section since Trim 2 no longer splits by MC Division
    localStorage.setItem('timely_division', section)
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Welcome to Timely</h1>
        <p className="text-muted-foreground">Let's set up your timetable</p>
      </div>

      <div className="space-y-3 w-full max-w-sm">
        <p className="text-sm font-medium">Select your Section</p>
        <div className="flex gap-2 flex-wrap">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`px-4 py-2 rounded-lg border transition ${
                section === s
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!section}
        className="px-6 py-3 rounded-lg bg-black text-white disabled:opacity-30 disabled:cursor-not-allowed w-full max-w-sm"
      >
        Save and continue
      </button>
    </div>
  )
}
