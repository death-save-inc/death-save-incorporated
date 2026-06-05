import { INITIAL_NEWS, NEWS_SUBJECTS, NEWS_TEMPLATES } from '../data.js'

export function initNewsFeed(feedElementId) {
  const feed = document.getElementById(feedElementId)
  if (!feed) return

  const pick = arr => arr[Math.floor(Math.random() * arr.length)]
  const recent = []

  function headline() {
    let h, tries = 0
    do { h = pick(NEWS_TEMPLATES)(pick(NEWS_SUBJECTS)); tries++ }
    while (recent.includes(h) && tries < 40)
    recent.push(h)
    if (recent.length > 24) recent.shift()
    return h
  }

  function stamp() { return new Date().toTimeString().slice(0, 5) }

  let items = INITIAL_NEWS.map(([t, h]) => ({ t, h }))

  function render() {
    feed.innerHTML = items.map(o =>
      `<tr><td><span class="hl">${o.t}</span></td><td><span class="hl">&gt; ${o.h}</span></td></tr>`
    ).join('')
  }

  function scheduleNext() {
    const delay = 10000 + Math.random() * 5000
    setTimeout(() => {
      items.unshift({ t: stamp(), h: headline() })
      items.pop()
      render()
      scheduleNext()
    }, delay)
  }

  render()
  scheduleNext()
}
