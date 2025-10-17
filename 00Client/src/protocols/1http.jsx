import React ,{use, useEffect, useState} from 'react'

const Http = () => {
    const [http, setHttp] = useState('No data yet');
     function httpServer() {
      fetch('http://localhost:3001/http')
        .then(response => response.json())
        .then(data => {
          setHttp(`Timestamp: ${data.timestamp}, Data: ${data.data}`);
        })
        .catch(err => {
          setHttp('Error: ' + err);
        });
    }

   useEffect(() => {
     httpServer();
   }, []);

  return (
    <div>
      <h2>HTTP --<span>{http}</span>.</h2>
    </div>
  )
}

    
export default Http