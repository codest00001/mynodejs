const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors : {
        origin: "http://localhost:3000/",
        method: ["GET","POST"],
        credentials: true,
    }
});

let users = {};
let rooms = {};

io.on('connection', (socket) => {
    console.log(`user connected : ${JSON.stringify(users)}, ${JSON.stringify(rooms)}`)

    //1.로그인처리 //사용자가 로그인 이벤트를 보내면 소켓으로 서버에서 받음
    //소켓은 두 장치 간에 실시간으로 데이터를 주고받기 위한 연결을 제공함.
    socket.on('login', (username) => {
        users[socket.id] = username;
        socket.emit('login:success', {username, rooms:Object.keys(rooms)});//로그인한사용자에게 로그인성공전송
        io.emit('update:users', Object.values(users));//
    })

    //2.사용자가 방생성 / 사용자가 방이름과 룸요청 키값을 같이 줄 것임
    //방이 존재하지 않을 때만 새로 방을 생성하고, 모든 사용자에게 방 목록을 업데이트하도록 하기
    socket.on('create:room', (room)=>{
        if(!rooms[room]){
            rooms[room] = [];
            socket.join(room);
            socket.emit('room:created', room);
            io.emit('update:rooms', Object.keys(rooms))
        }else{
            socket.emit('room:exists',room);
        }
    })


    //3.사용자가 방에 조인 
    //'room:joined', 'user:joined', 'room:notfound' 같은 것들은 이벤트 이름
    socket.on('join:room', (room)=>{
        if(rooms[room]){
            socket.join(room);
            socket.emit('room:joined', room);
            socket.to(room).emit('user:joined', users[socket.id]);
        }else{
            socket.emit('room:notfound', room);
        }
    });

    //4. 메시지전송 // send message, sendMessage
    socket.on('chat:message', ({room, message})=>{
        io.to(room).emit('chat:message', {user: users[socket.id], message}); //룸 안의 애들에게만 메시지보내기
    })

    //5. 사용자연결해제
    socket.on('disconnect', ()=>{
        if(users[socket.id]){
            io.emit('user:left', users[socket.id]);
            delete users[socket.id]
            io.emit('update:users', Object.values(users));
        }
    });

});

server.listen(3030, ()=>{
    console.log('server is running on 3030')
})