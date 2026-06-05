export const SPARK_CHARS = '▁▂▃▄▅▆▇█'

export function seededSeries(n, seed) {
  let s = seed
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  let v = 0.6
  const out = []
  for (let i = 0; i < n; i++) {
    v += (rnd() - 0.5) * 0.16
    v = Math.max(0.05, Math.min(0.95, v))
    out.push(v)
  }
  const mn = Math.min(...out), mx = Math.max(...out), rng = (mx - mn) || 1
  return out.map(x => (x - mn) / rng)
}

export function sparkline(series, cols) {
  const N = series.length
  const out = []
  for (let c = 0; c < cols; c++) {
    const v = series[Math.round(c / (cols - 1) * (N - 1))]
    out.push(SPARK_CHARS[Math.max(0, Math.min(7, Math.round(v * 7)))])
  }
  return out.join('')
}

export function asciiArea(series, cols, rows, fmt) {
  const N = series.length
  const samp = []
  for (let c = 0; c < cols; c++) {
    samp.push(series[Math.round(c / (cols - 1) * (N - 1))])
  }
  const mn = Math.min(...samp), mx = Math.max(...samp), rng = (mx - mn) || 1
  const norm = samp.map(v => (v - mn) / rng)

  // 0 = empty, 1 = data point, 2 = vertical connector
  const g = Array.from({ length: rows }, () => new Array(cols).fill(0))
  let prevY = null
  for (let c = 0; c < cols; c++) {
    const y = Math.round((1 - norm[c]) * (rows - 1))
    if (prevY !== null) {
      const a = Math.min(prevY, y), b = Math.max(prevY, y)
      for (let r = a; r <= b; r++) if (g[r][c] === 0) g[r][c] = 2
    }
    g[y][c] = 1
    prevY = y
  }

  // Half-width katakana glyphs for visual texture
  const glyph = (c, code) => {
    if (code === 2) return 'ﾗ'
    const h = ((c * 2654435761) >>> 0) % 9
    return h === 0 ? 'ﾂ' : h === 1 ? '･' : h === 2 ? 'ﾈ' : 'ﾊ'
  }

  const gridRows = { 0: mx, [Math.floor((rows - 1) / 2)]: mn + rng * 0.5, [rows - 1]: mn }
  let html = ''
  for (let r = 0; r < rows; r++) {
    const isGrid = gridRows[r] !== undefined
    let runCls = null, runStr = '', lineHtml = ''
    const flush = () => {
      if (runStr) { lineHtml += `<span class="${runCls}">${runStr}</span>`; runStr = '' }
    }
    for (let c = 0; c < cols; c++) {
      const code = g[r][c]
      let ch, k
      if (code)                       { ch = glyph(c, code); k = 'pt' }
      else if (isGrid && c % 3 === 0) { ch = '·'; k = 'gd' }
      else                            { ch = ' '; k = 'c0' }
      if (k !== runCls) { flush(); runCls = k }
      runStr += ch
    }
    flush()
    const lab = isGrid ? ` <span class="lb">${fmt(gridRows[r])}</span>` : ''
    html += lineHtml + lab + '\n'
  }

  // x-axis
  html += `<span class="ax">└${'─'.repeat(cols - 1)}</span>\n`
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00']
  let axis = ' '.repeat(cols)
  times.forEach((t, i) => {
    const pos = Math.round(i / (times.length - 1) * (cols - t.length))
    axis = axis.slice(0, pos) + t + axis.slice(pos + t.length)
  })
  html += `<span class="ax">${axis}</span>`
  return html
}
