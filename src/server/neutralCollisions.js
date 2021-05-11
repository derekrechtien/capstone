const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
function neutralCollisions(bullets, neutrals) {
  const destroyedBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < neutrals.length; j++) {
      const bullet = bullets[i];
      const neutral = neutrals[j];
      if (
        bullet.parentID !== neutral.id &&
        neutral.distanceTo(bullet) <= Constants.NEUTRAL_RADIUS + 6
      ) {
        destroyedBullets.push(bullet);
        neutral.takeBulletDamage();
        break;
      }
    }
  }
  return destroyedBullets;
}

module.exports = neutralCollisions;
