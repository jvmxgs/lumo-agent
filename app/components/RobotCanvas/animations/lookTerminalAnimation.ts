export const createLookTerminalAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'lookTerminal',
    frames: [
      { key: 'robot', frame: 4, duration: 1500 },
      { key: 'robot', frame: 5, duration: 500 },
    ],
    frameRate: 10,
    repeat: 0,
  })
}
