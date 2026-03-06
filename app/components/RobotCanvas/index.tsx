'use client'

import { useEffect } from 'react'
import { initializePhaser } from './phaserConfig'

const RobotCanvas = () => {
  useEffect(() => {
    let game: Phaser.Game | null = null

    ;(async () => {
      game = await initializePhaser()
    })()

    return () => {
      if (game) {
        game.destroy(true)
      }
    }
  }, [])

  return (
    <div
      id="robotCanvas"
      className="w-full max-w-2xl aspect-[2/1] rounded-lg shadow-lg mb-8"
    ></div>
  )
}

export default RobotCanvas
