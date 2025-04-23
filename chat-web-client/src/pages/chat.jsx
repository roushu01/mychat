import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Chat({ userId, onLogout }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('receiveMessage');
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit('sendMessage', { text: message, from: userId });
    setMessage('');
    inputRef.current?.blur();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {userId}</h2>
      <div style={{ height: 300, overflowY: 'scroll', border: '1px solid #ccc', marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.from}:</b> {msg.text}{' '}
            <small>({new Date(msg.timestamp).toLocaleTimeString()})</small>
          </p>
        ))}
      </div>
      <input
        ref={inputRef}
        placeholder="Type message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      {/* Logout Button */}
      <button onClick={onLogout} style={{ marginTop: 20 }}>
        Logout
      </button>
    </div>
  );
}
