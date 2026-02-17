/**
 * Command aliases in multiple languages
 */

export type Intent =
  | 'MOVE_LEFT'
  | 'MOVE_RIGHT'
  | 'JUMP'
  | 'GREET'
  | 'PICK_OBJECT'
  | 'SHRUG'
  | 'UNKNOWN'

export const commandAliases: Record<Intent, Record<string, RegExp>> = {
  MOVE_LEFT: {
    es: /^(izquierda|ir izquierda|caminar izquierda|mover izquierda|left)$/,
    en: /^(left|go left|walk left|move left)$/,
    pt: /^(esquerda|ir esquerda|caminhar esquerda|mover esquerda)$/,
  },
  MOVE_RIGHT: {
    es: /^(derecha|ir derecha|caminar derecha|mover derecha|right)$/,
    en: /^(right|go right|walk right|move right)$/,
    pt: /^(direita|ir direita|caminhar direita|mover direita)$/,
  },
  JUMP: {
    es: /^(saltar|salto|brincar)$/,
    en: /^(jump|hop)$/,
    pt: /^(pular|salto|pulo)$/,
  },
  GREET: {
    es: /^(hola|hi|hello|saludar|saludo)$/,
    en: /^(hi|hello|greet|hey)$/,
    pt: /^(olá|oi|saudação|saudar)$/,
  },
  PICK_OBJECT: {
    es: /^(coger|agarrar|tomar|pick|grab)$/,
    en: /^(pick|grab|take)$/,
    pt: /^(pegar|agarrar|panha)$/,
  },
  SHRUG: {
    es: /^(encoger|encogerse|shrug|confundido)$/,
    en: /^(shrug|confused|dunno)$/,
    pt: /^(encolher|confuso|não sei)$/,
  },
  UNKNOWN: {
    es: /^.*$/, // Matches anything (fallback)
    en: /^.*$/,
    pt: /^.*$/,
  },
}

/**
 * Get all possible patterns for an intent
 */
export const getPatternsForIntent = (intent: Intent): RegExp[] => {
  const patterns = commandAliases[intent]
  return Object.values(patterns)
}

/**
 * Check if a command matches an intent
 */
export const matchesIntent = (command: string, intent: Intent): boolean => {
  const normalized = command.toLowerCase().trim()
  const patterns = commandAliases[intent]

  return Object.values(patterns).some((pattern) => pattern.test(normalized))
}
