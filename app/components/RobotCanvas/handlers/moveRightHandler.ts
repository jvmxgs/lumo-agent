'use client'

import { dispatchActionComplete } from './utils/eventDispatcher'

export const handleMoveRight = (
  scene: Phaser.Scene,
  robot: Phaser.GameObjects.Sprite
) => {
  robot.flipX = false
  robot.play('walkRight')

  scene.tweens.add({
    targets: robot,
    x: robot.x + 100,
    duration: 800,
    onComplete: () => {
      dispatchActionComplete('MOVE_RIGHT')
    },
  })
}
