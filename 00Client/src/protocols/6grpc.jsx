import React, { useEffect, useRef, useState } from "react";
// Import generated gRPC-Web code
import { ChatServiceClient } from "./grpc/chat_pb_service";
import { ChatMessage, Empty } from "./grpc/chat_pb";

const client = new ChatServiceClient("http://localhost:8080"); // grpc-web proxy endpoint

function ChatGrpc() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const stream = client.streamMessages(new Empty());
    stream.on("data", (msg) => {
      setMessages((prev) => [...prev, { user: msg.getUser(), text: msg.getText() }]);
    });
    stream.on("error", (err) => {
      console.error('Stream error:', err);
    });
    stream.on("end", () => {
      console.log('Stream ended');
    });
    return () => stream.cancel();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = new ChatMessage();
    msg.setUser("ReactUser");
    msg.setText(input);
    client.sendMessage(msg, {}, (err, response) => {
      if (err) console.error(err);
      else console.log(response.getStatus());
    });
    setInput("");
  };

  return (
    <div>
      <h1>gRPC-Web Chat</h1>
      <div style={{ border: "1px solid #ccc", height: 200, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i}><b>{m.user}:</b> {m.text}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        style={{ marginTop: 8, marginRight: 5 }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatGrpc;