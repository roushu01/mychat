import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:3000");

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receiveMessage', msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.off('receiveMessage');
  }, []);

  const sendMessage = () => {
    const msg = { text: message };
    socket.emit('sendMessage', msg);
    setMessage('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Chat App</h2>
      <div style={{ border: '1px solid gray', padding: '10px', height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.text} <small style={{ color: 'gray' }}>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
