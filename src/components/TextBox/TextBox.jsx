import React from 'react'
import './TextBox.css'
import React, { useState } from 'react';

const ChatBox = ({ onMessageSubmit }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onMessageSubmit(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="chat-box">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default ChatBox;

