import { useState } from 'react'

function Header({ onNavClick, onLogoClick }) {
  const [menuOpen, setMenuOpen] = useState(false)

  // Al tocar un link: navegamos y cerramos el menú (importante en mobile)
  const handleLinkClick = (e, targetId, urlPath) => {
    onNavClick(e, targetId, urlPath)
    setMenuOpen(false)
  }

  const handleLogo = () => {
    onLogoClick()
    setMenuOpen(false)
  }

  return (
    <header className='glass-header'>
      {/* Agregamos el evento onClick al logo */}
      <div className='logo' onClick={handleLogo}>GABO</div>

      {/* Botón hamburguesa: solo visible en mobile vía CSS */}
      <button
        className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
        aria-label='Abrir menú de navegación'
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
        {/* Pasamos el evento, el ID de la sección y cómo quieres que se vea la URL */}
        <a href='/gabo/home' className='hover-link' onClick={(e) => handleLinkClick(e, 'hero', 'home')}>Home</a>
        <a href='/gabo/about' className='hover-link' onClick={(e) => handleLinkClick(e, 'about', 'about')}>About</a>
        <a href='/gabo/cv' className='hover-link' onClick={(e) => handleLinkClick(e, 'cv', 'cv')}>CV</a>
        <a href='/gabo/projects' className='hover-link' onClick={(e) => handleLinkClick(e, 'projects', 'projects')}>Projects</a>
        <a href='/gabo/skills' className='hover-link' onClick={(e) => handleLinkClick(e, 'skills', 'skills')}>Skills</a>
        <a href='/gabo/gallery' className='hover-link' onClick={(e) => handleLinkClick(e, 'gallery', 'gallery')}>Gallery</a>
        <a href='/gabo/contact' className='hover-link' onClick={(e) => handleLinkClick(e, 'contact', 'contact')}>Contact</a>
      </nav>
    </header>
  )
}

export default Header
