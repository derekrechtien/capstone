const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Neutral extends ObjectClass {
  constructor(parentID, x, y, dir) {
    super(shortid(), x, y, dir, 0);
    this.parentID = parentID;
    this.hp = Constants.NEUTRAL_HEALTH;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    //super.update(dt);
    return this.hp === 0;
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }
}

module.exports = Neutral;
