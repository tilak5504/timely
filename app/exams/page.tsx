'use client'

import { getUpcomingExams, formatExamDate, formatExamTime } from '@/lib/exams'

export default function ExamsPage() {
  const exams = getUpcomingExams()

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Upcoming Exams</h1>
        <p className="text-muted-foreground">Stay on top of your assessments</p>
      </div>

      {exams.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm text-gray-500">No upcoming exams scheduled.</p>
        </div>
      )}

      <div className="space-y-3">
        {exams.map((exam) => (
          <div key={exam.id} className="rounded-2xl border border-red-200 bg-red-50 p-4 space-y-1">
            <p className="text-lg font-semibold">{exam.subject}</p>
            <p className="text-sm text-gray-600">{formatExamDate(exam.date)}</p>
            <p className="text-sm text-gray-600">
              {formatExamTime(exam.startTime)} - {formatExamTime(exam.endTime)}
            </p>
            <p className="text-sm text-gray-500">{exam.mode}</p>
            {exam.notes && <p className="text-xs text-gray-400 pt-1">{exam.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
