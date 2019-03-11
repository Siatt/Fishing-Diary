// const pa = document.querySelector('link[rel="import"]')
// let content = pa.import
// let template = content.querySelector('#logTemp')
// let temp = document.importNode(template.content, true)
let currentTab
let parseForm = require('./parseForm')
let db = require('../index')
let menu = require('../menu/menu')
exports.init = function () {
  currentTab = 0
  showTab(currentTab)
  addListstners()
}
/**
 * Shows correct tab
 *
 * @param {any} n currentab
 */
function showTab (n) {
  let tabs = document.querySelectorAll('.tab')
  tabs[n].style.display = 'block'
  listenersWeatherIcons()
  if (n === 0) {
    document.querySelector('.prev-btn').style.display = 'none'
  } else {
    document.querySelector('.prev-btn').style.display = 'inline'
  }

  if (n === (tabs.length - 1)) {
    document.querySelectorAll('.next-btn')[tabs.length - 1].innerText = 'Submit'
  } else {
    document.querySelector('.next-btn').innerText = 'Next'
  }
  fixStep(currentTab)
}
/**
 * Adds next prev functionality to form
 * 
 * @param {any} n currentab
 * @returns {boolean} returns false if at last page
 */
function nextPrev (n) {
  let tabs = document.querySelectorAll('.tab')
  if (n === 1 && !validateForm()) return false
  tabs[currentTab].style.display = 'none'
  currentTab = currentTab + n
  if (currentTab >= tabs.length) {
    parseForm.parse(menu.updateEntries)
    document.querySelector('#content').innerHTML = ''
    return false
  }
  showTab(currentTab)
}
/**
 * Validation of the form
 *
 * @returns {boolean} true or false if form i valid
 */
function validateForm () {
  let valid = true
  let tabs = document.querySelectorAll('.tab')
  let inputs = tabs[currentTab].querySelectorAll('input')
  let textArea = tabs[currentTab].querySelectorAll('textarea')
  textArea.forEach(current => {
    if (current.value === '') {
      current.className += ' invalid'
      valid = false
    }
  })
  inputs.forEach(current => {
    if (current.value === '') {
      current.className += ' invalid'
      valid = false
    }
  })
  if (valid) {
    document.querySelectorAll('.step')[currentTab].className += 'finish'
  }
  return valid
}

/**
 * Adds even listeners to all form buttons
 *
 */
function addListstners () {
  let prevBtn = document.querySelectorAll('.prev-btn')
  prevBtn.forEach(current => {
    current.addEventListener('click', e => {
      nextPrev(-1)
      e.stopPropagation()
    })
  })

  let nextBtn = document.querySelectorAll('.next-btn')
  nextBtn.forEach(current => {
    current.addEventListener('click', e => {
      nextPrev(1)
      e.preventDefault()
    })
  })
}
/**
 * Add event listeners to weather icons
 *
 */
function listenersWeatherIcons () {
  let images = document.querySelectorAll('img')
  console.log(images)
  images.forEach(current => {
    current.addEventListener('click', e => {
      let imgClass = e.target.className
      if (imgClass === '') {
        imgClass = 'selected'
        e.target.className = imgClass
      } else if (imgClass === 'selected') {
        imgClass = ''
        e.target.className = imgClass
      }
    })
  })
}
/**
 * Fix steps indication
 *
 * @param {any} n currentab
 */
function fixStep (n) {
  let steps = document.querySelectorAll('.step')
  for (let i = 0; i < steps.length; i++) {
    steps[i].className = steps[i].className.replace('active', '')
  }
  steps[n].className += ' active'
}
