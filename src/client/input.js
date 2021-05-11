import { updateDirection } from './networking';
import { updateShoot } from './networking';
import { updateMove } from './networking';

var keyRight = false;
var keyDown = false;
var keyLeft = false;
var keyUp = false;

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onKeyDown(e) {
  var keyCode = e.keyCode;
  switch(keyCode) {
    case 68: //d
    case 39: //right arrow key
      keyRight = true;
      break;
    case 83: //s
    case 40: //down arrow key
      keyDown = true;
      break;
    case 65: //a
    case 37: //left arrow key
      keyLeft = true;
      break;
    case 87: //w
    case 38: //up arrow key
      keyUp = true;
      break;
  }
  updateMove(keyRight, keyDown, keyLeft, keyUp);
}

function onKeyUp(e) {
  var keyCode = e.keyCode;
  switch(keyCode) {
    case 68: //d
    case 39: //right arrow key
      keyRight = false;
      break;
    case 83: //s
    case 40: //down arrow key
      keyDown = false;
      break;
    case 65: //a
    case 37: //left arrow key
      keyLeft = false;
      break;
    case 87: //w
    case 38: //up arrow key
      keyUp = false;
      break;
  }
  updateMove(keyRight, keyDown, keyLeft, keyUp);
}

function onMouseClick(e) {
  updateShoot(1);
}

function onMouseUp(e) {
  updateShoot(0);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('mousedown', onMouseClick);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('mousedown', onMouseClick);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp)
}
