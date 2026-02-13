export type RobotState = "IDLE" | "MOVING" | "ACTING" | "CONFUSED";
export type RobotAction = "GREET" | "JUMP" | "MOVE_LEFT" | "MOVE_RIGHT" | "PICK_OBJECT" | "SHRUG";

export class RobotAgent {
  private state: RobotState = "IDLE";
  private currentAction: RobotAction | null = null;

  getState(): RobotState {
    return this.state;
  }

  getCurrentAction(): RobotAction | null {
    return this.currentAction;
  }

  /**
   * Executes an action if the robot is not already busy
   */
  executeAction(action: RobotAction): boolean {
    if (this.state !== "IDLE") {
      console.warn(`Robot is ${this.state}, cannot execute ${action}`);
      this.state = "CONFUSED";
      return false;
    }

    this.currentAction = action;

    // Determine next state based on action
    if (action === "MOVE_LEFT" || action === "MOVE_RIGHT") {
      this.state = "MOVING";
    } else if (action === "JUMP" || action === "GREET" || action === "PICK_OBJECT") {
      this.state = "ACTING";
    } else if (action === "SHRUG") {
      this.state = "CONFUSED";
    }

    return true;
  }

  /**
   * Called when action completes
   */
  finishAction(): void {
    this.currentAction = null;
    this.state = "IDLE";
  }
}