class Object {
  constructor(id, x, y, dir, speed, move) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.speed = speed;
    this.move = move;
  }
/*
  update(dt) {
    this.x += dt * this.speed * Math.sin(this.move);
    this.y -= dt * this.speed * Math.cos(this.move);
  }
*/
  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
/*
  setMove(move) {
    this.move = move;
  }
*/
  setDirection(dir) {
    this.direction = dir;
}

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}

module.exports = Object;
