const pa = document.querySelectorAll('link[rel="import"]')
let content = pa[2].import
let db = require('../api/db')
let menu = require('../menu/menu')
/**
 * Adds Collision menu
 */
exports.addCollisionMenu = function () {
  let collisionMenu = content.querySelector('#entryCollision')
  let collisionTemp = document.importNode(collisionMenu.content, true)
  document.querySelector('#content').appendChild(collisionTemp)
}
/**
 * Adds container for collision menu
 */
exports.addContainer = function (arr) {
  const containerTemplate = document.querySelector('template')
  let temp
  arr.forEach(current => {
    temp = document.importNode(containerTemplate.content, true)
    temp.querySelector('#location').innerText = current.location
    temp.querySelector('#time').innerText = current.time
    temp.querySelector('#date').innerText = current.date 
    document.querySelector('.entry-collision').appendChild(temp)
  })
    // Give all children event listners after loop dont work in loop, dont know why :/
  document.querySelector('.entry-collision').childNodes.forEach(current => {
    current.addEventListener('click', e => {
      document.querySelector('#content').innerHTML = ''
      db.getSpecific(e.target.parentNode).then(obj => {
        menu.showSpecificEntry(obj)
      })
    })
  })
}
