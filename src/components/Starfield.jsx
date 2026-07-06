import { useRef, useEffect } from 'react'

/**
 * Campo estelar realista sobre <canvas>.
 * - Nebulosa/haze de fondo (da profundidad, "el universo" y no puntos sueltos)
 * - Estrellas con agrupamiento (clusters) además de las dispersas
 * - Variación de color/temperatura (blancas, azuladas, cálidas, algún cian)
 * - Parpadeo y parallax por estrella + estrellas fugaces esporádicas
 */
function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let width = 0
    let height = 0
    let dpr = 1
    let stars = []
    let shootingStars = []
    let nebula = null
    let animationId
    let last = performance.now()
    let nextShoot = last + rand(3000, 7000)

    function rand(min, max) {
      return Math.random() * (max - min) + min
    }

    // Temperatura de color: mayoría blancas, algunas azuladas/cálidas, pocas cian
    function starColor() {
      const r = Math.random()
      if (r < 0.68) return [255, 255, 255]
      if (r < 0.84) return [201, 221, 255] // blanco-azulado
      if (r < 0.96) return [255, 239, 216] // cálida
      return [130, 222, 255] // cian tenue (amarra con el tema)
    }

    function makeStar(x, y) {
      const radius = 0.4 + Math.pow(Math.random(), 2.2) * 1.6
      return {
        x: ((x % width) + width) % width,
        y: ((y % height) + height) % height,
        r: radius,
        baseAlpha: rand(0.25, 0.95),
        twinkleSpeed: rand(0.4, 1.8),
        phase: rand(0, Math.PI * 2),
        drift: rand(1.2, 2.4) + radius * 2.2, // parallax: más grande = más rápida
        color: starColor()
      }
    }

    function initStars() {
      const base = Math.floor((width * height) / 4200)
      stars = []
      // Dispersas (mayoría)
      const scattered = Math.floor(base * 0.72)
      for (let i = 0; i < scattered; i++) {
        stars.push(makeStar(Math.random() * width, Math.random() * height))
      }
      // Agrupadas en un par de cúmulos (rompe la uniformidad "plana")
      const clusters = 3
      const perCluster = Math.floor((base * 0.28) / clusters)
      const spread = Math.min(width, height) * 0.16
      for (let c = 0; c < clusters; c++) {
        const cx = Math.random() * width
        const cy = Math.random() * height
        for (let i = 0; i < perCluster; i++) {
          const angle = Math.random() * Math.PI * 2
          const dist = Math.pow(Math.random(), 2) * spread
          stars.push(makeStar(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist))
        }
      }
    }

    // Nebulosa: manchas radiales muy suaves pre-renderizadas una vez
    function buildNebula() {
      nebula = document.createElement('canvas')
      nebula.width = Math.max(1, width)
      nebula.height = Math.max(1, height)
      const nc = nebula.getContext('2d')
      const blobs = [
        { x: 0.2, y: 0.28, r: 0.55, c: [40, 62, 140] },
        { x: 0.78, y: 0.6, r: 0.62, c: [72, 32, 110] },
        { x: 0.52, y: 0.85, r: 0.5, c: [22, 82, 120] },
        { x: 0.88, y: 0.12, r: 0.42, c: [30, 92, 150] }
      ]
      const maxDim = Math.max(width, height)
      for (const b of blobs) {
        const cx = b.x * width
        const cy = b.y * height
        const rr = b.r * maxDim
        const g = nc.createRadialGradient(cx, cy, 0, cx, cy, rr)
        g.addColorStop(0, `rgba(${b.c[0]}, ${b.c[1]}, ${b.c[2]}, 0.13)`)
        g.addColorStop(1, `rgba(${b.c[0]}, ${b.c[1]}, ${b.c[2]}, 0)`)
        nc.fillStyle = g
        nc.fillRect(0, 0, width, height)
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      if (width === 0 || height === 0) return
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildNebula()
      initStars()
    }

    function spawnShootingStar() {
      shootingStars.push({
        x: rand(width * 0.05, width * 0.8),
        y: rand(0, height * 0.35),
        len: rand(90, 180),
        speed: rand(450, 750),
        angle: rand(Math.PI * 0.12, Math.PI * 0.28),
        alpha: 1
      })
    }

    function draw(now) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, width, height)

      // Nebulosa de fondo
      if (nebula) ctx.drawImage(nebula, 0, 0, width, height)

      // Estrellas
      for (const s of stars) {
        s.phase += s.twinkleSpeed * dt
        s.y -= s.drift * dt
        if (s.y < -2) {
          s.y = height + 2
          s.x = Math.random() * width
        }
        const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(s.phase))
        const alpha = s.baseAlpha * twinkle
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${alpha})`
        ctx.fill()
      }

      // Estrellas fugaces esporádicas
      if (now >= nextShoot) {
        spawnShootingStar()
        nextShoot = now + rand(6000, 13000)
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const sh = shootingStars[i]
        sh.x += Math.cos(sh.angle) * sh.speed * dt
        sh.y += Math.sin(sh.angle) * sh.speed * dt
        sh.alpha -= dt * 0.7
        if (sh.alpha <= 0 || sh.x > width + 200 || sh.y > height + 200) {
          shootingStars.splice(i, 1)
          continue
        }
        const tailX = sh.x - Math.cos(sh.angle) * sh.len
        const tailY = sh.y - Math.sin(sh.angle) * sh.len
        const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255, 255, 255, ${sh.alpha})`)
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(sh.x, sh.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()
      }

      animationId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield-canvas" aria-hidden="true" />
}

export default Starfield
