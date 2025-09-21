
import { LiveAPIProvider } from './contexts/LiveAPIContext'
import Header from './components/Header'
import MainDashboard from './components/dashboard/MainDashboard'
import ControlTray from './components/console/control-tray/ControlTray'
import './components/dashboard/dashboard.css'

function App() {
  return (
    <LiveAPIProvider>
      <div className="app">
        <Header />
        <ControlTray />
        <MainDashboard />
      </div>
    </LiveAPIProvider>
  )
}

export default App