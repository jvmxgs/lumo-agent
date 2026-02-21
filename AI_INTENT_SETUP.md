# AI Intent Inference Setup

## Overview
The `IntentInterpreterAgent` now has two methods:
1. **`interpret(command)`** - Fast, rule-based pattern matching (synchronous)
2. **`interpretWithAI(command)`** - Rule-based with AI fallback for unknown commands (async)

## Configuration

To enable AI-powered intent inference when a command is not found in the dictionary, add your OpenAI API key to your environment:

### `.env.local` (Development)
```bash
NEXT_PUBLIC_OPENAI_API_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
```

Or use:
```bash
OPENAI_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxx
```

## Usage

### In React Components
```typescript
import { IntentInterpreterAgent } from '@/app/agents/IntentInterpreter'

// Fast rule-based only
const intent = IntentInterpreterAgent.interpret(userInput)

// With AI fallback
const intent = await IntentInterpreterAgent.interpretWithAI(userInput)
```

### In API Routes
```typescript
// app/api/interpret/route.ts
import { IntentInterpreterAgent } from '@/app/agents/IntentInterpreter'

export async function POST(request: Request) {
  const { command } = await request.json()
  const intent = await IntentInterpreterAgent.interpretWithAI(command)
  return Response.json({ intent })
}
```

## How It Works

1. **First Pass**: Tries to match against known command patterns (Spanish, English, Portuguese)
2. **Fallback**: If no pattern matches, sends a minimal prompt to OpenAI
3. **Validation**: Ensures AI response is a valid command, falls back to `UNKNOWN` if not
4. **Error Handling**: Returns `UNKNOWN` if API key is missing or API call fails

## Token Optimization

The prompt is designed to be extremely concise:
```
Valid commands: MOVE_LEFT, MOVE_RIGHT, JUMP, GREET, PICK_OBJECT, SHRUG
User input: "{user_input}"
Which command did the user mean? Respond ONLY with the command name or "UNKNOWN".
```

- **Model**: gpt-3.5-turbo (cheapest & fastest)
- **Temperature**: 0 (deterministic)
- **Max tokens**: 10 (very short response)
- **Expected cost**: ~50-100 tokens per inference (~$0.00001 per call)

## Examples

```typescript
// Pattern match - instant
IntentInterpreterAgent.interpret('saltar') // Returns 'JUMP'

// Not in dictionary - uses AI
await IntentInterpreterAgent.interpretWithAI('jump really high') // Returns 'JUMP'
await IntentInterpreterAgent.interpretWithAI('ir rapido a la izquierda') // Returns 'MOVE_LEFT'
```

## Security Notes

- API key should be in `.env.local` (gitignored)
- Consider using a rate limiter in production
- AI inference only happens for unknown commands (after dictionary fails)
- Response validation ensures only valid commands are returned
