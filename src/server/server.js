const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');
const mysql = require('mysql');

const Constants = require('../shared/constants');
const Game = require('./game');
//const Player = require('./player');
//const Bullet = require('./bullet');
const webpackConfig = require('../../webpack.dev.js');

const game = new Game();
//const player = new Player();

// Setup an Express server
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
} else {
  // Static serve the dist/ folder in production
  app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  socket.on('disconnect', onDisconnect);
  socket.on('leftClick',  handleShoot);
  socket.on('moveMessage', handleMove);
  socket.on(Constants.MSG_TYPES.CREATE_ACCOUNT, createAccount);
  socket.on(Constants.MSG_TYPES.LOGIN, loginFunc);
});

// Setup the Game
//const game = new Game();
//const player = new Player();
//const bullet = new Bullet();

function joinGame(username) {
  game.addPlayer(this, username);
}

function handleInput(dir) {
  game.handleInput(this, dir);
}

function onDisconnect() {
  game.removePlayer(this);
}

function handleShoot(shoot) {
  game.handleShoot(this, shoot);
}

function handleMove(right, down, left, up) {
  game.handleMove(this, right, down, left, up);
}

function createAccount(accountName, accountPass) { 
  console.log(accountName, accountPass);

    if (accountName && accountPass) {
    console.log('Request received');
    con.connect(function(err) {
        con.query("INSERT INTO groop.users (username, password) VALUES (?,?)", 
        [accountName, accountPass], 
        function(err, result) {
          if (err) //throw err;
          console.log(result);
        });
    });
} else {
    console.log('Missing a parameter');
}
}

function loginFunc(accountName, accountPass) { 
  if (accountName && accountPass) {
    console.log('Request received');
    con.connect(function(err) {
        con.query("SELECT * FROM groop.users WHERE username = ? AND password = ?", 
        [accountName, accountPass], 
        function(err, results) {
          if (err) throw err;
          if (results.length > 0) {
            console.log('login');
          } else{
            console.log('Incorrect Username and/or Password!');
          } 
        }); 
    });
} else {
    console.log('Missing a parameter');
}
//con.end();
}

// Connect to database
const con = mysql.createConnection({
  host: "groop.c80tgmzsdlmj.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "12345678",
  port: "3306",
  databse: "groop"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  /*
  con.query('CREATE DATABASE IF NOT EXISTS groop;');
  */
  con.query('USE groop;');
  con.query('CREATE TABLE IF NOT EXISTS users(username varchar(30) NOT NULL, password varchar(30) NOT NULL, nickname varchar(30), experience int, hat varchar(30), color varchar(30), class varchar(30), maximum_health int, accuracy float, eliminations int, games_played int, shots_fired int, shots_hit int, PRIMARY KEY(username));', function(error, result, fields) {
      console.log(result);
  });
  con.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });

//  con.end();
});

/*
app.post('/users', (req, res) => {
  if (req.query.username && req.query.password) {
      console.log('Request received');
      con.connect(function(err) {
          con.query(`INSERT INTO groop.users (username, password) VALUES ('${req.query.username}', '${req.query.password}')`, function(err, result, fields) {
              if (err) res.send(err);
              if (result) res.send({username: req.query.username, password: req.query.password});
              if (fields) console.log(fields);
          });
      });
  } else {
      console.log('Missing a parameter');
  }
});
*/
