'use client'

import { createIdleAnimation } from './idleAnimation'
import { createWalkRightAnimation } from './walkRightAnimation'
import { createWalkLeftAnimation } from './walkLeftAnimation'

export const createRobotAnimations = (scene: Phaser.Scene) => {
  createIdleAnimation(scene)
  createWalkRightAnimation(scene)
  createWalkLeftAnimation(scene)
}
