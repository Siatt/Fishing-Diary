/**
 * Gets the edited data and returns it
 *
 * @returns {object} an object with the edited data
 */
exports.parse = function (obj) {
  let location = document.querySelector('#location').innerText
  let caught = document.querySelector('#caught').innerText
  let text = document.querySelector('#text').innerText

  let dateAPI = new Date()
  let dateFormat = {year: '2-digit', month: 'numeric', day: 'numeric'}
  let lastEditDate = dateAPI.toLocaleDateString('sv-se', dateFormat)

  let doc = {
    weather: obj.weather,
    location: location,
    caught: caught,
    text: text,
    date: obj.date,
    time: obj.time,
    lastEdit: lastEditDate
  }
  return doc
}
