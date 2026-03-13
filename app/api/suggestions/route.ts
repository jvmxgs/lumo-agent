import { NextResponse } from 'next/server'
import { aiRequest } from '@/app/api/aiClient'

export async function POST(req: Request) {
  try {
    const { history } = await req.json()
    if (!Array.isArray(history)) {
      return NextResponse.json({ suggestions: [] }, { status: 400 })
    }

    const prompt = `Based on the following list of previous terminal commands, suggest up to three new commands the user might want to try next. Return the suggestions as a JSON array, nothing else.

History:\n${history.join('\n')}`

    const response = await aiRequest(prompt, {
      maxOutputTokens: 50,
      systemMessage:
        'You are a helpful assistant that suggests possible terminal commands based on previous user input.',
    })
    // expect the model to output a JSON array of strings
    let suggestions: string[] = []
    if (response) {
      try {
        const parsed = JSON.parse(response)
        if (Array.isArray(parsed)) {
          suggestions = parsed.filter((s) => typeof s === 'string')
        } else {
          throw new Error('not array')
        }
      } catch {
        // sometimes the model returns lines like:
        // [
        //    "ve a la izquierda",
        //    "sube las escaleras",
        //    "baja las escaleras"
        // ]
        // We'll try to extract quoted strings first.
        const quoted = [...(response.match(/"([^\"]+)"/g) || [])].map((q) =>
          q.replace(/^"|"$/g, '')
        )
        if (quoted.length > 0) {
          suggestions = quoted
        } else {
          // final fallback: split on newlines and trim
          suggestions = response
            .split('\n')
            .map((l: string) => l.trim())
            .filter(Boolean)
        }
      }
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Suggestion API error', error)
    return NextResponse.json({ suggestions: [] }, { status: 500 })
  }
}
