const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3004 }); // Port 3004 for the websocket server

wss.on('connection', function connection(ws) {
  console.log('Client connected!');
  
  // Send a welcome message
  ws.send('Welcome to the WebSocket server!');

  // Handle messages from the client
  ws.on('message', function incoming(message) {
    console.log('received:', message);
    // Echo back the received message
    ws.send(`Server received: ${message}`);
  });

  // Optional: Periodic broadcast (e.g., time)
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(`Server time: ${new Date().toISOString()}`);
    }
  }, 5000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

console.log('WebSocket server running on ws://localhost:3001');