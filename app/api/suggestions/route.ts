import OpenAI from 'openai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { history } = await req.json()
    if (!Array.isArray(history)) {
      return NextResponse.json({ suggestions: [] }, { status: 400 })
    }

    const prompt = `Based on the following list of previous terminal commands, suggest up to three new commands the user might want to try next. Return the suggestions as a JSON array, nothing else.

History:\n${history.join('\n')}`

    const response = await getResponseFromAI(prompt)
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

    console.log('ia response', response)
    console.log(JSON.stringify(response))
    console.log(suggestions)
    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Suggestion API error', error)
    return NextResponse.json({ suggestions: [] }, { status: 500 })
  }
}

async function getResponseFromAI(prompt: string) {
  if (process.env.NODE_ENV === 'development') {
    return await localAiRequest(prompt)
  }

  return await openAiRequest(prompt)
}

async function openAiRequest(prompt: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const response = await openai.responses.create({
    model: 'gpt-5-nano',
    max_output_tokens: 50,
    input: [
      {
        role: 'system',
        content: `You are a helpful assistant that suggests possible terminal commands based on previous user input.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  return response.output_text?.trim()
}

async function localAiRequest(prompt: string) {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen2.5-coder:7b-instruct-q3_K_M',
      prompt,
      stream: false,
      temperature: 0.5,
    }),
  })

  if (!res.ok) return ''
  const data = await res.json()
  return data?.response || ''
}
