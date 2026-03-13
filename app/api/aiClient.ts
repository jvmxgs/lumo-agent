import OpenAI from 'openai'

export interface AiOptions {
  model?: string
  maxOutputTokens?: number
  temperature?: number
  systemMessage?: string
}

/**
 * Generic entry point to ask either the remote OpenAI service or the
 * locally‑running model (when NODE_ENV=development).
 *
 * The caller is responsible for formatting the prompt appropriately
 * (including any system instructions).  "suggestions" and
 * "intent classification" both work as simple text prompts.
 */
export async function aiRequest(
  prompt: string,
  options: AiOptions = {}
): Promise<string> {
  if (process.env.NODE_ENV === 'development') {
    return localAiRequest(prompt, options)
  }

  return openAiRequest(prompt, options)
}

async function openAiRequest(
  prompt: string,
  { model = 'gpt-5-nano', maxOutputTokens = 50, systemMessage }: AiOptions
) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const messages: { role: string; content: string }[] = []
  if (systemMessage) {
    messages.push({ role: 'system', content: systemMessage })
  }
  messages.push({ role: 'user', content: prompt })

  const response = await openai.responses.create({
    model,
    max_output_tokens: maxOutputTokens,
    // the type definitions are a bit strict; the runtime accepts our
    // role/content objects just fine so use `any` to satisfy TS
    input: messages as any,
  })

  return response.output_text?.trim() || ''
}

async function localAiRequest(
  prompt: string,
  { model = 'qwen2.5-coder:7b-instruct-q3_K_M', temperature = 0.5 }: AiOptions
) {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      temperature,
    }),
  })

  if (!res.ok) return ''
  const data = await res.json()
  return data?.response || ''
}
