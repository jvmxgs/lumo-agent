'use client'

import { useState, useRef, useEffect } from 'react'
import RobotCanvas from './components/RobotCanvas'
import TerminalInput from './components/TerminalInput'
import CommandSuggestions from './components/CommandSuggestions'
import { LanguageSelector } from './components/LanguageSelector'
import { useI18n } from './i18n/I18nContext'
import { IntentInterpreterAgent } from './agents/IntentInterpreter'
import { RobotAgent } from './agents/RobotAgent'

export default function Home() {
  const [robotState, setRobotState] = useState('IDLE')
  const robotAgentRef = useRef(new RobotAgent())
  const { t } = useI18n()

  useEffect(() => {
    // Listen for action completion and reset robot state to IDLE
    const handleActionComplete = () => {
      const robot = robotAgentRef.current
      robot.finishAction()
      setRobotState(robot.getState())
    }

    window.addEventListener('robot-action-complete', handleActionComplete)
    return () => {
      window.removeEventListener('robot-action-complete', handleActionComplete)
    }
  }, [])

  const handleCommand = async (command: string) => {
    // Intent Interpreter Agent: Parse command
    const intent = await IntentInterpreterAgent.interpretWithAI(command)
    console.log('Command:', command, '→ Intent:', intent)

    if (intent === 'UNKNOWN') {
      console.warn('Unknown command')
      return
    }

    // Robot Agent: Execute action
    const robot = robotAgentRef.current
    const success = robot.executeAction(intent)

    if (success) {
      setRobotState(robot.getState())
      // Emit event to RobotCanvas to trigger animation
      window.dispatchEvent(
        new CustomEvent('robot-action', { detail: { action: intent } })
      )
    }
  }

  return (
    <main className="relative w-full h-screen bg-neutral-950 text-neutral-200 overflow-hidden">
      {/* Background grid subtle */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] bg-[size:24px_24px]" />

      {/* Language Selector - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSelector />
      </div>

      {/* Header minimal */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h1 className="text-2xl font-semibold tracking-wide">
          {t.header.title}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">{t.header.subtitle}</p>
      </div>

      {/* Phaser Canvas */}
      <div className="absolute inset-0 flex items-center justify-center border border-red-500">
        <RobotCanvas />
      </div>

      {/* Terminal Input Component */}
      <TerminalInput onSubmit={handleCommand} robotState={robotState}>
        {(history, onSelect) => (
          <CommandSuggestions history={history} onSelect={onSelect} />
        )}
      </TerminalInput>
    </main>
  )
}
