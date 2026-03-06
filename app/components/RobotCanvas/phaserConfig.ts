'use client'

export const initializePhaser = async () => {
  const Phaser = (await import('phaser')).default
  const { createRobotSceneClass } = await import('./scenes/RobotScene')

  // Create the RobotScene class with Phaser
  const RobotScene = createRobotSceneClass(Phaser)

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    // initial dimensions; will be overridden when the canvas resizes
    width: 800,
    height: 400,
    parent: 'robotCanvas',
    transparent: true,
    pixelArt: true,
    scene: RobotScene,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  }

  return new Phaser.Game(config)
}
