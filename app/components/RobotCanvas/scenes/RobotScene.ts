'use client'

import { createRobotAnimations } from '../animations'
import { handleRobotAction, type RobotAction } from '../handlers'

type PhaserType = typeof import('phaser')

export const createRobotSceneClass = (Phaser: PhaserType) => {
  return class RobotScene extends Phaser.Scene {
    private robot: Phaser.GameObjects.Sprite | null = null
    private isTyping = false

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
      // Create the robot sprite at the current center of the scene
      const centerX = this.scale.width / 2
      const centerY = this.scale.height / 2
      this.robot = this.add.sprite(centerX, centerY, 'robot')
      this.robot.setScale(4)

      // Create all animations
      createRobotAnimations(this)

      // Set up animation complete listener for lookTerminal
      this.robot?.on(
        'animationcomplete',
        (animation: Phaser.Animations.Animation) => {
          if (animation.key === 'lookTerminal' && this.isTyping) {
            this.robot?.play('lookTerminal')
          }
        }
      )

      // Start with idle animation
      // this.robot.play('idle')

      // Schedule random idle animation switches
      this.scheduleIdleSwitch()

      // Set up event listeners for robot actions
      this.setupRobotActionListeners()

      // make sure the robot stays centered if the canvas resizes
      this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
        if (this.robot) {
          this.robot.setPosition(gameSize.width / 2, gameSize.height / 2)
        }
      })
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

      window.addEventListener('robot-action-complete', () => {
        this.robot?.play(this.isTyping ? 'lookTerminal' : 'idle')
      })

      window.addEventListener('typing-start', () => {
        this.isTyping = true
        if (
          this.robot?.anims.currentAnim?.key === 'idle' ||
          this.robot?.anims.currentAnim?.key === 'idle2'
        ) {
          this.robot?.play('lookTerminal')
        }
      })

      window.addEventListener('typing-stop', () => {
        this.isTyping = false
        if (this.robot?.anims.currentAnim?.key === 'lookTerminal') {
          this.robot.play('idle')
        }
      })
    }

    /**
     * Schedule random switches between idle animations
     */
    private scheduleIdleSwitch() {
      this.time.addEvent({
        delay: Phaser.Math.Between(3000, 10000),
        callback: () => {
          if (this.isTyping) {
            this.scheduleIdleSwitch()
            return
          }
          if (Math.random() < 0.2) {
            this.robot?.play('idle2')
          } else {
            this.robot?.play('idle')
          }
          this.scheduleIdleSwitch()
        },
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
