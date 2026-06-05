export function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelector('.tab.active').classList.remove('active')
      tab.classList.add('active')
      const view = tab.dataset.view
      document.querySelectorAll('.view').forEach(el => {
        el.hidden = el.dataset.view !== view
      })
    })
  })
}
