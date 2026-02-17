import { matchesIntent, type Intent } from '@/app/i18n/commandAliases'

export class IntentInterpreterAgent {
  /**
   * Converts raw user input into a finite intent
   * Supports Spanish, English, and Portuguese commands
   */
  static interpret(command: string): Intent {
    // Try to match against all known intents
    const intents: Intent[] = [
      'MOVE_LEFT',
      'MOVE_RIGHT',
      'JUMP',
      'GREET',
      'PICK_OBJECT',
      'SHRUG',
    ]

    for (const intent of intents) {
      if (matchesIntent(command, intent)) {
        return intent
      }
    }

    return 'UNKNOWN'
  }
}
