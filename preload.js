const { shell } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href]')
  links.forEach(link => {
    const url = link.getAttribute('href')
    link.addEventListener('click', e => {
      e.preventDefault()
      shell.openExternal(url)
    })
  })
})

