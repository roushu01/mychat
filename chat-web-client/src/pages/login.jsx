import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:3000/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userId', data.userId);
        onLogin(data.userId);
      } else {
        setMessage(data.message || 'Something went wrong');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <input
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      /><br></br>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>
        {mode === 'login' ? 'Login' : 'Register'}
      </button>
      <p style={{ color: 'red' }}>{message}</p>
      <p>
        {mode === 'login' ? "Don't have an account?" : "Already registered?"}{' '}
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
}
