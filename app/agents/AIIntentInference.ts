import { type Intent } from '@/app/i18n/commandAliases'

/**
 * Client-side wrapper that calls a server API to infer intent.
 * Keeps the OpenAI API key on the server - never exposed to the browser.
 */
export async function inferIntentWithAI(
  userInput: string,
  availableIntents: Intent[]
): Promise<Intent> {
  try {
    const res = await fetch('/api/infer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput, availableIntents }),
      cache: 'no-store',
    })

    if (!res.ok) return 'UNKNOWN'

    const data = await res.json()
    return (data?.intent || 'UNKNOWN') as Intent
  } catch (error) {
    console.error('Client infer error:', error)
    return 'UNKNOWN'
  }
}
