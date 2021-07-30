const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server); //configuring our server to work with socket.io
const {generateMessage,generateLocationMessage} = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')

const port = 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{ //socket event ,//socket instance in the param has the information related to the connection
    console.log('New websocket connection')
    

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });        if(error){
            return callback(error);
        }
        socket.join(user.room) //socket give us join(available only in the server side) method to create chat room with the help of this we can emit events which are only be visible in that room only 
                          //join give us io.emit method like-  io.to.emit() it will emit event for every one in the room
                          // and socket.broadcast.to.emit 

        socket.emit('message',generateMessage('admin','Welcome'));//welcome message as connection establish with client
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined`));//emits event for all clients except the client who is triggering it
        
        io.to(user.room).emit('roomData',{
            room: user.room,
            uesrs: getUsersInRoom(user.room), //returnning [Function: getUsersInRoom] !!!!???
        })
        
        callback();
    })

    socket.on('sendMessage',(message, callback)=>{//message from a client
        const user = getUser(socket.id);
        console.log("here*",user)//user not found!!!??
        const filter = new Filter();
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }
        
        io.to(user.room).emit('message',generateMessage(user.username,message));
        callback();//acknoledgement
    })
  

    socket.on('sendLocation',(coords,callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    })



    socket.on('disconnect',()=>{//it will trigerred as client disconnect
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',generateMessage(user.username,`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                uesrs: getUsersInRoom(user.room),
            })
        }
        
    })

})
//connection and disconnect events are from socket library




server.listen(port, ()=>{
    console.log(`server running on port ${port}`);
})