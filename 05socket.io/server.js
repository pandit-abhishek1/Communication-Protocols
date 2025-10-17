const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // Allow CORS for demo purposes
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send a welcome message
  socket.emit('message', 'Welcome to the Socket.io server!');

  // Handle messages from client
  socket.on('message', (data) => {
    console.log('Received from client:', data);
    // Echo back to the client
    socket.emit('message', `Server received: ${data}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3005, () => {
  console.log('Socket.io server running on http://localhost:3005');
});