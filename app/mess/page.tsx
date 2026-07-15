'use client'

import { useEffect, useState } from 'react'
import { getActiveWeekNumber, getMenuForWeek, MEAL_TIMES, DayMenu } from '@/lib/messMenu'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEAL_ORDER: (keyof DayMenu)[] = ['breakfast', 'lunch', 'snacks', 'dinner']
const MEAL_ICONS: Record<string, string> = {
  breakfast: '🍳',
  lunch: '🍛',
  snacks: '🍟',
  dinner: '🍽️',
}
const MEAL_COLORS: Record<string, string> = {
  breakfast: 'bg-amber-50 border-amber-200',
  lunch: 'bg-green-50 border-green-200',
  snacks: 'bg-blue-50 border-blue-200',
  dinner: 'bg-purple-50 border-purple-200',
}

export default function MessMenuPage() {
  const [weekNumber, setWeekNumber] = useState<1 | 2>(1)
  const [todayName, setTodayName] = useState('')

  useEffect(() => {
    const now = new Date()
    setWeekNumber(getActiveWeekNumber(now))
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    setTodayName(dayNames[now.getDay()])
  }, [])

  const menu = getMenuForWeek(weekNumber)

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Hostel Mess Menu</h1>
        <p className="text-muted-foreground">
          Currently following <span className="font-medium">Week {weekNumber}</span> menu
          (alternates weekly)
        </p>
      </div>

      <div className="space-y-6">
        {DAYS.map((day) => (
          <div
            key={day}
            className={`rounded-2xl border p-4 space-y-3 ${
              day === todayName ? 'border-black ring-1 ring-black' : 'border-gray-200'
            }`}
          >
            <h2 className="font-semibold flex items-center gap-2">
              {day}
              {day === todayName && (
                <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MEAL_ORDER.map((meal) => (
                <div
                  key={meal}
                  className={`rounded-lg border p-3 space-y-1 ${MEAL_COLORS[meal]}`}
                >
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    {MEAL_ICONS[meal]} {meal.charAt(0).toUpperCase() + meal.slice(1)} ·{' '}
                    {MEAL_TIMES[meal].label}
                  </p>
                  <p className="text-sm">{menu[day][meal]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
