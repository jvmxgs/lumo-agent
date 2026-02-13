type Intent = "MOVE_LEFT" | "MOVE_RIGHT" | "JUMP" | "GREET" | "PICK_OBJECT" | "SHRUG" | "UNKNOWN";

export class IntentInterpreterAgent {
  /**
   * Converts raw user input into a finite intent
   * Rule-based parsing first, AI fallback optional
   */
  static interpret(command: string): Intent {
    const normalized = command.toLowerCase().trim();

    // Rule-based parsing
    if (normalized.match(/^(left|go left|walk left|move left)$/)) {
      return "MOVE_LEFT";
    }
    if (normalized.match(/^(right|go right|walk right|move right)$/)) {
      return "MOVE_RIGHT";
    }
    if (normalized.match(/^(jump|hop)$/)) {
      return "JUMP";
    }
    if (normalized.match(/^(hi|hello|greet)$/)) {
      return "GREET";
    }
    if (normalized.match(/^(pick|grab)$/)) {
      return "PICK_OBJECT";
    }
    if (normalized.match(/^(shrug|confused)$/)) {
      return "SHRUG";
    }

    return "UNKNOWN";
  }
}