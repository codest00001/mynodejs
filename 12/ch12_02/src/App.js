import React, {useState, useEffect} from 'react';
import './App.css';
import io from 'socket.io-client'; //socket.io-client를 가져와서 클라이언트 측에서 소켓 연결을 설정할 수 있게 함

const socket = io("http://localhost:3030/", {withCredentials: true,}) //1단계


function App() {
  const [username, setUsername] = useState('');
  const [isLogined, setIsLogined] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(()=>{
    socket.on('login:success', (data)=>{
      setIsLogined(true);
      setRooms(data.rooms);
    });
    socket.on('room:created', (room)=>{
      setRooms((prevRooms)=> [...prevRooms, room])
    });
    socket.on('room:joined', (room)=>{
      alert(`joined room : ${room}`);
      setCurrentRoom(room);
    });
    socket.on('update:rooms', ((rooms) => {
      setRooms(rooms);
    }));
    socket.on('update:users', (users)=>{
      setUsers(users);
    });
    socket.on('user:joined', (user)=>{
      setMessage((prevMessage)=>[...prevMessage, `${user} joined this room`]);
    });
    socket.on('user:left',(user)=>{
      setMessage((prevMessage)=>[...prevMessage, `${user} left this room` ]);
    });
    //클라이언트 소켓에다가 on을 통해서 리스너를 붙임. 계속 메시지를 들음.
    //챗:메시지라는 게 서버에서 오면 콜백함수를 실행하는 것.
    socket.on('chat:message', (msg)=>{ //6단계
      console.log(msg);
      setMessages((prevMessage) => [...prevMessage, msg]);
    });

    return () => {
      socket.off('chat:message');
      socket.off('user:joined');
      socket.off('user:left');
      socket.off('room:joined');
      socket.off('update:users');
      socket.off('update:rooms');
       //컴포넌트가 언마운트될때 소켓 리스닝해제
    }
  },[])

  const sendMessage = (e) => {
    if(message.trim()) {
      socket.emit('chat:message', message); //3단계
      setMessage('') //메시지보내고나면 인풋창 비워지게
    }
  }
  return (
    <div className="App">
     {!isLogined ? (
      <div className="login">
      <h2>Login</h2>
      <input
        type="text"
        placeholder='Enter username'
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        </div>
     ):(
      <div className='chat-container'>
        <div className='create-room'>
          <h2>Create Room</h2>
          <input 
          type="text"
          placeholder='enter the room'
          value={roomName}
          onChange={(e)=>setRoomName(e.target.value)}
          />
          <button onClick={handleCreateRoom}>Create Room</button>
      </div> 
 


      </div> 
     )}
    </div>
  );
}

export default App;
