import { INITIAL_CASH, PROJ_HORIZONS, PROJ_DRIVERS, PROJ_MODES } from '../data.js'
import { asciiArea } from '../utils/chart.js'

const SERIES_LENGTH  = 150
const TICK_INTERVAL  = 5000   // ms between price updates
const fmt = v => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const rand = (a, b) => a + Math.random() * (b - a)

function makeProjection() {
  const pct  = (Math.random() * 180 + 15).toFixed(0)
  const cagr = (Math.random() * 60 + 8).toFixed(0)
  const h = PROJ_HORIZONS[(Math.random() * PROJ_HORIZONS.length) | 0]
  const d = PROJ_DRIVERS[(Math.random() * PROJ_DRIVERS.length) | 0]
  const m = PROJ_MODES[(Math.random() * PROJ_MODES.length) | 0]
  return `PROJECTION (${m}): <b>+${pct}%</b> through ${h}, ${d} — ${cagr}% CAGR.`
}

function buildProduct(name, price, lo, hi, desc) {
  const series = [price]
  let v = price
  for (let i = 0; i < SERIES_LENGTH - 1; i++) {
    v = v * (1 + (Math.random() - 0.5) * 0.012)
    series.unshift(v)
  }
  return { name, price, open: price, lo, hi, desc, series, qty: 0, invested: 0, projection: makeProjection() }
}

