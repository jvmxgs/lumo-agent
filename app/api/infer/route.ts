import { NextResponse } from 'next/server'
import { type Intent } from '@/app/i18n/commandAliases'
import { aiRequest } from '@/app/api/aiClient'

export async function POST(req: Request) {
  try {
    const { userInput, availableIntents } = await req.json()

    const intentsList = [...availableIntents, 'UNKNOWN'].join('\n')

    const prompt = `Classify the user input into exactly ONE of the following commands:

${intentsList}

Return ONLY the command name.
No explanations.

User: ${(userInput || '').slice(0, 100)}`

    const response = await aiRequest(prompt, { maxOutputTokens: 16 })

    const intent: Intent =
      response && availableIntents.includes(response as Intent)
        ? (response as Intent)
        : 'UNKNOWN'

    return NextResponse.json({ intent })
  } catch (error) {
    console.error('Infer API error:', error)
    return NextResponse.json({ intent: 'UNKNOWN' }, { status: 500 })
  }
}
