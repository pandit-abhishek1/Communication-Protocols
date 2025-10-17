import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Http from './protocols/1http.jsx'
import Polling from './protocols/2polling.jsx'
import LongPolling from './protocols/3LongPolling.jsx'
import WebSocket from './protocols/4Websocket.jsx'
import SocketIo from './protocols/5Socket.io.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('Polling')

  const tabs = [
    { name: 'HTTP', component: <Http /> },
    { name: 'Polling', component: <Polling /> },
    { name: 'LongPolling', component: <LongPolling /> },
    { name: 'WebSocket', component: <WebSocket /> },
    { name: 'SocketIo', component: <SocketIo /> },
  ]

  return (
    <>
      <div>
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Protocols</h1>

      {/* --- Tab Buttons --- */}
      <div className="tab-buttons">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`tab-btn ${activeTab === tab.name ? 'active' : ''}`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* --- Tab Content --- */}
      <div className="card">
        {tabs.find((tab) => tab.name === activeTab)?.component}
      </div>

      <p className="read-the-docs">
        Click <span className="link" href="#" target="_blank">here</span> to learn more
      </p>
    </>
  )
}

export default App
