import Grain from './components/Grain/Grain'
import Vignette from './components/Vignette/Vignette'
import HUD from './components/HUD/HUD'
import Header from './components/Header/Header'
import StatusBar from './components/StatusBar/StatusBar'
import SocialNav from './components/SocialNav/SocialNav'
import EntityCore from './components/EntityCore/EntityCore'
import Reticle from './components/Reticle/Reticle'
import InteractionHint from './components/InteractionHint/InteractionHint'
import Home from './sections/Home/Home'

function App() {
  return (
    <>
      <EntityCore />
      <Grain />
      <Vignette />
      <HUD />
      <Reticle />
      <InteractionHint text="MOVE CURSOR TO TARGET // CLICK TO INITIALIZE" />
      <Home />
      <Header activePage="home" />
      <StatusBar statusText="SYSTEM INITIALIZED // STATUS: ACTIVE" />
      <SocialNav />
    </>
  )
}

export default App
