import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Polling from './protocols/1polling.jsx'
import LongPolling from './protocols/2LongPolling.jsx'
import Websocket from './protocols/3Websocket.jsx'
import SocketIo from './protocols/4Socket.io.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('Polling')

  const tabs = [
    { name: 'Polling', component: <Polling /> },
    { name: 'LongPolling', component: <LongPolling /> },
    { name: 'Websocket', component: <Websocket /> },
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
