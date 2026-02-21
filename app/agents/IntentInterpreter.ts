import { matchesIntent, type Intent } from '@/app/i18n/commandAliases'
import { inferIntentWithAI } from './AIIntentInference'

export class IntentInterpreterAgent {
  private static readonly INTENTS: Intent[] = [
    'MOVE_LEFT',
    'MOVE_RIGHT',
    'JUMP',
    'GREET',
    'PICK_OBJECT',
    'SHRUG',
  ]

  /**
   * Pure rule-based interpretation
   */
  static interpret(command: string): Intent {
    const normalized = command.trim().toLowerCase()

    if (!normalized) return 'UNKNOWN'

    for (const intent of this.INTENTS) {
      if (matchesIntent(normalized, intent)) {
        return intent
      }
    }

    return 'UNKNOWN'
  }

  /**
   * Rule-based first, AI fallback second.
   * Always returns a valid Intent.
   */
  static async interpretWithAI(command: string): Promise<Intent> {
    const normalized = command.trim()

    // 1️⃣ Guard: empty or too long input
    if (!normalized || normalized.length > 200) {
      return 'UNKNOWN'
    }

    // 2️⃣ Rule-based first
    const directMatch = this.interpret(normalized)
    if (directMatch !== 'UNKNOWN') {
      return directMatch
    }

    // 3️⃣ AI fallback
    try {
      const aiInference = await inferIntentWithAI(normalized, this.INTENTS)

      // 4️⃣ Safety validation
      if (this.INTENTS.includes(aiInference)) {
        return aiInference
      }

      return 'UNKNOWN'
    } catch (error) {
      console.error('IntentInterpreterAgent error:', error)
      return 'UNKNOWN'
    }
  }
}
