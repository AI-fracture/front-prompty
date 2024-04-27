import React, { useState, useEffect } from 'react';
import './ChatBody.css';
import axios from 'axios';

export function ChatBody() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [chatEnded, setChatEnded] = useState(false); // State to track whether chat has ended

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
        const response = await axios.post('https://d429-109-107-225-147.ngrok-free.app/gen/', requestBody, {
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

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  const handleEndChat = () => {
    // Show end chat confirmation modal
    setShowEndChatModal(true);
  };

  const handleEndChatConfirm = async () => {
    // Hide end chat confirmation modal
    setShowEndChatModal(false);
    // Update state to indicate chat has ended
    setChatEnded(true);
  
    // Get the latest user message
    const latestUserMessage = chatHistory[chatHistory.length - 1].content[0].props.children;
    if (!latestUserMessage) {
      console.error('No user message found to send for humanization.');
      return;
    }
  
    // Construct the request body with the latest user message
    const requestBody = {
      role: 'system',
      content: latestUserMessage
    };
  
    try {
      const response = await axios.post('https://d429-109-107-225-147.ngrok-free.app/hue/', requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Extract the response content
      const responseData = response.data.prompt;
  
      // Append the response content to chat history
      setChatHistory([...chatHistory, { role: 'system', content: responseData }]);
    } catch (error) {
      console.error('Error sending end chat request:', error);
      // Handle errors
    }
  };
  

  const handleEndChatCancel = () => {
    // Hide end chat confirmation modal
    setShowEndChatModal(false);
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <div id='chatbody'>
        {chatHistory.map((chat, index) => (
          <div key={index}>
            {chat.role === 'user' ? (
              <div id='user'>
                <img src='../../src/assets/images/wuser.png' alt='user' id='userimage'/>
                <div id='userm'>{chat.content}</div>
              </div>
            ) : (
              <div id='system'>   
                <img src='../../src/assets/images/sys.gif' alt='sys' id='sysimage'/> 
                <div id='sysm' style={{ textAlign: 'left' }}>{chat.content}</div>
                {/* Only render the "End chat" button if chat hasn't ended */}
                {!chatEnded && <button id='endchat' onClick={handleEndChat}>End chat</button>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* End chat confirmation modal */}
      {showEndChatModal && (
        <div className="end-chat-modal">
          <p>Do you want to humanize it?</p>
          <div>
            <button id='yes' onClick={handleEndChatConfirm}>Yes</button>
            <button id='no' onClick={handleEndChatCancel}>No</button>
          </div>
        </div>
      )}

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
