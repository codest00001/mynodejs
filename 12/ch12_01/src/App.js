import React, {useState, useEffect} from 'react';
import './App.css';
import io from 'socket.io-client'; //socket.io-client를 가져와서 클라이언트 측에서 소켓 연결을 설정할 수 있게 함

const socket = io("http://localhost:3030/", {withCredentials: true,}) //1단계


function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(()=>{
    //클라이언트 소켓에다가 on을 통해서 리스너를 붙임. 계속 메시지를 들음.
    //챗:메시지라는 게 서버에서 오면 콜백함수를 실행하는 것.
    socket.on('chat:message', (msg)=>{ //6단계
      console.log(msg);
      setMessages((prevMessage) => [...prevMessage, msg]);
    });

    return () => {
      socket.off('chat:message'); //컴포넌트가 언마운트될때 소켓 리스닝해제
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
     <h1>Message List</h1>
     <ul id="messages">
      {messages.map((msg, index)=>(
        <li key={index}>{msg}</li>
      ))}
      </ul>
      <h1>Send Message</h1>
      <input 
        id="input"
        type="text"
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
        >
        </input>
        <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
