import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3005";

function SocketIOChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
      appendMessage("Connected to Socket.io server.");
    });

    socketRef.current.on("message", (msg) => {
      appendMessage("Server: " + msg);
    });

    socketRef.current.on("disconnect", () => {
      appendMessage("Disconnected from server.");
    });

    return () => {
      socketRef.current.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  const appendMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const sendMessage = () => {
    if (input.trim() !== "" && socketRef.current) {
      socketRef.current.emit("message", input);
      appendMessage("You: " + input);
      setInput("");
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      <h1>Socket.io Chat (React)</h1>
      <div
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

export default SocketIOChat;