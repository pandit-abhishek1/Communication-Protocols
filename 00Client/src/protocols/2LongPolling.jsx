import React, {useEffect, useState} from 'react'

const LongPolling = () => {
  const [result, setResult] = useState("Waiting for data...");

  useEffect(() => {
    let isMounted = true;

    const longPoll = async () => {
      try {
        const response = await fetch("http://localhost:3001/longpoll");
        if (response.status === 204) {
          // No new data, poll again
          if (isMounted) longPoll();
          return;
        }
        const data = await response.json();
        if (isMounted) {
          setResult(`Timestamp: ${data.timestamp}, Value: ${data.data}`);
          longPoll(); // Start next poll immediately
        }
      } catch (err) {
        if (isMounted) {
          setResult("Error: " + err.message);
          setTimeout(longPoll, 2000); // Retry after error
        }
      }
    };

    longPoll();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div>{result}</div>
    </div>
  );
}

export default LongPolling