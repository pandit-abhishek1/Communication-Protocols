// Simple Express server that returns a timestamp, simulating changing data

const express = require('express');
const cors = require('cors');
const app = express();

const port = 3000;

app.use(cors());

app.get('/poll', (req, res) => {
  // Simulate changing data
  const data = Math.floor(Math.random() * 100);
  console.log(`Sending data: ${data}`);
  res.json({ timestamp: new Date().toISOString(), data });
});
app.get('/', (req, res) => {
  // Simulate changing data
  res.json({message:"polling" });
});

app.listen(port, () => {
  console.log(`Polling server running at http://localhost:${port}`);
});