import Starfield from './Starfield'
import Earth from './Earth'

function KarsCover() {
  return (
    <section id="kars-cover" className="kars-cover-section manga-theme">
      <Starfield />
      <Earth />

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