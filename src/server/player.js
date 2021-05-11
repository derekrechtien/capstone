const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
    this.shoot = 0;
    this.right = false;
    this.down = false;
    this.left = false;
    this.up = false;
  }

  // Returns a newly created bullet, or null.
  update(dt) {

    if (this.right) {
      this.x += dt * this.speed;
    }
    if (this.down) {
      this.y += dt * this.speed;
    }
    if (this.left) {
      this.x -= dt * this.speed;
    }
    if (this.up) {
      this.y -= dt * this.speed;
    }

    //this.x += dt * this.speed * Math.sin(this.direction);
    //this.y -= dt * this.speed * Math.cos(this.direction);

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // Fire a bullet, if needed
    this.fireCooldown -= dt;
    if (this.shoot == 1) {
      if (this.fireCooldown <= 0) {
        this.fireCooldown = Constants.PLAYER_FIRE_COOLDOWN;
        return new Bullet(this.id, this.x, this.y, this.direction);;
      }
    }
    return null;
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  onNeutralDamage() {
    if(this.hp <= 95) {
      this.hp += 5;
    } else {
      this.hp = Constants.PLAYER_MAX_HP;
    }
  }

  setShoot(shoot) {
    this.shoot = shoot;
  }

  setMove(right, down, left, up) {
    this.right = right;
    this.down = down;
    this.left = left;
    this.up = up;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
    };
  }
}

module.exports = Player;
