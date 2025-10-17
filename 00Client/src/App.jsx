import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Polling from './protocols/1polling.jsx'
import LongPolling from './protocols/2LongPolling.jsx'
import Websocket from './protocols/3Websocket.jsx'
import SocketIo from './protocols/4Socket.io.jsx'
function App() {

  return (
    <>
      <div>
          <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Protocols</h1>
      <div className="card">
        <ol>
          <li><Polling /></li>
          <li><LongPolling /></li>
          <li><Websocket /></li>
          <li><SocketIo /></li>
        </ol>
      </div>
      <p className="read-the-docs">
        Click <span className="link" href="#" target="_blank">here</span> to learn more
      </p>
    </>
  )
}

export default App
