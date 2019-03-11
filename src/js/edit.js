let btns
let saveBtn
let currentEntry
let doc
const parser = require('./forms/editParse')
const db = require('./api/db')
const menu = require('../js/menu/menu')
let dateAPI = new Date()
let dateFormat = {year: '2-digit', month: 'numeric', day: 'numeric'}
let idArr = ['#text', '#caught', '#location']
/**
 * Makes the templates content editable
 */
exports.editMode = function (entry, document) {
  currentEntry = entry
  doc = document
   // Making divs editable for editing from user
  idArr.forEach(x => {
    doc.querySelector(x).setAttribute('contenteditable', true)
  })
  saveBtn = doc.createElement('button')
  saveBtn.innerText = 'Save'
  saveListener()

  btns = doc.querySelectorAll('.btn-container button')
  for (let btn in btns) {
    if (btns.hasOwnProperty(btn)) {
      btns[btn].style.display = 'none'
    }
  }

  doc.querySelector('.btn-container').appendChild(saveBtn)
}
/**
 * Add event listener to button for saving edited content
 *
 */
function saveListener () {
  saveBtn.addEventListener('click', async e => {
    // let date = dateAPI.toLocaleDateString('sv-se', dateFormat)
    // // doc.querySelector('#lastEdit').innerText = 'Last Edit: ' + date
    let parsedDoc = parser.parse(currentEntry)
    await db.saveEdit(parsedDoc, currentEntry)
    let spot = doc.querySelector('#spot').innerText
    menu.showEntries(spot)
    idArr.forEach(x => {
      doc.querySelector(x).setAttribute('contenteditable', false)
    })
    for (let btn in btns) {
      if (btns.hasOwnProperty(btn)) {
        btns[btn].style.display = 'inline-block'
      }
    }
    saveBtn.remove()
  })
}
