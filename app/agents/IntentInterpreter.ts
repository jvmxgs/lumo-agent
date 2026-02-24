import {
  matchesIntent,
  getPatternsForIntent,
  type Intent,
} from '@/app/i18n/commandAliases'
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
    const normalized = command.trim()

    if (!normalized) return 'UNKNOWN'

    // 1) Exact regex matches (fast)
    for (const intent of this.INTENTS) {
      if (matchesIntent(normalized, intent)) {
        return intent
      }
    }

    // 2) Fuzzy match to catch minor variations (e.g. "salta" vs "saltar")
    for (const intent of this.INTENTS) {
      if (this.fuzzyMatchesIntent(normalized, intent)) {
        return intent
      }
    }

    return 'UNKNOWN'
  }

  /**
   * Normalize text: remove diacritics, punctuation, collapse whitespace.
   */
  private static normalizeText(s: string) {
    return s
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * Compute Levenshtein distance between two strings.
   */
  private static levenshtein(a: string, b: string): number {
    const al = a.length
    const bl = b.length
    if (al === 0) return bl
    if (bl === 0) return al

    const row = new Array(bl + 1)
    for (let j = 0; j <= bl; j++) row[j] = j

    for (let i = 1; i <= al; i++) {
      let prev = row[0]
      row[0] = i
      for (let j = 1; j <= bl; j++) {
        const cur = row[j]
        const insert = row[j] + 1
        const del = row[j - 1] + 1
        const replace = prev + (a[i - 1] === b[j - 1] ? 0 : 1)
        prev = cur
        row[j] = Math.min(insert, del, replace)
      }
    }

    return row[bl]
  }

  /**
   * Fuzzy match a command against an intent's known aliases.
   * Extracts alternatives from RegExp sources and compares using Levenshtein.
   */
  private static fuzzyMatchesIntent(command: string, intent: Intent): boolean {
    const normalizedCmd = this.normalizeText(command)
    const patterns = getPatternsForIntent(intent)

    for (const pattern of patterns) {
      // Get the raw pattern text, remove anchors and grouping
      const src = pattern.source.replace(/^\^|\$$/g, '')
      const alts = src.replace(/\(|\)/g, '').split('|')

      for (let alt of alts) {
        // Replace escaped whitespace tokens with space
        alt = alt.replace(/\\s/g, ' ')
        const normalizedAlt = this.normalizeText(alt)

        if (!normalizedAlt) continue

        // If multi-word, compare whole string distance; else compare token distance
        const distance = this.levenshtein(normalizedCmd, normalizedAlt)

        // Threshold: allow small edits; scale with length (min 1, ~25% of length)
        const threshold = Math.max(1, Math.ceil(normalizedAlt.length * 0.25))

        if (distance <= threshold) return true
      }
    }

    return false
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
