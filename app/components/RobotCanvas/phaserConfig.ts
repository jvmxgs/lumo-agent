'use client'

export const initializePhaser = async () => {
  const Phaser = (await import('phaser')).default
  const { createRobotSceneClass } = await import('./scenes/RobotScene')

  // Create the RobotScene class with Phaser
  const RobotScene = createRobotSceneClass(Phaser)

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent: 'robotCanvas',
    transparent: true,
    pixelArt: true,
    scene: RobotScene,
  }

  return new Phaser.Game(config)
}
