"use client";

import { useState, useRef, useEffect } from "react";
import RobotCanvas from "./components/RobotCanvas";
import TerminalInput from "./components/TerminalInput";
import { IntentInterpreterAgent } from "./agents/IntentInterpreter";
import { RobotAgent } from "./agents/RobotAgent";

export default function Home() {
  const [robotState, setRobotState] = useState("IDLE");
  const robotAgentRef = useRef(new RobotAgent());

  useEffect(() => {
    // Listen for action completion and reset robot state to IDLE
    const handleActionComplete = () => {
      const robot = robotAgentRef.current;
      robot.finishAction();
      setRobotState(robot.getState());
    };

    window.addEventListener("robot-action-complete", handleActionComplete);
    return () => {
      window.removeEventListener("robot-action-complete", handleActionComplete);
    };
  }, []);

  const handleCommand = (command: string) => {
    // Intent Interpreter Agent: Parse command
    const intent = IntentInterpreterAgent.interpret(command);
    console.log("Command:", command, "→ Intent:", intent);

    if (intent === "UNKNOWN") {
      console.warn("Unknown command");
      return;
    }

    // Robot Agent: Execute action
    const robot = robotAgentRef.current;
    const success = robot.executeAction(intent);

    if (success) {
      setRobotState(robot.getState());
      // Emit event to RobotCanvas to trigger animation
      window.dispatchEvent(
        new CustomEvent("robot-action", { detail: { action: intent } })
      );
    }
  };

  return (
    <main className="relative w-full h-screen bg-neutral-950 text-neutral-200 overflow-hidden">

      {/* Background grid subtle */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] bg-[size:24px_24px]" />

      {/* Header minimal */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h1 className="text-2xl font-semibold tracking-wide">
          Pixel Robot Interface
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Type a command to interact with the robot
        </p>
      </div>

      {/* Phaser Canvas */}
      <div className="absolute inset-0 flex items-center justify-center">
        <RobotCanvas />
      </div>

      {/* Terminal Input Component */}
      <TerminalInput onSubmit={handleCommand} robotState={robotState} />

    </main>
  );
}
