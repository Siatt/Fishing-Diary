const storage = require('electron-json-storage')
const pa = document.querySelector('link[rel="import"]')
const entryForm = require('../forms/entryForm')
// const db = require('../api/db')
let db = require('../api/db')
let index = require('../index')
let currentSpot
let menu
let backBtn = document.querySelector('#backBtn')
let addEntryBtn = document.querySelector('#addEntryBtn')
let deleteBtn = document.querySelector('#deleteBtn')
let collision = require('../menu/multiLogs')
/**
 * Load entries list
 * @param {String} spot the spot to get entries from
 */
exports.showEntries = function (spot) {
  currentSpot = spot
  menu.innerHTML = ''
  backBtn.style.display = 'block'
  addEntryBtn.style.display = 'block'
  deleteBtn.style.display = 'block'
  storage.get(spot, (err, data) => {
    if (err) throw err
    data.logs.forEach(current => {
      let a = document.createElement('a')
      a.innerText = current.location
      a.style.fontSize = 12
      addListener(a)
      menu.appendChild(a)
    })
  })
}
/**
 * Load fishing spots in menu
 * 
 * @param {DOM object} nav the menu DOM Object
 */
exports.loadSpots = function (nav) {
  menu = nav
  backBtn.style.display = 'none'
  addEntryBtn.style.display = 'none'
  deleteBtn.style.display = 'none'
  storage.keys((err, keys) => {
    if (err) throw err
    for (let key of keys) {
      console.log(key)
      let a = document.createElement('a')
      a.innerText = key
      a.addEventListener('click', e => {
        currentSpot = e.target.innerText
        this.showEntries(key)
      })
      nav.appendChild(a)
    }
  })
}
/**
 * Adds entry
 * 
 * @param {any} doc obj with entry data
 * @returns 
 */
function addEntry (doc) {
  return new Promise(resolve => {
    storage.get(currentSpot, (err, data) => {
      if (err) throw err
      data.logs.push(doc)
      storage.set(currentSpot, data, error => {
        if (error) throw error
      })
    })
    resolve(doc)
  })
}
/**
 * Update entries list
 */
exports.updateEntries = async function (doc) {
  await addEntry(doc).then(value =>  {
    let a = document.createElement('a')
    a.innerText = value.location
    addListener(a)
    menu.appendChild(a)
  })
}
/**
 * Shows correct entry
 */
exports.showSpecificEntry = function (obj) {
  index.showEntry(obj, currentSpot)
}
// Back Button event listener
backBtn.addEventListener('click', e => {
  nav.innerHTML = ''
  currentSpot = null
  document.querySelector('#content').innerHTML = ''
  this.loadSpots(nav)
})

// Add Entry event listener
addEntryBtn.addEventListener('click', e => {
  document.querySelector('#content').innerHTML = ''
  let content = pa.import
  let entryTemp = content.querySelector('#logTemp')
  let temp = document.importNode(entryTemp.content, true)
  document.querySelector('#content').appendChild(temp)
  entryForm.init()
})

// Add Delete event listener
deleteBtn.addEventListener('click', async e => {
  await db.deleteSpot(currentSpot).then(() => {
    backBtn.click()
  })
})
/**
 * Add event listners
 *
 * @param {any} a target
 */
function addListener (a) {
  a.addEventListener('click', e => {
    document.querySelector('#content').innerHTML = ''
    db.getEntry(currentSpot, a.innerText).then(res => {
      if (res.length >= 2) {
        collision.addCollisionMenu()
        collision.addContainer(res)
      } else {
        index.showEntry(res[0], currentSpot)
      }
    })
  })
}
