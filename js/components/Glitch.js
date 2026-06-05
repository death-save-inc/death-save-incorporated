const GLITCH_SELECTOR = '.panel, .phead, .tab, .subbar, .statusline, .qtable tr, .bigbtn, .tradebar, .logocell'

export function initGlitch() {
  function jolt() {
    const els = document.querySelectorAll(GLITCH_SELECTOR)
    if (els.length) {
      const count = 1 + (Math.random() * 2 | 0)
      for (let i = 0; i < count; i++) {
        const el = els[(Math.random() * els.length) | 0]
        el.classList.add('glx')
        setTimeout(() => el.classList.remove('glx'), 170)
      }
    }
    setTimeout(jolt, 350 + Math.random() * 700)
  }
  setTimeout(jolt, 600)
}
