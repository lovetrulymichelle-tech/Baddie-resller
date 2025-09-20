
import { LiveAPIProvider } from './contexts/LiveAPIContext'
import Header from './components/Header'
import BasicFace from './components/demo/basic-face/BasicFace'
import ControlTray from './components/console/control-tray/ControlTray'
import KeynoteCompanion from './components/demo/keynote-companion/KeynoteCompanion'

function App() {
  return (
    <LiveAPIProvider>
      <div className="app">
        <Header />
        <BasicFace />
        <ControlTray />
        <KeynoteCompanion />
      </div>
    </LiveAPIProvider>
  )
}

export default App