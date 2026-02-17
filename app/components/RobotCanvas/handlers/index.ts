'use client'

import { handleMoveLeft } from './moveLeftHandler'
import { handleMoveRight } from './moveRightHandler'
import { handleJump } from './jumpHandler'

export type RobotAction = 'MOVE_LEFT' | 'MOVE_RIGHT' | 'JUMP'

export const handleRobotAction = (
  scene: Phaser.Scene,
  robot: Phaser.GameObjects.Sprite,
  action: RobotAction
) => {
  switch (action) {
    case 'MOVE_LEFT':
      handleMoveLeft(scene, robot)
      break

    case 'MOVE_RIGHT':
      handleMoveRight(scene, robot)
      break

    case 'JUMP':
      handleJump(scene, robot)
      break

    default:
      console.warn(`Unknown action: ${action}`)
  }
}
