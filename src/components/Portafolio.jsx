import { useState, useEffect } from 'react'
import Header from './Header'
import KarsCover from './KarsCover'
import Hero from './Hero' 
import About from './About'
import CV from './CV' 
import Skills from './Skills'
import Projects from './Projects' 
import Gallery from './Gallery'
import Contact from './Contact'

function Portafolio() {
  // INICIA EN TRUE: Al pasar la pantalla de inicio, Kars te recibe por defecto.
  const [showKars, setShowKars] = useState(true)

  // Bloquea el scroll mientras la portada de Kars esté activa
  useEffect(() => {
    if (showKars) {
      // Volvemos arriba: si venías scrolleado abajo, Kars debe verse centrado, no el vacío
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, [showKars])

  // Al usar el Navbar, vamos a /gabo/... y quitamos a Kars
  const handleNavClick = (e, targetId, urlPath) => {
    e.preventDefault(); 
    setShowKars(false); 
    
    // La URL cambia a /gabo/home, /gabo/projects, etc.
    window.history.pushState(null, '', `/gabo/${urlPath}`);
    
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // EL SECRETO: Vuelve a Kars y la URL regresa a ser solo /gabo
  const handleLogoClick = () => {
    setShowKars(true);
    window.history.pushState(null, '', `/gabo`);
  }

  return (
    <>
      <Header onNavClick={handleNavClick} onLogoClick={handleLogoClick} />
      
      {showKars ? (
        <KarsCover />
      ) : (
        <main className="portfolio-content fade-in">
          <Hero />
          <About />
          <CV /> 
          <Skills />
          <Projects />
          <Gallery />
          <Contact />
        </main>
      )}
    </>
  )
}

export default Portafolio