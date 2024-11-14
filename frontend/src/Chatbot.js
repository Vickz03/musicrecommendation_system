import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInput = (e) => setInput(e.target.value);

  const handleSend = async () => {
    if (!input) return; // Avoid sending empty input

    // Add the user's message to the chat
    setMessages([...messages, { text: input, sender: 'user' }]);
    const genre = input.toLowerCase();

    try {
      // Send request to backend
      const response = await axios.get(`http://localhost:5000/api/recommendations?genre=${genre}`);
      console.log('Backend Response:', response.data); // Log the response data for debugging

      // Format recommendations to be displayed
      const recommendations = response.data
        .map(rec => `${rec.name} by ${rec.artist} - [Spotify Link](${rec.url})`)
        .join('\n');

      // Add the bot's response to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        { text: recommendations, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "Sorry, I couldn't fetch recommendations at this time.", sender: 'bot' },
      ]);
    }

    setInput('');
  };

  return (
    <div>
      <h1>Music Recommendation Chatbot</h1>
      
      {/* Display chat messages */}
      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              margin: '5px 0'
            }}
          >
            <p><strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      
      {/* Input field and send button */}
      <input type="text" value={input} onChange={handleInput} placeholder="Enter a genre..." />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chatbot;
