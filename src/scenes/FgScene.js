import Player from "../entity/Player";
// import gun from "../entity/Gun";
// import Laser from "../entity/Laser";
import Floor from "../entity/Floor";
import Plat from "../entity/Plat";

export default class FgScene extends Phaser.Scene {
  constructor() {
    super("FgScene");

    // Lexically bind callback functions
    // this.hit = this.hit.bind(this);
    // this.collectGun = this.collectGun.bind(this);
    // this.fireLaser = this.fireLaser.bind(this);
  }

  preload() {
    // Sprites
    this.load.image("floor", "assets/sprites/floor.png");
    this.load.image("plat", "assets/sprites/earth-platform.png");

    this.load.spritesheet("red", "assets/spriteSheets/red.png", {
      frameWidth: 400,
      frameHeight: 400,
    });

    this.load.spritesheet("blue", "assets/spriteSheets/Blue.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet("black", "assets/spriteSheets/Black.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet("pink", "assets/spriteSheets/Pink.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
    // this.load.image("gun", "assets/sprites/gun.png");
    // this.load.image("brandon", "assets/sprites/brandon.png");
    // this.load.image("laserBolt", "assets/sprites/laserBolt.png");
    // // Sounds
    // this.load.audio("jump", "assets/audio/jump.wav");
    // this.load.audio("laser", "assets/audio/laser.wav");
  }

  create() {
    // Create the ground and lasers
    // this.createGroups();
    // this.add.image(500, 600, "floor");
    this.add.image(700, 400, "plat");
    this.add.image(300, 400, "plat");
    this.add.image(500, 200, "plat");
    // this.add.spritesheet("red", {});

    //
    // this.floor = new Floor(500, 600, "floor");
    this.player = new Player(this, 500, 500, "red").setScale(0.2);
    // this.player = new Player(this, 500, 500, "pink").setScale(1);

    this.floorGroup = this.physics.add.staticGroup({
      classType: Floor,
      active: true,
    });
    this.createFloor(500, 600);
    // Gun. Our sprite is a little large, so we'll scale it down
    // this.gun = new gun(this, 300, 400, "gun").setScale(0.25);

    // Create player's animations
    this.createAnimations();

    // Create sounds
    // this.jumpSound = this.sound.add("jump");
    // this.laserSound = this.sound.add("laser");
    // The laser sound is a bit too loud so we're going to turn it down
    // this.laserSound.volume = 0.5;

    // Assign the cursors
    this.cursors = this.input.keyboard.createCursorKeys();
    console.log(this.input.keyboard.createCursorKeys());
    // Create collions for all entities
    this.createCollisions();
    this.physics.add.collider(this.player, this.floorGroup);
    this.physics.add.collider(this.floorGroup, this.player);
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    this.player.update(this.cursors);
    // this.gun.update(
    // time,
    // this.player,
    // this.cursors,
    // this.fireLaser,
    // this.laserSound
    // );
    // this.enemy.update(this.screamSound);
  }

  // Make the ground
  createFloor(x, y) {
    this.floorGroup.create(x, y, "floor");
  }

  // Make all the groups
  createGroups() {
    // this.plats = this.physics.add.group({
    //   classType: Plat,
    //   maxSize: 200,
    //   runChildUpdate: true,
    //   allowGravity: false,
    // });
  }

  // Callback fn
  // collectGun(player, gun) {
  //   gun.disableBody(true, true);
  //   this.player.armed = true;
  // }

  // Callback fn
  // hit(enemy, laser) {
  //   laser.setActive(false);
  //   laser.setVisible(false);
  // }

  // Make collisions
  createCollisions() {
    // this.physics.add.collider(this.gun, this.groundGroup);
    // this.physics.add.collider(this.player, this.floorGroup);
    // Important to put the enemy-ground collision before the player-enemy
    // collision so enemy bounces slightly when you jump on his head
    // this.physics.add.collider(this.enemy, this.groundGroup);
    // this.physics.add.collider(this.player, this.enemy);
    // this.physics.add.collider(this.lasers, this.enemy);
    // create a checker to see if the player collides with the gun
    // this.physics.add.overlap(
    //   // this.player,
    //   // this.gun,
    //   // this.collectGun,
    //   null,
    //   this
    // );
    // create a checker to see if the laser hits the enemy
    // this.physics.add.overlap(this.enemy, this.lasers, this.hit, null, this);
  }

  // Callback fn
  // fireLaser() {
  //   // These are the offsets from the player's position that make it look like
  //   // the laser starts from the gun in the player's hand
  //   const offsetX = 56;
  //   const offsetY = 14;
  //   const laserX =
  //     this.player.x + (this.player.facingLeft ? -offsetX : offsetX);
  //   const laserY = this.player.y + offsetY;

  //   // Get the first available laser object that has been set to inactive
  //   let laser = this.lasers.getFirstDead();
  //   // Check if we can reuse an inactive laser in our pool of lasers
  //   if (!laser) {
  //     // Create a laser bullet and scale the sprite down
  //     laser = new Laser(
  //       this,
  //       laserX,
  //       laserY,
  //       "laserBolt",
  //       this.player.facingLeft
  //     ).setScale(0.25);
  //     this.lasers.add(laser);
  //   }
  //   laser.reset(laserX, laserY, this.player.facingLeft);
  // }

  // Player animations
  createAnimations() {
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("red", { start: 1, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "jump",
      frames: [{ key: "red", frame: 2 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "idleUnarmed",
      frames: [{ key: "red", frame: 1 }],
      frameRate: 10,
    });
    this.anims.create({
      key: "idleArmed",
      frames: [{ key: "red", frame: 5 }],
      frameRate: 10,
    });
  }
}