export function initMarket() {
  let cash = INITIAL_CASH

  const universe = [
    buildProduct('Spells 5e for iOS',   3.99, 0.01,  0.03,  'Easily track your spells, spell slots, create custom ones and slay your enemies.'),
    buildProduct('Roll for Initiative', 1.00, 0.005, 0.01,  'Turn order, automated. Your party acts; your enemies simply wait their turn to lose.'),
    ...Array.from({ length: 5 }, () => {
      const p = rand(0.20, 1.20)
      return buildProduct('NDA', p, 0.001, 0.007, 'Details sealed under non-disclosure. The market trades it anyway, on faith and fear.')
    }),
  ]

  let selected = universe[0]

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const chartEl    = document.getElementById('bigchart')
  const titleEl    = document.getElementById('chartTitle')
  const headEl     = document.getElementById('dsxHead')
  const hiTag      = document.getElementById('hiTag')
  const loTag      = document.getElementById('loTag')
  const buyBtn     = document.getElementById('buyBtn')
  const sellBtn    = document.getElementById('sellBtn')
  const holdInfo   = document.getElementById('holdInfo')
  const winEl      = document.getElementById('winlose')
  const briefNameEl = document.getElementById('briefName')
  const briefDescEl = document.getElementById('briefDesc')
  const briefProjEl = document.getElementById('briefProj')
  const totEl      = document.getElementById('totVal')
  const portEl     = document.getElementById('portVal')
  const freeEl     = document.getElementById('freeVal')
  const dayEl      = document.getElementById('dayPL')
  const allocBar   = document.getElementById('allocBar')
  const pfTable    = document.getElementById('pfTable')
  const pfEmpty    = document.getElementById('pfEmpty')
  const pfMeta     = document.getElementById('pfMeta')
  const pfCash     = document.getElementById('pfCash')
  const pfHold     = document.getElementById('pfHold')
  const pfTotal    = document.getElementById('pfTotal')
  const pfPL       = document.getElementById('pfPL')

  // ── Chart ─────────────────────────────────────────────────────────────────

  function chartCols() {
    const probe = document.createElement('span')
    probe.style.cssText = 'visibility:hidden;white-space:pre'
    probe.textContent = 'M'.repeat(50)
    chartEl.appendChild(probe)
    const charW = probe.getBoundingClientRect().width / 50
    chartEl.removeChild(probe)
    return Math.max(40, Math.floor((chartEl.clientWidth - 20) / charW) - 9)
  }

  function drawChart() {
    const series = selected.series, cur = selected.price
    const mx = Math.max(...series), mn = Math.min(...series)
    chartEl.className = 'ascii-chart' + (cur >= selected.open ? '' : ' dn')
    chartEl.innerHTML = asciiArea(series, chartCols(), 20, fmt)
    hiTag.textContent = fmt(mx)
    loTag.textContent = fmt(mn)
    titleEl.textContent = selected.name.toUpperCase()
    const pct = (cur / selected.open - 1) * 100
    headEl.textContent = fmt(cur) + '  ' + (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%'
    headEl.style.color = 'var(--inv-fg)'
    updateBrief()
    updateTradeUI()
  }

  function updateBrief() {
    if (briefNameEl) briefNameEl.textContent = selected.name.toUpperCase()
    if (briefDescEl) briefDescEl.textContent = selected.desc
    if (briefProjEl) briefProjEl.innerHTML   = selected.projection
  }

  // ── Account ───────────────────────────────────────────────────────────────

  function holdingsValue() {
    return universe.reduce((sum, it) => sum + it.qty * it.price, 0)
  }

  function refreshAccount() {
    const hold  = holdingsValue()
    const total = cash + hold
    totEl.textContent  = '€ ' + fmt(total)
    portEl.textContent = '€ ' + fmt(hold)
    freeEl.textContent = '€ ' + fmt(cash)
    const pl = total - INITIAL_CASH
    dayEl.textContent = (pl >= 0 ? '+' : '') + pl.toFixed(2)
    dayEl.className = 'hl'
    const frac = total > 0 ? Math.max(0, Math.min(1, hold / total)) : 0
    const filled = Math.round(frac * 10)
    allocBar.innerHTML = '[' + '#'.repeat(filled) + '<span class="e">' + '.'.repeat(10 - filled) + '</span>]'
  }

  function updateTradeUI() {
    holdInfo.textContent = selected.qty > 0
      ? `> holding ${selected.qty} @ avg €${fmt(selected.invested / selected.qty)}`
      : '> no position'
    buyBtn.disabled  = cash < selected.price
    sellBtn.disabled = selected.qty <= 0
  }

  // ── Trading ───────────────────────────────────────────────────────────────

  function buy(it) {
    if (cash < it.price) return
    cash -= it.price
    it.invested += it.price
    it.qty++
    afterTrade()
  }

  function sell(it) {
    if (it.qty <= 0) return
    const avg = it.invested / it.qty
    cash += it.price
    it.invested -= avg
    it.qty--
    if (it.qty === 0) it.invested = 0
    afterTrade()
  }

  function afterTrade() {
    refreshAccount(); renderWatchlist(); renderPortfolio(); updateTradeUI()
  }

  // ── Watchlist ─────────────────────────────────────────────────────────────

  function renderWatchlist() {
    const rows = universe
      .map(it => ({ ref: it, name: it.name, price: it.price, pct: (it.price / it.open - 1) * 100 }))
      .sort((a, b) => b.pct - a.pct)
      .map(d => {
        const dir = d.pct >= 0 ? 'up' : 'down'
        const sgn = d.pct >= 0 ? '+' : ''
        const sel = d.ref === selected ? ' class="sel"' : ''
        return `<tr${sel} data-idx="${universe.indexOf(d.ref)}">
          <td class="nm"><span class="arrow ${dir}"></span><span class="hl">${d.name}</span></td>
          <td class="price"><span class="hl">€ ${fmt(d.price)}</span></td>
          <td class="pct ${dir}"><span class="hl">${sgn}${d.pct.toFixed(2)}%</span></td>
          <td><span class="bs">
            <button class="b"><span class="hl">B</span></button>
            <button class="s"><span class="hl">S</span></button>
          </span></td>
        </tr>`
      })
    winEl.innerHTML = rows.join('')
  }

  // ── Portfolio ─────────────────────────────────────────────────────────────

  function renderPortfolio() {
    const held = universe.filter(it => it.qty > 0)
    pfMeta.textContent = held.length + ' POSITION' + (held.length === 1 ? '' : 'S')

    if (held.length === 0) {
      pfTable.innerHTML = ''
      pfEmpty.style.display = 'block'
    } else {
      pfEmpty.style.display = 'none'
      pfTable.innerHTML =
        '<tr class="pf-h">' +
        '<td class="nm dm">PRODUCT</td><td class="qty dm">QTY</td>' +
        '<td class="price dm">AVG</td><td class="price dm">LAST</td>' +
        '<td class="price dm">VALUE</td><td class="price dm">P/L</td><td></td>' +
        '</tr>' +
        held.map(it => {
          const avg = it.invested / it.qty
          const val = it.qty * it.price
          const pl  = val - it.invested
          const plClass = pl >= 0 ? 'pl-pos' : 'pl-neg'
          const plSign  = pl >= 0 ? '+' : ''
          return `<tr data-idx="${universe.indexOf(it)}">
            <td class="nm"><span class="hl">${it.name}</span></td>
            <td class="qty"><span class="hl">${it.qty}</span></td>
            <td class="price"><span class="hl">€ ${fmt(avg)}</span></td>
            <td class="price"><span class="hl">€ ${fmt(it.price)}</span></td>
            <td class="price"><span class="hl">€ ${fmt(val)}</span></td>
            <td class="price ${plClass}"><span class="hl">${plSign}${fmt(pl)}</span></td>
            <td style="text-align:right;white-space:nowrap">
              <button class="selll"><span class="hl" data-sell="1">SELL 1</span></button>
              <button class="selll"><span class="hl" data-sell="all">ALL</span></button>
            </td>
          </tr>`
        }).join('')
    }

    const hold = holdingsValue()
    pfCash.textContent  = '€ ' + fmt(cash)
    pfHold.textContent  = '€ ' + fmt(hold)
    pfTotal.textContent = '€ ' + fmt(cash + hold)
    const pl = (cash + hold) - INITIAL_CASH
    pfPL.textContent = (pl >= 0 ? '+' : '') + fmt(pl)
    pfPL.className = pl >= 0 ? 'pl-pos' : 'pl-neg'
  }

  // ── Event listeners ───────────────────────────────────────────────────────

  winEl.addEventListener('click', e => {
    const row = e.target.closest('tr[data-idx]')
    if (!row) return
    const it = universe[+row.dataset.idx]
    const bsBtn = e.target.closest('.bs button')
    if (bsBtn) { bsBtn.classList.contains('b') ? buy(it) : sell(it); return }
    selected = it
    drawChart(); renderWatchlist()
  })

  buyBtn.addEventListener('click',  () => buy(selected))
  sellBtn.addEventListener('click', () => sell(selected))

  pfTable.addEventListener('click', e => {
    const btn = e.target.closest('[data-sell]')
    if (!btn) return
    const row = btn.closest('tr[data-idx]')
    if (!row) return
    const it = universe[+row.dataset.idx]
    if (btn.dataset.sell === 'all') { while (it.qty > 0) sell(it) }
    else sell(it)
  })

  // ── Price simulation ──────────────────────────────────────────────────────

  function tickPrices() {
    universe.forEach(it => {
      const dir  = Math.random() < 0.5 ? -1 : 1
      const move = it.lo + Math.random() * (it.hi - it.lo)
      it.price *= (1 + dir * move)
      it.series.push(it.price)
      it.series.shift()
    })
    drawChart(); renderWatchlist(); refreshAccount(); renderPortfolio()
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  drawChart(); renderWatchlist(); refreshAccount(); renderPortfolio()
  setInterval(tickPrices, TICK_INTERVAL)

  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(drawChart, 120)
  })
}
