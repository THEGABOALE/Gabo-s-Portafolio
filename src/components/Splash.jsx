import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        navigate('/gabo')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  // También se puede entrar tocando/haciendo click (fallback para mobile sin teclado)
  return (
    <div className="splash-screen" onClick={() => navigate('/gabo')} role="button" tabIndex={0}>
      <h1 className="splash-title">This is Gabo's Folio</h1>
      <p className="splash-enter">Toca o presiona [ ENTER ]</p>
    </div>
  )
}

export default Splash
