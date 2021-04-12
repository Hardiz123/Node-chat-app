const path = require('path')
var express = require("express");
const http = require("http"); //
const port = 3000 || process.env.PORT;
const publicDirectoryPath = path.join(__dirname,'../public')
const socketio = require("socket.io");
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage} = require('./utils/messages')
const {addUser,reomveUser,getUser,getUsersInRoom} = require('./utils/users');
const app = express();
const server = http.createServer(app); // we have to use socket.io
const io = socketio(server);

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("new connection started");

  socket.on('join',({username,room},callback)=>{
    const {error,user} = addUser({id:socket.id,username,room})
    if(error){
      return callback(error)
    }

    socket.join(user.room)

    socket.emit("message",generateMessage({username:"Admin",message:'Welcome!'})); // to that particular connection
    socket.broadcast.to(user.room).emit("message", generateMessage({message:`${user.username} has joined the chat!`})); // everyone but that particular connections
    io.to(user.room).emit('roomData',{
      room: user.room,
      users: getUsersInRoom(user.room)
    });
    callback();
    //io.to.emit--> send msg in a particular room
    // socket.broadcase.to.emit --> everyone except the client in a room
  })


  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter()
    const user = getUser(socket.id)
    if(filter.isProfane(message)){
      return callback('profanity is not allowed')
    }

    io.to(user.room).emit("message", generateMessage({username:user.username, message})); //to everyone
    callback()
  });


  socket.on('sendLocation',(pos,callback)=>{
    const user = getUser(socket.id);
    
    io.to(user.room).emit('locationMessage',generateLocationMessage({username:user.username,url:`https://google.com/maps?q=${pos.lat},${pos.long}`}));
    callback();
  })

  socket.on('disconnect',()=>{
    const user = reomveUser(socket.id);

    if(user){
       io.to(user.room).emit('message',generateMessage({message:`${user.username} has left!`}));  
       io.to(user.room).emit('roomData',{
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
    
  })


});




server.listen(port, () => {
  console.log("server Started at port " + port);
});
