import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Dashboard() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const [userChats, setUserChats] = useState([]);
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState(null);
  const navigate = useNavigate();

  const websocket = new WebSocket('ws://localhost:8080');
  useEffect(() => {
    fetchChats();

    return () => {
      if (ws) {
        ws.close();
        setWs(null);
      }
    };
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/chats');  
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

useEffect(() => { 
  websocket.onmessage = (event) => { 
    const newMessage = JSON.parse(event.data);     
    if (newMessage.chat_id === String(selectedChatId)) {       
      setUserChats((prevChats) => [...prevChats, newMessage]);
    }
  };
  
 }, [selectedChatId]);

  const openChat = async (chatId) => {
    setSelectedChatId(chatId);
    fetchUserChats(chatId);

    if (ws) {
      ws.close();
      setWs(null);
    }


    websocket.onopen = () => {
      console.log('✅ WebSocket connected for HR chat:', chatId);
    };
    setWs(websocket);

    return () => websocket.close();
  };

  const fetchUserChats = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:5000/chats/${chatId}`);    
      setUserChats(response.data);
    } catch (error) {
      console.error('Error fetching user chats:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const newMessage = { chat_id: selectedChatId, sender: 'HR', message };
    try {
      await axios.post('http://localhost:5000/messages', newMessage);

      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(newMessage));
        setUserChats((prevChats) => [...prevChats, newMessage]);
      } else {
        console.error("WebSocket is not open. Message not sent.");
      }

    
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">HR Chat Management - UniBox</h2>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>

      <table className="chat-table">
        <thead>
          <tr>
            <th>User Account</th>
            <th>Job Post ID</th>
            <th>Job Type</th>
            <th>Follow-up Date</th>
            <th>Status</th>
            <th>Platform</th>
            <th>Chat</th>
          </tr>
        </thead>
        <tbody>
          {chats.map((chat, index) => (
            <tr key={index}>
              <td>{chat.account_username}</td>
              <td>{chat.job_post_id}</td>
              <td>{chat.job_type || 'Not Assigned'}</td>
              <td>{chat.follow_up_date}</td>
              <td>{chat.status}</td>
              <td>{chat.platform}</td>
              <td>
                <button className="chat-btn" onClick={() => openChat(chat.id)}>Chat</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedChatId && (
        <div className="chat-window">
          <h3>Chat with User {selectedChatId}</h3>
          <div className="chat-messages">
            {userChats.map((msg, index) => (
              <div key={index} className="chat-message">
                <strong>{msg.sender}:</strong> {msg.message}
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
      )}
    </div>
  );
}

export default Dashboard;
