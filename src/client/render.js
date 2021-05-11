import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE, NEUTRAL_RADIUS } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 720;

function render() {
  const { me, others, bullets, neutrals } = getCurrentState();
  if (!me) {
    return;
  }

  // Draw background
  renderBackground(me.x, me.y);

  // Draw boundaries
  context.strokeStyle = 'black';
  context.lineWidth = 4;
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

  // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me));

  neutrals.forEach(renderNeutrals.bind(null, me));

  // Draw all players
  renderMe(me, me);
  others.forEach(renderPlayer.bind(null, me));
}

function renderBackground(x, y) {
  context.fillStyle = 'darkgray';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'white';
  context.fillRect(canvas.width / 2 - x, canvas.height / 2 - y, MAP_SIZE, MAP_SIZE);

  let b = 0;
  for (let a = 0; a <= MAP_SIZE - 100; a += 100) {
    context.strokeStyle = '#F1F1F1';
    context.lineWidth = 1;
    context.strokeRect((canvas.width / 2) + a - x, (canvas.height / 2) + b - y, 100, 100);

    if (a === MAP_SIZE - 100) {
      b += 100;
      a = -100;
      if (b === MAP_SIZE) {
        break;
      }
    }
  }
}

// Renders a ship at the given coordinates
function renderMe(me, player) {
  const { x, y, direction } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
    getAsset('ship.svg'),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();

  // Draw health bar
  context.fillStyle = 'lightgreen';
  context.fillRect(canvasX - PLAYER_RADIUS * 10, canvasY + PLAYER_RADIUS + 300,
    PLAYER_RADIUS * 20, 15);
  context.lineWidth = 2;
  context.strokeRect(canvasX - PLAYER_RADIUS * 10, canvasY + PLAYER_RADIUS + 300,
    PLAYER_RADIUS * 20, 15);

  context.fillStyle = 'red';
  context.fillRect(
    canvasX - PLAYER_RADIUS * 10 + PLAYER_RADIUS * 20 * (player.hp / PLAYER_MAX_HP) - 1,
    canvasY + PLAYER_RADIUS + 301,
    PLAYER_RADIUS * 20 * (1 - player.hp / PLAYER_MAX_HP),
    13,
  );
}

function renderPlayer(me, player) {
  const { x, y, direction } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
    getAsset('ship.svg'),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();
}

function renderBullet(me, bullet) {
  const { x, y } = bullet;
  context.drawImage(
    getAsset('bullet.svg'),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
}

function renderNeutrals(me, neutral) {
  const { x, y } = neutral;
  context.drawImage(
    getAsset('neutral.svg'),
    canvas.width / 2 + x - me.x - NEUTRAL_RADIUS,
    canvas.height / 2 + y - me.y - NEUTRAL_RADIUS,
    NEUTRAL_RADIUS * 2,
    NEUTRAL_RADIUS * 2,
  );
}


function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}
