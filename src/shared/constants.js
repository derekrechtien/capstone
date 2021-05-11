module.exports = Object.freeze({
  PLAYER_RADIUS: 32,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 200,
  PLAYER_FIRE_COOLDOWN: 0.25,

  BULLET_RADIUS: 12,
  BULLET_SPEED: 800,
  BULLET_DAMAGE: 10,

  NEUTRAL_RADIUS: 20,
  NEUTRAL_HEALTH: 10,

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 1,

  MAP_SIZE: 3000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    INPUTM: 'inputm',
    INPUTMB: 'inputmb',
    GAME_OVER: 'dead',
    CREATE_ACCOUNT: 'create_account',
    LOGIN: 'login',
  },
});
