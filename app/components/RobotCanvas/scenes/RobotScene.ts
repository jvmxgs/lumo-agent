'use client'

import { createRobotAnimations } from '../animations'
import { handleRobotAction, type RobotAction } from '../handlers'

type PhaserType = typeof import('phaser')

export const createRobotSceneClass = (Phaser: PhaserType) => {
  return class RobotScene extends Phaser.Scene {
    private robot: Phaser.GameObjects.Sprite | null = null

    constructor() {
      super({ key: 'RobotScene' })
    }

    /**
     * Preload assets (sprites, images, audio, etc.)
     */
    preload() {
      this.load.spritesheet('robot', './robot-spritesheet.png', {
        frameWidth: 24,
        frameHeight: 22,
      })
    }

    /**
     * Initialize scene and create game objects
     */
    create() {
      // Create the robot sprite
      this.robot = this.add.sprite(400, 200, 'robot')
      this.robot.setScale(4)

      // Create all animations
      createRobotAnimations(this)

      // Start with idle animation
      this.robot.play('idle')

      // Set up event listeners for robot actions
      this.setupRobotActionListeners()
    }

    /**
     * Register event listeners for user actions
     */
    private setupRobotActionListeners() {
      if (!this.robot) return

      window.addEventListener('robot-action', (event: Event) => {
        const customEvent = event as CustomEvent
        const { action } = customEvent.detail

        if (this.robot) {
          handleRobotAction(this, this.robot, action as RobotAction)
        }
      })
    }

    /**
     * Game loop update logic
     */
    update() {
      // Game loop logic here (called every frame)
    }
  }
}
