'use client'

import { dispatchActionComplete } from './utils/eventDispatcher'

export const handleMoveLeft = (
  scene: Phaser.Scene,
  robot: Phaser.GameObjects.Sprite
) => {
  robot.flipX = true
  robot.play('walkLeft')

  scene.tweens.add({
    targets: robot,
    x: robot.x - 100,
    duration: 800,
    onComplete: () => {
      robot.flipX = false
      robot.play('idle')
      dispatchActionComplete('MOVE_LEFT')
    },
  })
}
