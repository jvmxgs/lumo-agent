export const initializePhaser = () => {
  const Phaser = require("phaser");
  
  let sceneContext: any = null;
  let robot: any = null;

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent: "robotCanvas",
    pixelArt: true,
    scene: {
      preload: function () {
        this.load.spritesheet("robot", "/robot-spritesheet.png", {
          frameWidth: 24,
          frameHeight: 22,
        });
      },
      create: function () {
        sceneContext = this;
        robot = this.add.sprite(400, 200, "robot");
        robot.setScale(4);

        // Define animations
        this.anims.create({
          key: "idle",
          frames: [
            { key: "robot", frame: 0, duration: 2000 },
            { key: "robot", frame: 1, duration: 100 },
            { key: "robot", frame: 2, duration: 100 },
            { key: "robot", frame: 1, duration: 100 },
          ],
          frameRate: 10,
          repeat: -1,
        });

        this.anims.create({
          key: "walkRight",
          frames: this.anims.generateFrameNumbers("robot", { start: 3, end: 8 }),
          frameRate: 10,
          repeat: -1,
        });

        this.anims.create({
          key: "walkLeft",
          frames: this.anims.generateFrameNumbers("robot", { start: 3, end: 8 }),
          frameRate: 10,
          repeat: -1,
        });

        robot.play("idle");

        // Listen for robot actions from Intent Interpreter
        window.addEventListener("robot-action", (event: Event) => {
          const customEvent = event as CustomEvent;
          const { action } = customEvent.detail;

          switch (action) {
            case "MOVE_LEFT":
              robot.flipX = true;
              robot.play("walkLeft");
              this.tweens.add({
                targets: robot,
                x: robot.x - 100,
                duration: 800,
                onComplete: () => {
                  robot.play("idle");
                  window.dispatchEvent(new CustomEvent("robot-action-complete", { detail: { action } }));
                },
              });
              break;

            case "MOVE_RIGHT":
              robot.flipX = false;
              robot.play("walkRight");
              this.tweens.add({
                targets: robot,
                x: robot.x + 100,
                duration: 800,
                onComplete: () => {
                  robot.play("idle");
                  window.dispatchEvent(new CustomEvent("robot-action-complete", { detail: { action } }));
                },
              });
              break;

            case "JUMP":
              this.tweens.add({
                targets: robot,
                y: robot.y - 80,
                duration: 400,
                yoyo: true,
                onComplete: () => {
                  robot.play("idle");
                  window.dispatchEvent(new CustomEvent("robot-action-complete", { detail: { action } }));
                },
              });
              break;
          }
        });
      },
      update: function () {
        // Game loop logic here
      },
    },
  };

  return new Phaser.Game(config);
};