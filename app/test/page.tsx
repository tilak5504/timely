'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState('Checking connection...')

  useEffect(() => {
    async function checkConnection() {
      const { error } = await supabase.from('timetable_entries').select('*').limit(1)
      if (error) {
        setStatus('❌ Connection failed: ' + error.message)
      } else {
        setStatus('✅ Successfully connected to Supabase!')
      }
    }
    checkConnection()
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Supabase Connection Test</h1>
      <p>{status}</p>
    </div>
  )
}