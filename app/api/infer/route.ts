import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { type Intent } from '@/app/i18n/commandAliases'

export async function POST(req: Request) {
  try {
    const { userInput, availableIntents } = await req.json()

    const intentsList = [...availableIntents, 'UNKNOWN'].join('\n')

    const response = await getResponseFromAI(userInput, intentsList)

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

async function getResponseFromAI(userInput: string, intentsList: string) {
  if (process.env.NODE_ENV === 'development') {
    return await localAiRequest(userInput, intentsList)
  }

  return await openAiRequest(userInput, intentsList)
}

async function openAiRequest(userInput: string, intentsList: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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

  return response.output_text?.trim().toUpperCase()
}

async function localAiRequest(userInput: string, intentsList: string) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen2.5-coder:7b-instruct-q3_K_M',
      prompt: `
Classify the user input into exactly ONE of the following commands:

${intentsList}

Return ONLY the command name.
No explanations.

User: ${(userInput || '').slice(0, 100)}
`,
      stream: false,
      temperature: 0,
    }),
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return data?.response?.trim().toUpperCase() || null
}
