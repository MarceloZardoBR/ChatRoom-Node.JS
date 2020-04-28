import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import DisplayRooms from './components/DisplayRooms';

import "./App.css";

function App({ match }) {
  const username = match.params.username;

  const [message, setMessage] = useState("");
  const [activedChat, setActivedChat] = useState(0);
  const [chats, setChats] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const msgRef = useRef();

  const socket = io("http://localhost:3333/", {
    query: {
      username: username,
    },
  });

  useEffect(() => {
    fetchChatsAndMessages();
    fetchAllChats();
  }, [username]);

  useEffect(() => {
    socket.emit('join', `${activedChat}`);
    
    socket.on('output', (msg) => {
      if(msg.activedChat === activedChat){
        const chatMsg = {
          username: msg.username,
          message: msg.message
        }
        setChatMessages([...chatMessages, chatMsg]);
      }
    });

    //validando se existe referencia, isso por conta da renderização condicional
    if (msgRef && msgRef.current) {
      msgRef.current.scrollIntoView(0, 0);
    }

  }, [chatMessages]);

  useEffect(() => {
    chats
      .filter((chat) => chat._id === activedChat)
      .map((c) => setChatMessages(c.messages));
      
  }, [activedChat]);

  const fetchChatsAndMessages = async () => {
    await axios
      .get("http://localhost:3333/user/chats/", {
        params: {
          username: username,
        },
      })
      .catch((err) => console.log(err))
      .then((res) => setChats(res.data));
  };

  const fetchAllChats = async () => {
    await axios.get("http://localhost:3333/chats/get")
      .then(res => {
        setRooms(res.data);
      }).catch(err => {
        alert(err);
      });
  };

  const onHandleSend = (e) => {
    e.preventDefault();
    const data = {
      activedChat,
      username,
      message,
    };
    socket.emit('input', { data });

    setMessage("");
  };

  const onCreateNewRoom = () => {
    axios.post('http://localhost:3333/chats/new',{
      username: username,
      room_name: newRoomName
    }).then(res => {
      if(res.status === 200){
        fetchChatsAndMessages();
        fetchAllChats();
        setNewRoomName('');
      }
    }).catch(err => {
      if(err.response.status === 409){
        alert(err.response.data);
      }else{
        alert('Ocooreu um erro');
      }
    })
  }

  return (
    <div className="app-container">
      <div className="button-rooms-container">
        <p>Salas Ativas</p>
        {chats.map((chat, index) => (
          <button key={chat._id} onClick={() => setActivedChat(chat._id)}>
            {chat.roomName}
          </button>
        ))}
      </div>
      <div className="display-chat-container">
        <div className="new-chat-container">
          <input placeholder={"Nome do Chat"} onChange={event => setNewRoomName(event.target.value)} />
          <button onClick={onCreateNewRoom}>Criar</button>
        </div>
        <div className="main-chat">
          {chatMessages[0] ? (
            chatMessages.map((msg, index) =>
            <div className={"chat-box"}>
              {msg.username === username ? (
                <div className={"sended-message"} key={index} ref={msgRef}>
                  <p>{msg.message}</p>
                </div>
              ) : (
                <div className={"received-message"} key={index} ref={msgRef}>
                  <p>{msg.username}:</p>
                  <p>{msg.message}</p>
                </div>
              )}
            </div>
            )
          ) : (
            <p>Mensagens...</p>
          )}
        </div>
        <form onSubmit={onHandleSend}>
          <div className="main-input">
            <textarea
              placeholder={"Mensagem"}
              value={message}
              cols={40}
              rows={3}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type={"submit"}>Enviar</button>
          </div>
        </form>
      </div>
      <DisplayRooms rooms={rooms} username={username}/>
    </div>
  );
}

export default App;
