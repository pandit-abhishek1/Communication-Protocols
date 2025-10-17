import React ,{use, useEffect, useState} from 'react'

const Polling = () => {
    const [polling, setPolling] = useState('No data yet');
     function pollServer() {
      fetch('http://localhost:3002/poll')
        .then(response => response.json())
        .then(data => {
          setPolling(`Timestamp: ${data.timestamp}, Data: ${data.data}`);
        })
        .catch(err => {
          setPolling('Error: ' + err);
        });
    }

    // Poll every 16 seconds
    const intervalId = setInterval(pollServer, 16000);

  return (
    <div>
      <h2>Polling --<span>{polling}</span>.</h2>
    </div>
  )
}

    
export default Polling