import React from 'react'

function KarsCover() {
  return (
    <section id="kars-cover" className="kars-cover-section manga-theme">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      
      <div className="kars-content">
        <div className="kars-wrapper">
          <img src="/kars.png" alt="Kars floating" className="kars-image" />
        </div>
        
        <div className="quote-wrapper">
          <img src="/mangatext.png" alt="Manga narrative quote" className="quote-image" />
        </div>
      </div>
    </section>
  )
}

export default KarsCover