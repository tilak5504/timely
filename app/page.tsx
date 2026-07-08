'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [section, setSection] = useState<string | null>(null)
  const [division, setDivision] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedSection = localStorage.getItem('timely_section')
    const savedDivision = localStorage.getItem('timely_division')

    if (!savedSection || !savedDivision) {
      router.push('/onboarding')
    } else {
      setSection(savedSection)
      setDivision(savedDivision)
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Good morning 👋</h1>
      <p className="text-muted-foreground">
        Section {section} — Division {division}
      </p>
      <p className="text-sm text-muted-foreground">
        (Your real timetable dashboard will appear here in Step 5)
      </p>
    </div>
  )
}