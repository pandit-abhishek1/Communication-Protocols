import React ,{use, useEffect, useState} from 'react'

const Polling = () => {
const [polling, setPolling] = useState(0);
     function pollServer() {
      fetch('http://localhost:3000/poll')
        .then(response => response.json())
        .then(data => {
          setPolling(`polling:${polling} Timestamp: ${data.timestamp}, Data: ${data.data}`);
        })
        .catch(err => {
          setPolling('Error: ' + err);
        });
    }

    // Poll every 6 seconds
setInterval(() => setPolling(polling + 1), 16000);
useEffect(() => {
    pollServer();
  }, [polling]);

  return (
    <div>
      <h2>Polling --<span>{polling}</span>.</h2>
    </div>
  )
}

    
export default Polling