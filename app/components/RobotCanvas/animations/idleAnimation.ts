export const createIdleAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'idle',
    frames: [
      { key: 'robot', frame: 0, duration: 2000 },
      { key: 'robot', frame: 1, duration: 100 },
      { key: 'robot', frame: 2, duration: 100 },
      { key: 'robot', frame: 1, duration: 100 },
    ],
    frameRate: 10,
    repeat: -1,
  })
}
