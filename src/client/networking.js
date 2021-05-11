import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';
import { processGameUpdate } from './state';

const Constants = require('../shared/constants');

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = onGameOver => (
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    socket.on('disconnect', () => {
      console.log('Disconnected from server.');
      document.getElementById('disconnect-modal').classList.remove('hidden');
      document.getElementById('reconnect-button').onclick = () => {
        window.location.reload();
      };
    });
  })
);

export const play = username => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};

export const updateDirection = throttle(20, dir => {
  socket.emit(Constants.MSG_TYPES.INPUT, dir);
});

export const updateShoot = throttle(20, shoot =>  {
  socket.emit('leftClick', shoot);
});

export const updateMove = throttle(20, (keyRight, keyDown, keyLeft, keyUp) => {
  socket.emit('moveMessage', keyRight, keyDown, keyLeft, keyUp);
});

export const create_account = (accountName, accountPass)  => {
  socket.emit(Constants.MSG_TYPES.CREATE_ACCOUNT, accountName, accountPass);  //
};

export const loginFunc2 = (accountName, accountPass) => {
  socket.emit(Constants.MSG_TYPES.LOGIN, accountName, accountPass);
};
