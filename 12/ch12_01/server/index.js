const express = require('express');
const http = require('http');
const socketIo = require('socket.io')

//리액트는 3000에서 실행되고 서버는 3030에서 실행되므로
//서로다른포트를 사용하기 때문에 CORS 설정을 통해 
//서버가 **localhost:3000**에서 오는 요청을 허용한다고 명시하면, 
//브라우저는 이를 허용하고 React 앱은 localhost:3030에 위치한 Socket.io 서버와 통신할 수 있게 됩
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { 
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        method: ["GET", "POST"]
    }
});

//socket.io받은 데이터를 처리하는 로직
//서버에서 클라이언트의 연결을 관리하고, 채팅 메시지를 처리하며, 연결 해제(disconnect) 시 로그를 남기는 역할
io.on('connection', (socket)=> { //클라이언트의 연결을 감지 //2단계
    console.log(`a user connected`, socket);

    socket.on('disconnect', ()=>{
        console.log('user disconnect');
    });

    socket.on('chat:message', (msg)=>{ //4단계
        console.log(`chat:message => ${msg}`);
        io.emit('chat:message', msg) //5단계
    });
});





server.listen(3030, ()=>{
    console.log(`socket.io server is running on 3030`)
})