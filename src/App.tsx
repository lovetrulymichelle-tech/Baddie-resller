
import { LiveAPIProvider } from './contexts/LiveAPIContext'
import Header from './components/Header'
import BasicFace from './components/demo/basic-face/BasicFace'
import ControlTray from './components/console/control-tray/ControlTray'
import KeynoteCompanion from './components/demo/keynote-companion/KeynoteCompanion'
import WhatsNext from './components/demo/whats-next/WhatsNext'

function App() {
  return (
    <LiveAPIProvider>
      <div className="app">
        <Header />
        <BasicFace />
        <ControlTray />
        <WhatsNext />
        <KeynoteCompanion />
      </div>
    </LiveAPIProvider>
  )
}

export default App