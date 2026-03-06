'use client'

import { useEffect, useState } from 'react'

interface CommandSuggestionsProps {
  history: string[]
  onSelect?: (command: string) => void
}

export default function CommandSuggestions({ history, onSelect }: CommandSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (history.length === 0) {
      setSuggestions([])
      return
    }

    let cancelled = false
    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history }),
        })
        if (!res.ok) throw new Error('network')
        const data = await res.json()
        if (!cancelled) {
          setSuggestions(data.suggestions || [])
        }
      } catch (err) {
        console.error('suggestions error', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchSuggestions()
    return () => {
      cancelled = true
    }
  }, [history.join('|')])

  if (loading) {
    return <p className="text-xs text-neutral-500">Loading suggestions…</p>
  }

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="mb-2 text-xs text-neutral-400">
      Suggestions:{' '}
      {suggestions.map((s, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect && onSelect(s)}
          className="inline-block mr-2 mb-1 px-2 py-0.5 bg-neutral-800 rounded hover:bg-neutral-700"
        >
          {s}
        </button>
      ))}
    </div>
  )
}
