export const createWalkRightAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'walkRight',
    frames: scene.anims.generateFrameNumbers('robot', {
      start: 3,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  })
}
