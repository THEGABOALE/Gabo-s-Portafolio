import React from 'react'

function Header({ onNavClick, onLogoClick }) {
  return (
    <header className='glass-header'>
        {/* Agregamos el evento onClick al logo */}
        <div className='logo' onClick={onLogoClick}>GABO</div>
        
        <nav className='nav-links'>
            {/* Pasamos el evento, el ID de la sección y cómo quieres que se vea la URL */}
            <a href='/gabo/home' className='hover-link' onClick={(e) => onNavClick(e, 'hero', 'home')}>Home</a>
            <a href='/gabo/about' className='hover-link' onClick={(e) => onNavClick(e, 'about', 'about')}>About</a>
            <a href='/gabo/cv' className='hover-link' onClick={(e) => onNavClick(e, 'cv', 'cv')}>CV</a>
            <a href='/gabo/projects' className='hover-link' onClick={(e) => onNavClick(e, 'projects', 'projects')}>Projects</a>
            <a href='/gabo/skills' className='hover-link' onClick={(e) => onNavClick(e, 'skills', 'skills')}>Skills</a>
            <a href='/gabo/gallery' className='hover-link' onClick={(e) => onNavClick(e, 'gallery', 'gallery')}>Gallery</a>
            <a href='/gabo/contact' className='hover-link' onClick={(e) => onNavClick(e, 'contact', 'contact')}>Contact</a>
        </nav>
    </header>
  )
}

export default Header