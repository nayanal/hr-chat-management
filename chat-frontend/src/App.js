import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChatDashboard from './components/ChatDashboard';
import UserChatBox from './components/UserChatBox';
import './index.css'; // Import global styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatDashboard />} />
        <Route path="/chat/:username" element={<UserChatBox />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
