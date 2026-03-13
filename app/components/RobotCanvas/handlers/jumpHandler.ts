'use client'

import { dispatchActionComplete } from './utils/eventDispatcher'

export const handleJump = (
  scene: Phaser.Scene,
  robot: Phaser.GameObjects.Sprite
) => {
  scene.tweens.add({
    targets: robot,
    y: robot.y - 80,
    duration: 400,
    yoyo: true,
    onComplete: () => {
      dispatchActionComplete('JUMP')
    },
  })
}
