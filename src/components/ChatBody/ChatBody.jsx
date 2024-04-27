import React, { useState, useEffect } from 'react';
import './ChatBody.css';
import axios from 'axios';

export function ChatBody() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    // Append the user's message to chat history immediately
    const updatedChatHistory = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(updatedChatHistory);

    // Clear input field after sending message
    setMessage('');

    // Delay rendering of user's message
    setTimeout(async () => {
      // Construct the request body
      const requestBody = {
        prompt_history: updatedChatHistory // Use the updated chat history including the user's message
      };

      try {
        const response = await axios.post('https://542d-109-107-242-237.ngrok-free.app/gen/', requestBody, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Check if the system's response contains code
        const systemResponse = response.data.prompt;
        const responseParts = systemResponse.split('```');
        const responseBlocks = responseParts.map((part, index) => {
          if (index % 2 === 0) {
            // Text part
            return <div key={index} style={{ textAlign: 'left', marginBottom: '10px' }}>{part}</div>;
          } else {
            // Code part
            return (
              <div key={index} style={{ textAlign: 'left', marginBottom: '10px' }}>
              <pre className="code-block" style={{ textAlign: 'left', position: 'relative' }}>
                {part}
                <button onClick={() => copyToClipboard(part)} className="copy-button">
                  <img id='cimg' src='../../src/assets/images/copy.png' alt='Copy' />
                </button>
              </pre>
            </div>
            
            );
          }
        });

        // Append the system's response to chat history
        setChatHistory([
          ...updatedChatHistory, // User's message
          { role: 'system', content: responseBlocks } // System's response
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
        // Handle errors
      }
    }, 500); // Adjust the delay time as needed
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    // Load chat history on component mount
    setChatHistory([]);
  }, []);

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <div id='chatbody'>
        {chatHistory.map((chat, index) => (
          <div key={index}>
            {chat.role === 'user' ? (
              <div id='user'>
                <img src='../../src/assets/images/usericon.png' alt='user' id='userimage'/>
                <div id='userm'>{chat.content}</div>
              </div>
            ) : (
              <div id='system'>   
                <img src='../../src/assets/images/sys.gif' alt='sys' id='sysimage'/> 
                <div id='sysm' style={{ textAlign: 'left' }}>{chat.content}</div>
                <button id='endchat'>End chat</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <input 
          id='textbox'
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress} 
          placeholder="Type your message here..."
        />
        <button id='send' onClick={sendMessage}>
          <img id='sendimg' src='../../src/assets/images/send.png'/>
        </button>
      </div>
    </div>
  );
}
