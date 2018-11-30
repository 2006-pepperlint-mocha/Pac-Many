
import gs from '../GameState'
import player from '../entity/Player'
import brandon from '../entity/Brandon'
import gun from '../entity/Gun';
import Laser from '../entity/Laser'


export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');

    // Bind callback functions to the object context
    this.hit = this.hit.bind(this)
    this.collectGun = this.collectGun.bind(this)
    this.createGround = this.createGround.bind(this)
  }

  preload() {
    // Fg layer
    this.load.image('ground', 'assets/sprites/ground.png');
    this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {
      frameWidth: 340,
      frameHeight: 460,
    });
    this.load.image('gun', 'assets/sprites/gun.png');
    this.load.image('brandon', 'assets/sprites/brandon.png');
    this.load.image('laserBolt', 'assets/sprites/laserBolt.png');
  }

  create() {
    //ground
    gs.groundGroup = this.physics.add.staticGroup();
    gs.groundGroup.enableBody = true;
    this.createGround(160, 540);
    this.createGround(600, 540);
    // Brandon. The enemy.
    this.brandon = new brandon(this, 600, 400)
    // setImmovable(true) will make him not "pushable"
    // brandon = brandon.setImmovable(true).setGravityY(-300);
    // Josh. The player.
    this.player = new player(this, 20, 400)
    //gun
    this.gun = new gun(this, 300, 400, 'gun')
    // create a checker to see if the player collides with the gun
    this.physics.add.overlap(this.player, this.gun, this.collectGun, null, this);
    //laser stuff
    this.lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 40,
      runChildUpdate: true,
    });

    this.physics.add.overlap(this.brandon, this.lasers, this.hit, null, this);
    // create player's animations
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('josh', { start: 17, end: 20 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'jump',
      frames: [{ key: 'josh', frame: 17 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'idleUnarmed',
      frames: [{ key: 'josh', frame: 11 }],
      frameRate: 10,
    });

    this.anims.create({
      key: 'idleArmed',
      frames: [{ key: 'josh', frame: 6 }],
      frameRate: 10,
    });

    // assign the curors
    gs.cursors = this.input.keyboard.createCursorKeys();
     //create collions for all entities
     this.createCollisions()
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
   this.player.update(gs.cursors)

    if (gs.cursors.space.isDown && time > gs.lastFired) {
      if (this.player.armed) {
        this.addLaser(this.player.x, this.player.y, this.player.left)
        gs.lastFired = time + 100;
      }
    }
  }

  // Callback fn
  createGround(x, y) {
    let ground = gs.groundGroup.create(x, y, 'ground');
  }

  // Callback fn
  collectGun(player, gun) {
    gun.disableBody(true, true);
    this.player.armed = true;
    // player.setVelocityX(0)
    // player.anims.play('pickupGun')
  }

  // Callback fn
  hit(brandon, laser) {
    laser.setActive(false);
    laser.setVisible(false);
  }

  //Callback fn
  createCollisions() {
    this.physics.add.collider(this.gun, gs.groundGroup);
    this.physics.add.collider(this.player, gs.groundGroup);
    this.physics.add.collider(this.player, this.brandon);
    this.physics.add.collider(this.brandon, gs.groundGroup);
    this.physics.add.collider(this.lasers, this.brandon);
  }

  addLaser(x, y, left) {
    let laser = this.lasers.getFirstDead()
    if(!laser) {
      laser = new Laser(this, 0, 0);
      this.lasers.add(laser)
    }
    laser.fire(x, y, left)
  }
}