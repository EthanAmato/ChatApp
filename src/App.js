import './App.scss';
import { useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Chat from './Chat';


const socket = io.connect("http://localhost:3001")
function App() {

  const [isJoinedRoom, setIsJoinedRoom] = useState(false)
  const usernameRef = useRef();
  const roomRef = useRef();

  const joinRoom = () => {
    if (usernameRef.current.value !== "" && roomRef.current.value !== "") {
      setIsJoinedRoom(true);
      console.log("in")
      socket.emit("join_room", roomRef.current.value) // emit an event to the backend with event id "join_room" 
      // picked up in backend by socket.on("join_room")

    }
    else {

    }
  }


  return (
    <div className="App">
      {!isJoinedRoom && <div className='joinChatWrapper'>
        <h3>Join Chat</h3>
        <div className='joinChatInputs'>
          <label>Username</label>
          <input type="text" placeholder="John Smith" ref={usernameRef} />
          <label>Room ID</label>
          <input type="text" placeholder="Room ID" ref={roomRef} />
          <button onClick={joinRoom}>Join</button>
        </div>
      </div>}
      {
        isJoinedRoom &&
        <div className='joinChatWrapper chatting'>
          <Chat
            socket={socket}
            username={usernameRef.current.value}
            room={roomRef.current.value}
          />
        </div>
      }
    </div>
  );
}

export default App;
