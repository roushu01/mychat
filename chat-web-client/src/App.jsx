import React, { useEffect, useState } from 'react';
import Login from './pages/login';
import Chat from './pages/chat';
import './App.css'; 

export default function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  return (
    <>
      {userId ? <Chat userId={userId} /> : <Login onLogin={setUserId} />}
    </>
  );
}
