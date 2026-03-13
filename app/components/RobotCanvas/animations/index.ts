'use client'

import { createIdleAnimation } from './idleAnimation'
import { createWalkRightAnimation } from './walkRightAnimation'
import { createWalkLeftAnimation } from './walkLeftAnimation'
import { createLookTerminalAnimation } from './lookTerminalAnimation'

export const createRobotAnimations = (scene: Phaser.Scene) => {
  createIdleAnimation(scene)
  createWalkRightAnimation(scene)
  createWalkLeftAnimation(scene)
  createLookTerminalAnimation(scene)
}
