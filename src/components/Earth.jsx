import { useRef, useEffect } from 'react'

/**
 * Tierra realista en perspectiva (Kars quedó orbitándola).
 * Proyección ortográfica de una esfera texturizada sobre canvas 2D:
 * - Textura equirectangular real (NASA Blue Marble, dominio público)
 * - Iluminación difusa con terminador día/noche + oscurecimiento del limbo
 * - Halo atmosférico cian, rotación lenta
 * No usa Three.js: mantiene el proyecto liviano y sin dependencias extra.
 */
function Earth() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let raf
    let disposed = false
    let size = 0      // lado del canvas en px de respaldo (cuadrado)
    let center = 0
    let R = 0         // radio del planeta (deja margen para el halo)
    let map = null    // textura: { data, w, h }
    let proj = null   // mapeo precalculado por pixel
    let rot = 0
    let last = performance.now()
    let acc = 0

    const sphereCanvas = document.createElement('canvas')
    const sphereCtx = sphereCanvas.getContext('2d')
    let sphereImg = null

    // Dirección del sol: bastante de lado (desde arriba-izquierda) para que haya
    // un terminador visible que le dé volumen esférico, no un disco plano
    const L = normalize(-0.72, 0.28, 0.48)

    function normalize(x, y, z) {
      const m = Math.hypot(x, y, z)
      return [x / m, y / m, z / m]
    }

    function buildProjection() {
      center = size / 2
      R = size * 0.4 // planeta al 80% del lienzo; el resto es para el halo
      sphereCanvas.width = size
      sphereCanvas.height = size
      sphereImg = sphereCtx.createImageData(size, size)

      const n = size * size
      proj = {
        inside: new Uint8Array(n),
        texRow: new Int32Array(n),
        baseU: new Float32Array(n),
        light: new Float32Array(n)
      }
      const texW = map.w
      const texH = map.h
      for (let py = 0; py < size; py++) {
        for (let px = 0; px < size; px++) {
          const i = py * size + px
          const x = (px - center + 0.5) / R
          const y = (py - center + 0.5) / R
          const d2 = x * x + y * y
          if (d2 > 1) {
            proj.inside[i] = 0
            continue
          }
          proj.inside[i] = 1
          const z = Math.sqrt(1 - d2)
          // normal de la esfera (y de pantalla va hacia abajo → arriba real = -y)
          const nx = x
          const ny = -y
          const nz = z
          const lat = Math.asin(ny)
          const lon = Math.atan2(nx, nz)
          proj.baseU[i] = lon / (2 * Math.PI) + 0.5
          const v = 0.5 - lat / Math.PI
          const ty = Math.min(texH - 1, Math.max(0, (v * texH) | 0))
          proj.texRow[i] = ty * texW
          // iluminación: difusa con terminador suave + poco ambiente (lado noche
          // oscuro = volumen) + oscurecimiento del limbo para redondear la esfera
          let diff = nx * L[0] + ny * L[1] + nz * L[2]
          if (diff < 0) diff = 0
          diff = Math.pow(diff, 0.85) // suaviza la línea del terminador
          const ambient = 0.12
          let shade = ambient + (1 - ambient) * diff
          shade *= 0.5 + 0.5 * z
          proj.light[i] = shade
        }
      }
    }

    function renderSphere() {
      const texW = map.w
      const src = map.data
      const out = sphereImg.data
      const { inside, texRow, baseU, light } = proj
      const n = size * size
      for (let i = 0; i < n; i++) {
        const o = i * 4
        if (!inside[i]) {
          out[o + 3] = 0
          continue
        }
        let u = baseU[i] + rot
        u -= Math.floor(u)
        const tx = (u * texW) | 0
        const s = (texRow[i] + tx) * 4
        const sh = light[i]
        out[o] = src[s] * sh
        out[o + 1] = src[s + 1] * sh
        out[o + 2] = src[s + 2] * sh
        out[o + 3] = 255
      }
      sphereCtx.putImageData(sphereImg, 0, 0)
    }

    function draw(now) {
      if (disposed) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      acc += dt

      rot += dt * 0.011 // ~1 vuelta cada 90s
      if (rot > 1) rot -= 1

      // Recalcula la esfera ~25fps (la rotación es lenta, no hace falta 60fps)
      if (map && proj && acc >= 0.04) {
        acc = 0
        renderSphere()
      }

      ctx.clearRect(0, 0, size, size)
      if (map && proj) {
        // Halo atmosférico sutil (capa fina, que se note sin iluminar de más)
        const g = ctx.createRadialGradient(center, center, R * 0.97, center, center, R * 1.13)
        g.addColorStop(0, 'rgba(120, 195, 255, 0.16)')
        g.addColorStop(0.55, 'rgba(90, 175, 255, 0.06)')
        g.addColorStop(1, 'rgba(90, 175, 255, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(center, center, R * 1.13, 0, Math.PI * 2)
        ctx.fill()
        // El planeta
        ctx.drawImage(sphereCanvas, 0, 0)
      }
      raf = requestAnimationFrame(draw)
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cssW = canvas.clientWidth
      if (!cssW) return
      size = Math.round(cssW * dpr)
      canvas.width = size
      canvas.height = size
      if (map) buildProjection()
    }

    const img = new Image()
    img.onload = () => {
      const tc = document.createElement('canvas')
      tc.width = img.naturalWidth
      tc.height = img.naturalHeight
      const tcx = tc.getContext('2d')
      tcx.drawImage(img, 0, 0)
      map = { data: tcx.getImageData(0, 0, tc.width, tc.height).data, w: tc.width, h: tc.height }
      resize()
    }
    img.src = '/earth.jpg'

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="earth-canvas" aria-hidden="true" />
}

export default Earth
