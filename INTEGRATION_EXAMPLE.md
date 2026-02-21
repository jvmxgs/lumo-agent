/**
 * EXAMPLE: How to integrate AI Intent Inference into page.tsx
 * 
 * This shows how to update the handleCommand function to use AI fallback
 * when a command is not found in the dictionary.
 */

// Change the handleCommand function from:
const handleCommand = (command: string) => {
  const intent = IntentInterpreterAgent.interpret(command)
  console.log('Command:', command, '→ Intent:', intent)

  if (intent === 'UNKNOWN') {
    console.warn('Unknown command')
    return
  }
  // ... rest of code
}

// To this (using AI fallback):
const handleCommand = async (command: string) => {
  const intent = await IntentInterpreterAgent.interpretWithAI(command)
  console.log('Command:', command, '→ Intent:', intent)

  if (intent === 'UNKNOWN') {
    console.warn('Unknown command - could not infer intent')
    return
  }
  // ... rest of code
}

// OR keep rule-based only (faster, no API calls):
const handleCommand = (command: string) => {
  const intent = IntentInterpreterAgent.interpret(command)
  console.log('Command:', command, '→ Intent:', intent)

  if (intent === 'UNKNOWN') {
    console.warn('Unknown command')
    return
  }
  // ... rest of code
}
