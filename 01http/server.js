// Simple Express server that returns a timestamp, simulating changing data

const express = require('express');
const cors = require('cors');
const app = express();

const port = 3001;

app.use(cors());

app.get('/http', (req, res) => {
  // Simulate changing data
  const data = Math.floor(Math.random() * 100);
  console.log(`Sending data: ${data}`);
  res.json({ timestamp: new Date().toLocaleString(), data });
});
app.listen(port, () => {
  console.log(`HTTP server running at http://localhost:${port}`);
});