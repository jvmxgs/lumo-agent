export const createWalkLeftAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'walkLeft',
    frames: scene.anims.generateFrameNumbers('robot', {
      start: 3,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  })
}
