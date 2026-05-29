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

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: '#fff' }}>
      <h1>This is Gabo's Folio</h1>
      <p style={{ marginTop: '20px', opacity: 0.7, animation: 'blink 1.5s infinite' }}>[ ENTER ]</p>
    </div>
  )
}

export default Splash