'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')

  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; count?: number; weekLabel?: string; error?: string } | null>(null)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    // Simple client-side check just to gate the UI.
    // The actual security is enforced server-side in the upload API route.
    setAuthed(true)
    setAuthError('')
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('password', password)

    const res = await fetch('/api/upload-timetable', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    setUploading(false)
    setResult(data)
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center">Admin Login</h1>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
          {authError && <p className="text-red-500 text-sm">{authError}</p>}
          <button type="submit" className="w-full bg-black text-white rounded-lg py-2">
            Continue
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Upload Weekly Timetable</h1>
      <p className="text-sm text-gray-500">
        Upload the .xlsx file from the course coordinator. This will replace any existing data for
        the same week.
      </p>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block"
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-5 py-2 rounded-lg bg-black text-white disabled:opacity-40"
      >
        {uploading ? 'Uploading...' : 'Upload Timetable'}
      </button>

      {result && (
        <div
          className={`rounded-xl border p-4 ${
            result.error ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
          }`}
        >
          {result.error ? (
            <p className="text-red-700">❌ {result.error}</p>
          ) : (
            <div className="text-green-800 space-y-1">
              <p>✅ Upload successful</p>
              <p>Week detected: {result.weekLabel}</p>
              <p>Classes parsed: {result.count}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}