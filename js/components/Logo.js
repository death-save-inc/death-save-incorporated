const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?+*=:;<>/\\|_.-█▓▒░◆●§$%&!'.split('')
const esc = ch => ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch === '&' ? '&amp;' : ch

export function initLogo(trackElementId) {
  const track = document.getElementById(trackElementId)
  if (!track) return

  // Build DOM: logocell (masked yellow fill) + brand subtitle
  const cell = document.createElement('div')
  cell.className = 'logocell'
  const glyphLayer = document.createElement('div')
  glyphLayer.className = 'lc-glyph'
  glyphLayer.setAttribute('aria-hidden', 'true')
  cell.appendChild(glyphLayer)
  track.appendChild(cell)

  const sub = document.createElement('div')
  sub.className = 'brand-sub'
  sub.textContent = 'INCORPORATED'
  sub.style.cssText = 'text-align:center;margin-top:6px;font-size:14px;letter-spacing:.62em;text-indent:.62em'
  track.appendChild(sub)

  // Measure actual character dimensions for this font
  let CW = 8.8, LH = 16
  ;(function () {
    const probe = document.createElement('span')
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:15px/16px "ABC Diatype Mono",monospace'
    probe.textContent = 'M'.repeat(100)
    document.body.appendChild(probe)
    CW = probe.getBoundingClientRect().width / 100 || 8.8
    document.body.removeChild(probe)
  })()

  let cols = 10, rows = 4, grid = [], heat = []

  function resize() {
    const rect = glyphLayer.getBoundingClientRect()
    cols = Math.max(8, Math.ceil(rect.width / CW) + 1)
    rows = Math.max(3, Math.ceil(rect.height / LH) + 1)
    grid = new Array(cols * rows)
    heat = new Array(cols * rows).fill(0)
    for (let i = 0; i < grid.length; i++) {
      grid[i] = GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
  }

  function buildHTML() {
    let html = ''
    for (let r = 0; r < rows; r++) {
      let run = '', cls = '', line = ''
      const flush = () => {
        if (run) { line += cls ? `<${cls}>${run}</${cls}>` : run; run = '' }
      }
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        const k = heat[i] > 0 ? 'i' : (i * 73) % 5 === 0 ? 'b' : ''
        if (k !== cls) { flush(); cls = k }
        run += esc(grid[i])
      }
      flush()
      html += line + '\n'
    }
    return html
  }

  function tick() {
    if (!grid.length) return
    // Mutate ~10% of glyphs each frame
    const muts = (grid.length * 0.10) | 0
    for (let n = 0; n < muts; n++) {
      const i = (Math.random() * grid.length) | 0
      grid[i] = GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    // Decay heat
    for (let i = 0; i < heat.length; i++) {
      if (heat[i] > 0 && Math.random() < 0.5) heat[i]--
    }
    // Ignite new hot cells
    for (let n = 0; n < 6; n++) {
      if (Math.random() < 0.7) heat[(Math.random() * grid.length) | 0] = 1
    }
    glyphLayer.innerHTML = buildHTML()
  }

  resize()
  tick()
  setInterval(tick, 120)

  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => { resize(); tick() }, 200)
  })
}
