import HUD from './components/HUD/HUD'
import Header from './components/Header/Header'
import StatusBar from './components/StatusBar/StatusBar'
import SocialNav from './components/SocialNav/SocialNav'
import EntityCore from './components/EntityCore/EntityCore'
import InteractionHint from './components/InteractionHint/InteractionHint'
import Home from './sections/Home/Home'

function App() {
  return (
    <>
      <HUD />
      <Header activePage="home" />
      <StatusBar statusText="SYSTEM INITIALIZED // STATUS: ACTIVE" />
      <SocialNav />
      <EntityCore />
      <InteractionHint text="MOVE CURSOR TO TARGET // CLICK TO INITIALIZE" />
      <Home />
    </>
  )
}

export default App
