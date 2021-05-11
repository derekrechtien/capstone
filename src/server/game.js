const Constants = require('../shared/constants');
const Player = require('./player');
const applyCollisions = require('./collisions');
const Neutral = require('./neutrals');
const neutralCollisions = require('./neutralCollisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.neutrals = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  handleShoot(socket, shoot) {
    if (this.players[socket.id]) {
      this.players[socket.id].setShoot(shoot);
    }
  }

  handleMove(socket, right, down, left, up) {
    if (this.players[socket.id]) {
      this.players[socket.id].setMove(right, down, left, up);
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    if(this.neutrals.length < 150) {
        const x = Constants.MAP_SIZE * (Math.random());
	const y = Constants.MAP_SIZE * (Math.random());

	const newNeutral = new Neutral(0, x, y, 0);
        if (newNeutral) {
            this.neutrals.push(newNeutral);
	}
    }

    const neutralsToRemove = [];
    this.neutrals.forEach(neutral => {
      if (neutral.update(dt)) {
        // Destroy this bullet
        neutralsToRemove.push(neutral);
      }
    });
     this.neutrals = this.neutrals.filter(neutral => !neutralsToRemove.includes(neutral));


    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullet = player.update(dt);
      if (newBullet) {
        this.bullets.push(newBullet);
      }
    });

    const destroyedNeutrals = neutralCollisions(this.bullets, this.neutrals);
    destroyedNeutrals.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onNeutralDamage();
      }
    });
    this.bullets = this.bullets.filter(bullet => !destroyedNeutrals.includes(bullet));


    // Apply collisions, give players score for hitting bullets
    const destroyedBullets = applyCollisions(Object.values(this.players), this.bullets);
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
      }
    });
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyNeutrals = this.neutrals.filter(
      n => n.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      neutrals: nearbyNeutrals.map(n => n.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
