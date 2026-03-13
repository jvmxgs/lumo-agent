export const createWalkLeftAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'walkLeft',
    frames: scene.anims.generateFrameNumbers('robot', {
      start: 7,
      end: 11,
    }),
    frameRate: 10,
    repeat: -1,
  })
}
