const express = require('express');
const app = express();
const port = 3003;
const cors = require('cors');

app.use(cors());
// Simulated "new data" event (for demo purposes)
let lastData = null;
function generateData() {
  const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  lastData = {  value: arr[Math.floor(Math.random() * arr.length)] };
}
setInterval(generateData, 10000); // New data every 10 seconds

app.get('/longpoll', (req, res) => {
  const startTime = Date.now();
  const timeout = 20000; // 20 seconds max wait

  function checkForData() {
    if (lastData) {
      res.json({ timestamp: new Date().toLocaleString(), data: lastData.value });
      lastData = null; // Clear after sending
    } else if (Date.now() - startTime > timeout) {
      res.status(204).end(); // No content (timeout)
    } else {
      setTimeout(checkForData, 1000); // Check again in 1s
    }
  }

  checkForData();
});

app.listen(port, () => {
  console.log(`Long polling server running at http://localhost:${port}`);
});