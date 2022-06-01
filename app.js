const express = require('express');
const app = express();
const router = express.Router();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var bodyParser = require('body-parser')
var user = [];
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.get('/', (req, res) => {
    res.sendFile(__dirname +'/index.html')
});

function randomColor(){ 
  return Math.floor(Math.random()*16777215).toString(16);
}

io.on('connection', (socket) => {
  socket.on('im connected', (name) => {
    let newUser = {'id': socket.id, 'name': name, 'color': randomColor() }
    user.push(newUser);
    console.log(user)
    socket.broadcast.emit('im connected', newUser);
  })

  socket.on('im connected too', () =>{
    for(array in user){
      if(user[array].id == socket.id){
        socket.broadcast.emit('im connected too', user[array]);
      }
    }
    
  })

  socket.on('disconnect', () => {
    let name = ''
    for(array in user){
      if(user[array].id == socket.id){
        name = user[array].name
        user.splice(array, 1);
      }
    }
    socket.broadcast.emit('delete disconnected user', name );

  });


  socket.on('is typing', (event) => {
    socket.broadcast.emit(`is typing`, event);
  })

  socket.on('chat message', (msg) => {
      let info = {'msg': msg[0], 'name':msg[1], 'color': ''};
      for(array in user){
        if(user[array].id == socket.id){
        info.color = user[array].color
        }
      }
      console.log(user)
      io.emit('chat message', info);
    });
  });

  

server.listen(3000, () => {
  console.log('listening on *:3000');
});