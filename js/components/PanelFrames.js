// Renders animated ASCII box-drawing borders around every .panel element.
// The title from .phead is embedded in the top border; .meta goes to the right side.

const TL = '┌', TR = '┐', BL = '└', BR = '┘', HZ = '─', VT = '│'

const esc = ch => ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch === '&' ? '&amp;' : ch

let CW = 9.4, LH = 19
;(function () {
  const probe = document.createElement('span')
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:16px/19px "ABC Diatype Mono",monospace'
  probe.textContent = 'M'.repeat(100)
  document.body.appendChild(probe)
  CW = probe.getBoundingClientRect().width / 100 || 7.8
  document.body.removeChild(probe)
})()

const panels = []

function register(el) {
  if (el.__frame) return
  el.__frame = 1
  const frame = document.createElement('div')
  frame.className = 'frame'
  frame.setAttribute('aria-hidden', 'true')
  el.appendChild(frame)
  panels.push({ el, frame, cols: 0, rows: 0, heat: null })
}

function readMeta(el) {
  const ph = el.querySelector(':scope > .phead')
  if (!ph) return { title: '', meta: '' }
  const metaEl = ph.querySelector('.meta')
  const meta = metaEl ? metaEl.textContent.trim() : ''
  let title = ph.textContent || ''
  if (metaEl) title = title.replace(metaEl.textContent, '')
  return { title: title.trim().toUpperCase(), meta: meta.toUpperCase() }
}

function measure(p) {
  const rect = p.el.getBoundingClientRect()
  p.cols = Math.max(6, Math.floor(rect.width / CW))
  p.rows = Math.max(3, Math.floor(rect.height / LH))
  p.heat = new Array(p.cols * p.rows).fill(0)
}

function render(p) {
  const { cols, rows, heat } = p
  const { title, meta } = readMeta(p.el)

  // Build top border with title embedded: ┌── ┤ TITLE ├ ──────────────────┐
  const top = new Array(cols).fill(HZ)
  top[0] = TL; top[cols - 1] = TR
  const titleLabel = '┤ ' + title + ' ├'
  for (let i = 0; i < titleLabel.length && 2 + i < cols - 2; i++) top[2 + i] = titleLabel[i]
  if (meta) {
    const metaLabel = '┤ ' + meta + ' ├'
    const start = cols - 2 - metaLabel.length
    for (let i = 0; i < metaLabel.length; i++) {
      const c = start + i
      if (c > 1 && c < cols - 1) top[c] = metaLabel[i]
    }
  }

  const bot = new Array(cols).fill(HZ)
  bot[0] = BL; bot[cols - 1] = BR

  let html = ''
  for (let r = 0; r < rows; r++) {
    let line = '', run = '', cls = ''
    const flush = () => {
      if (run) { line += cls ? `<${cls}>${run}</${cls}>` : run; run = '' }
    }
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c
      const hot = heat[i] > 0
      let ch, isBorder = false
      if (r === 0)              { ch = top[c]; isBorder = true }
      else if (r === rows - 1)  { ch = bot[c]; isBorder = true }
      else if (c === 0 || c === cols - 1) { ch = VT; isBorder = true }
      else { ch = ' ' }

      const k = hot ? 'i' : isBorder ? 'b' : ''
      if (ch === ' ') { if (cls) { flush(); cls = '' } run += ' '; continue }
      if (k !== cls) { flush(); cls = k }
      run += esc(ch)
    }
    flush()
    html += line + '\n'
  }
  p.frame.innerHTML = html
}

function tick() {
  for (const p of panels) {
    if (!p.el.offsetParent) continue
    if (!p.cols) measure(p)
    const { cols, rows, heat } = p

    // Decay existing hot cells
    for (let i = 0; i < heat.length; i++) {
      if (heat[i] > 0 && Math.random() < 0.5) heat[i]--
    }
    // Ignite traveling glints along the border
    for (let n = 0; n < 3; n++) {
      if (Math.random() < 0.7) {
        let c, r
        if (Math.random() < 0.5) { r = Math.random() < 0.5 ? 0 : rows - 1; c = (Math.random() * cols) | 0 }
        else                      { c = Math.random() < 0.5 ? 0 : cols - 1; r = (Math.random() * rows) | 0 }
        heat[r * cols + c] = 2
      }
    }
    render(p)
  }
}

export function initPanelFrames() {
  function scan() { document.querySelectorAll('.panel').forEach(register) }
  scan()
  for (const p of panels) { measure(p); render(p) }

  setInterval(tick, 140)
  setInterval(scan, 1500)   // pick up panels added dynamically

  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => { for (const p of panels) { measure(p); render(p) } }, 200)
  })
}
