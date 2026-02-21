import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { type Intent } from '@/app/i18n/commandAliases'

export async function POST(req: Request) {
  try {
    const { userInput, availableIntents } = await req.json()

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const intentsList = [...availableIntents, 'UNKNOWN'].join('\n')

    const response = await openai.responses.create({
      model: 'gpt-5-nano',
      max_output_tokens: 16,
      input: [
        {
          role: 'system',
          content: `
Classify the user input into exactly ONE of the following commands:

${intentsList}

Return ONLY the command name.
No explanations.
          `,
        },
        {
          role: 'user',
          content: (userInput || '').slice(0, 100),
        },
      ],
    })

    const result = response.output_text?.trim().toUpperCase()

    const intent: Intent =
      result && availableIntents.includes(result as Intent)
        ? (result as Intent)
        : 'UNKNOWN'

    return NextResponse.json({ intent })
  } catch (error) {
    console.error('Infer API error:', error)
    return NextResponse.json({ intent: 'UNKNOWN' }, { status: 500 })
  }
}
