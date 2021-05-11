const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Bullet extends ObjectClass {
  constructor(parentID, x, y, dir) {
    super(shortid(), x, y, dir, Constants.BULLET_SPEED, 0);
    this.parentID = parentID;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    //super.update(dt);
    this.x += dt * this.speed * Math.sin(this.direction);
    this.y -= dt * this.speed * Math.cos(this.direction);
    return this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE;
  }
}

module.exports = Bullet;
