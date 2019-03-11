
const electron = require('electron')
const path = require('path')
const remote = electron.remote
const ipc = electron.ipcRenderer

const closeBtn = document.querySelector('#closeBtn')
closeBtn.addEventListener('click', e => {
  let window = remote.getCurrentWindow()
  window.close()
})

const addSpotBtn = document.querySelector('#addSpot')
addSpotBtn.addEventListener('click', e => {
  ipc.send('update-notify-value', document.querySelector('#spot').value)
  let window = remote.getCurrentWindow()
  window.close()
})
