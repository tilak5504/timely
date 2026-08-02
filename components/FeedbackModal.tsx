'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  section: string
  division: string
  onClose: () => void
}

export default function FeedbackModal({ section, division, onClose }: Props) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function markDone() {
    localStorage.setItem('timely_feedback_done', 'true')
  }

  function handleSkip() {
    markDone()
    onClose()
  }

  async function handleSubmit() {
    if (rating === 0) return
    setSubmitting(true)
    const deviceId = localStorage.getItem('timely_device_id')
    await supabase.from('feedback').insert({
      device_id: deviceId,
      rating,
      comment: comment.trim() || null,
      section,
      mc_division: division,
    })
    markDone()
    setSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Enjoying Timely?</h3>
          <p className="text-sm text-gray-500">Tap a star to rate your experience</p>
        </div>

        <div className="flex justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-3xl transition"
            >
              {(hoverRating || rating) >= star ? '⭐' : '☆'}
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Any feedback? (optional)"
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
          >
            Maybe later
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="flex-1 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium disabled:opacity-40"
          >
            {submitting ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}
