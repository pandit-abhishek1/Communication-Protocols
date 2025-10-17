import React, { useEffect, useRef, useState } from "react";

const WEBSOCKET_URL = "ws://localhost:3004";

function WebSocket() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  // Establish WebSocket connection
  useEffect(() => {
    ws.current = new window.WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      appendMessage("Connected to WebSocket server.");
    };

    ws.current.onmessage = (event) => {
      appendMessage("Server: " + event.data);
    };

    ws.current.onclose = () => {
      appendMessage("WebSocket connection closed.");
    };

    ws.current.onerror = (err) => {
      appendMessage("WebSocket error: " + err.message);
    };

    // Cleanup on unmount
    return () => {
      ws.current && ws.current.close();
    };
    // Only run on mount/unmount
    // eslint-disable-next-line
  }, []);

  // Helper to update messages
  const appendMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  // Send message via WebSocket
  const sendMessage = () => {
    if (ws.current && ws.current.readyState === 1 && input.trim() !== "") {
      ws.current.send(input);
      appendMessage("You: " + input);
      setInput("");
    }
  };

  // Allow sending with Enter key
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      <h1>WebSocket Chat (React)</h1>
      <div
        id="messages"
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "200px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <input
        id="input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder="Type a message..."
        style={{ marginRight: "5px" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default WebSocket;