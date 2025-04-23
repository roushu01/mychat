import React, { useEffect, useState } from 'react';
import Login from './pages/login';
import Chat from './pages/chat';

export default function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Clear userId from localStorage
    setUserId(null); // Update the app state
  };

  return (
    <>
      {userId ? (
        <Chat userId={userId} onLogout={handleLogout} />
      ) : (
        <Login onLogin={setUserId} />
      )}
    </>
  );
}
