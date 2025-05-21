import React, { useEffect, useState } from 'react';
import './App.css';
import BlueprintCanvas from './BlueprintCanvas';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5001/')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Coordinator App</h1>
      <p className="server-status">{message}</p>
      <BlueprintCanvas />
    </div>
  )
}

export default App
