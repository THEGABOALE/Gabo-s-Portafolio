import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Splash from './components/Splash'
import Portafolio from './components/Portafolio' 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        
        {/* El asterisco permite que /gabo/home o /gabo/projects funcionen sin romper la app */}
        <Route path="/gabo/*" element={<Portafolio />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App