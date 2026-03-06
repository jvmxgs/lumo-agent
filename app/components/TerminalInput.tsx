'use client'

import { useState, type ReactNode } from 'react'
import { useI18n } from '@/app/i18n/I18nContext'

interface TerminalInputProps {
  onSubmit: (command: string) => void
  robotState?: string
  /**
   * render-prop that receives the list of previous commands the user submitted
   * along with a callback that can be used when a suggestion is clicked. The
   * callback will update the input value (and focus it) so the user can edit or
   * submit immediately.
   */
  children?: (
    history: string[],
    onSuggestionClick: (command: string) => void
  ) => React.ReactNode
}

export default function TerminalInput({
  onSubmit,
  robotState = 'IDLE',
  children,
}: TerminalInputProps) {
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const { t } = useI18n()

  // allow suggestions to insert text into the input
  const handleSuggestionClick = (cmd: string) => {
    setCommand(cmd)
    // optional: focus input after setting (useRef would be needed later if required)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!command.trim()) return

    onSubmit(command)
    setHistory((h) => [...h, command])
    setCommand('')
  }

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-10">
      {children && children(history, handleSuggestionClick)}
      <p className="text-[10px] text-neutral-500 mb-1 text-center">
        Robot State: <span className="text-green-400">{robotState}</span>
      </p>
      <p className="text-[9px] text-neutral-600 mb-2 text-center">
        {t.terminal.help} ({t.commandExamples})
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
            placeholder={t.terminal.placeholder}
            className="flex-1 bg-transparent outline-none text-sm 
                       placeholder:text-neutral-600"
            autoFocus
          />
        </div>
      </form>
    </div>
  )
}
