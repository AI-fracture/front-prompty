import React, { useState, useEffect } from 'react';
import './ChatBody.css';
import axios from 'axios';

export function ChatBody() {
  // it had to be list
  const [message, setMessage] = useState('');
  const [prompt_history, setprompt_history] = useState([]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    // Append user message to chat history
    setprompt_history([...prompt_history, { role: 'user', content: message }]);

    // Send message to backend
    // console.log('prompt_history')
    try {
      const response = await axios({

            method:'post',
            url:'https://542d-109-107-242-237.ngrok-free.app/gen/',
            data:{
                prompt_history:prompt_history

            }

      });
      // Append response from backend to chat history
      setprompt_history([...prompt_history, { role: 'system', content: response.data }]);
    } catch (error) {
    }
      console.error('Error sending message:', error);

    // Clear input field after sending message
    setMessage('');
  };

  useEffect(() => {
    // Load chat history on component mount
    // You may want to fetch the chat history from the backend here
    // For simplicity, I'm initializing with an empty array
    setprompt_history([]);
  }, []);

  return (
    <div>
      <div>
        {prompt_history.map((chat, index) => (
          <div key={index}>
            {chat.role === 'user' ? (
              <div id='userm' style={{ textAlign: 'left' }}>
                <img src='../../src/assets/images/usericon.png' alt='user' id='userimage'/> {chat.content}
              </div>
            ) : (
              <div style={{ textAlign: 'right' }}>
                <strong>System:</strong> {chat.content}
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

