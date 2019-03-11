const remote = require('electron').remote
document.querySelector('#minimize').addEventListener('click', e => {
  let window = remote.getCurrentWindow()
  window.minimize()
})

document.querySelector('#close').addEventListener('click', e => {
  let window = remote.getCurrentWindow()
  window.close()
})
