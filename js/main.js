import { initClock }       from './components/Clock.js'
import { initNewsFeed }    from './components/NewsFeed.js'
import { initMarket }      from './components/Market.js'
import { initLogo }        from './components/Logo.js'
import { initPanelFrames } from './components/PanelFrames.js'
import { initGlitch }      from './components/Glitch.js'
import { initTabs }        from './components/Tabs.js'

document.addEventListener('DOMContentLoaded', () => {
  initClock('statClock')
  initNewsFeed('news')
  initMarket()
  initLogo('tickerTrack')
  initPanelFrames()
  initGlitch()
  initTabs()
})
