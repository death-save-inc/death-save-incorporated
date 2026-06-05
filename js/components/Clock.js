export function initClock(elementId) {
  const el = document.getElementById(elementId)
  if (!el) return
  const tick = () => { el.textContent = new Date().toTimeString().slice(0, 8) }
  tick()
  setInterval(tick, 1000)
}
