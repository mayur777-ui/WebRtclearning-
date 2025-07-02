import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SocketProvider } from './context/socket.jsx'
createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <SocketProvider>
    <App />
    </SocketProvider>
  </StrictMode>,
  
)
