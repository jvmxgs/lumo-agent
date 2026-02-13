"use client";

import { useState } from "react";

interface TerminalInputProps {
  onSubmit: (command: string) => void;
  robotState?: string;
}

export default function TerminalInput({ onSubmit, robotState = "IDLE" }: TerminalInputProps) {
  const [command, setCommand] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!command.trim()) return;

    onSubmit(command);
    setCommand("");
  };

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-10">
      <p className="text-[10px] text-neutral-500 mb-2 text-center">
        Robot State: <span className="text-green-400">{robotState}</span>
      </p>
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 
                   rounded-2xl shadow-xl px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-green-400 text-sm">$</span>
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="enter command... (left, right, jump)"
            className="flex-1 bg-transparent outline-none text-sm 
                       placeholder:text-neutral-600"
            autoFocus
          />
        </div>
      </form>
    </div>
  );
}