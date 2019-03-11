const electron = require('electron')
const path = require('path')
const url = require('url')
const remote = require('electron').remote
const BrowserWindow = electron.remote.BrowserWindow
const ipc = electron.ipcRenderer
const storage = require('electron-json-storage')
const nav = document.querySelector('#nav')
const pa = document.querySelectorAll('link[rel="import"]')
const entryForm = require('./forms/entryForm')
const menu = require('./menu/menu')
const parse = require('form-parse')
const edit = require('./edit')
let db = require('./api/db')
let currentSpot

menu.loadSpots(nav)
const addBtn = document.querySelector('.addBtn')
let win = null

addBtn.addEventListener('click', e => {
  win = new BrowserWindow({
    width: 400,
    height: 200,
    title: 'Add Fishing Spot',
    backgroundColor: '#18191c',
    frame: false
  })
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../html/addSpot.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.once('ready-to-show', () => {
    win.show()
  })
  win.on('close', () => {
    win = null
  })
})

ipc.on('fishingSpot', (e, arg) => {
  if (arg !== '') {
    let data = {
      spot: arg,
      logs: []
    }

    storage.has(`${arg}`, (error, hasKey) => {
      if (error) throw error

      if (!hasKey) {
        storage.set(`${arg}`, data, error => {
          if (error) throw error
        })
        let a = document.createElement('a')
        a.innerText = arg
        a.addEventListener('click', e => {
          currentSpot = e.target.innerText
          // getLogs()
          menu.showEntries(currentSpot)
          console.log(currentSpot)
        })
        nav.appendChild(a)
      }
    })
  }
})
let imgPaths = [
  '../assets/img/moon.png',
  '../assets/img/sun.png',
  '../assets/img/thunder.png',
  '../assets/img/wind.png',
  '../assets/img/rain.png'
]
let imgArr = []
for (let i = 0; i < 5; i++) {
  imgArr[i] = new Image()
  imgArr[i].src = imgPaths[i]
}
/**
 * Shows entry template with correct data
 *
 * @param {object} obj the object with data for the entry
 * @param {String} spot the spot currently selected
 */
exports.showEntry = function (obj, spot) {
  let content = pa[1].import
  let showcase = content.querySelector('#entryShowcase')
  let showcaseTemp = document.importNode(showcase.content, true)
  showcaseTemp.querySelector('#spot').innerText = spot
  showcaseTemp.querySelector('#date').innerText = obj.time + '\n' + obj.date
  showcaseTemp.querySelector('#location').innerText = obj.location
  showcaseTemp.querySelector('#caught').innerText = 'Caught: ' + obj.caught
  showcaseTemp.querySelector('.log-container').innerText = obj.text
  if (obj.lastEdit !== undefined) {
    showcaseTemp.querySelector('#lastEdit').innerText = 'Last Edit: ' + obj.lastEdit
  }
  document.querySelector('#content').appendChild(showcaseTemp)
  getWeatherPics(obj.weather, imgArr)

  document.querySelector('#editBtn').addEventListener('click', e => {
    edit.editMode(obj, document)
  })

  document.querySelector('#deleteBtnEntry').addEventListener('click', async e => {
    await db.deleteEntry(obj).then(() => {
      menu.showEntries(spot)
    })
    document.querySelector('#content').innerHTML = ''
  })
}
function getWeatherPics (arr, imgArr) {
  for (let i = 0; i < 5; i++) {
    if (arr[i] === true) {
      document.querySelector('.weather-op').appendChild(imgArr[i])
    }
  }
}
