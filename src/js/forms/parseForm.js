/**
 * Callbacck with a doc of parsed data from form
 * @param {callback} callback to be run after completion
 */
exports.parse = function (callback) {
  let location = document.querySelector('#location').value
  let caught = document.querySelector('#caught').value
  let text = document.querySelector('#text').value
  let weatherValues = []

  let weatherTab = document.querySelector('#weather-op')
  let weatherInputs = weatherTab.querySelectorAll('input')
  weatherInputs.forEach(current => {
    weatherValues.push(current.checked)
  })

  let dateAPI = new Date()
  let dateFormat = {year: '2-digit', month: 'numeric', day: 'numeric'}
  let timeFormat = {hour: '2-digit', minute: '2-digit'}

  let date = dateAPI.toLocaleDateString('sv-se', dateFormat)
  let time = dateAPI.toLocaleTimeString('sv-se', timeFormat)

  let doc = {
    weather: weatherValues,
    location: location,
    caught: caught,
    text: text,
    date: date,
    time: time
  }
  
  callback(doc)
}
