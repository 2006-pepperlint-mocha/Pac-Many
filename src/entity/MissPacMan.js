import "phaser";

export default class MissPacMan extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    let { scene, x, y, texture, frame } = data;
    super(scene.matter.world, x, y, texture, frame);
    this.scene.add.existing(this);
    this.name = "player";
    this.health = 1;
    this.score = 0;
    this._position = new Phaser.Math.Vector2(this.x, this.y);
    this.inputKeys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    const defaultCategory = 0x0001;
    const redCategory = 0x0002;
    const greenCategory = 0x0004;
    const blueCategory = 0x0008;

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const playerCollider = Bodies.circle(this.x, this.y, 6, {
      isSensor: false,
      label: "playerCollider",
    });
    playerCollider.collisionFilter = {
      category: redCategory,
      mask: defaultCategory | greenCategory,
    };
    // var playerSensor = Bodies.circle(this.x, this.y, 10, {
    //   isSensor: true,
    //   label: "playerSensor",
    // });
    const compoundBody = Body.create({
      parts: [playerCollider], //playerSensor],
      frictionAir: 0.35,
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();

    this.CreatePickupCollisions(playerCollider);
  }

  static preload(scene) {
    scene.load.atlas(
      "pacman_c",
      "/assets/maps/pacman/pacman_c.png",
      "/assets/maps/pacman/pacman_c_atlas.json"
    );

    scene.load.animation(
      "pacman_c_anim",
      "/assets/maps/pacman/pacman_c_anim.json"
    );
  }

  get velocity() {
    return this.body.velocity;
  }

  get dead() {
    return this.health <= 0;
  }

  get position() {
    this._position.set(this.x, this.y);
    return this._position;
  }

  hit = () => {
    this.health--;
    // console.log("PC hit");
  };

  update(scene) {
    console.log("update MissPacMan", this.score);
    //console.log("MissPacMan Location>>>", "x:", this.x, " y:", this.y);
    if (this.score >= 584) {
      window.location.reload();
      alert("Somebody won!");
    }
    if (this.x < 2) this.x = 470;
    if (this.x > 486) this.x = 10;

    //this.anims.play("pacman_right", true);

    const speed = 2.5;
    let playerVelocity = new Phaser.Math.Vector2();
    if (this.inputKeys.left.isDown) {
      playerVelocity.x = -100;
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = 100;
    }
    if (this.inputKeys.up.isDown) {
      playerVelocity.y = -100;
    } else if (this.inputKeys.down.isDown) {
      playerVelocity.y = 100;
    }

    playerVelocity.normalize();
    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x, playerVelocity.y);

    //console.log("vx:", this.velocity.x, " vy:", this.velocity.y);
    if (this.velocity.x > 0) {
      //console.log("RIGHT>>", "vx:", this.velocity.x, " vy:", this.velocity.y);
      this.anims.play("pacman_right", true);
    } else if (this.velocity.x < 0) {
      //console.log("LEFT>>", "vx:", this.velocity.x, " vy:", this.velocity.y);
      this.anims.play("pacman_left", true);
    }
    if (this.velocity.y < 0) {
      //console.log("UP>>", "vx:", this.velocity.x, " vy:", this.velocity.y);
      this.anims.play("pacman_up", true);
    } else if (this.velocity.y > 0.1) {
      //console.log("DOWN>>", "vx:", this.velocity.x, " vy:", this.velocity.y);
      this.anims.play("pacman_down", true);
    }
  } // end of updates

  CreatePickupCollisions(playerCollider) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: [playerCollider],
      callback: (other) => {
        if (other.gameObjectB && other.gameObjectB.pickup)
          other.gameObjectB.pickup();
        this.score++;
      },
      context: this.scene,
    });

    this.scene.matterCollision.addOnCollideActive({
      objectA: [playerCollider],
      callback: (other) => {
        if (other.gameObjectB && other.gameObjectB.pickup)
          other.gameObjectB.pickup();
      },
      context: this.scene,
    });
  }
}
