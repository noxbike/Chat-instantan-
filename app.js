const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var user = null;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('im connected', (name) => {
    socket.broadcast.emit('im connected', name);
  })

  socket.on('disconnect', (name) => {
    socket.broadcast.emit('delete disconnected user', socket.id);
  });

  socket.on('im connected too', (name) =>{
    socket.broadcast.emit('im connected too', name);
  })

  socket.on('is typing', (event) => {
    socket.broadcast.emit(`is typing`, event);
  })

  socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});