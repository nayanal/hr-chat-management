import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function UserChatBox({ username }) {

  const [userChats, setUserChats] = useState([]);
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState(null);
  let location = useLocation();  
  const [chatId,setChatId] = useState(location.pathname.slice(-1));

   useEffect(() => {
     fetchUserChats();   
     if (!ws) { 
     const websocket = new WebSocket('ws://localhost:8080');    
     websocket.onmessage = (event) => {
       const newMessage = JSON.parse(event.data);
       setUserChats((prevChats) => {
        const isDuplicate = prevChats.some(msg => msg.message === newMessage.message);
        return isDuplicate ? prevChats : [...prevChats, newMessage];
      });  
     };
     setWs(websocket);
   return () => websocket.close();
  }
   }, [chatId]);

  const fetchUserChats = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/chats/${chatId}`);
      setUserChats(response.data);
    } catch (error) {
      console.error('Error fetching user chats:', error);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMessage = { chat_id:chatId, sender: 'User', message };
    
    ws.send(JSON.stringify(newMessage));
    setMessage('');
  };

  return (
    <div className="chat-window">
      <h3>Chat with HR</h3>
      <div className="chat-messages">
        {userChats.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.sender}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default UserChatBox;
