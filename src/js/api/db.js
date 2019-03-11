const storage = require('electron-json-storage')
const os = require('os')
let currentSpot
// Helper function for getting list for spot
// TODO change to return data and resolve to something singaling promise is resolved
function getEntries (spot) {
  return new Promise(resolve => {
    storage.get(spot, (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
}
exports.getEntry = async function (spot, entry, path) {
  currentSpot = spot
  console.log(typeof spot)
  console.log(typeof entry)
  // console.log('Entry ' + entry)
  // Change path to temp folder if running test
  if (path !== undefined) {
    storage.setDataPath(os.tmpdir())
  }
  let res = await getEntries(spot)
          .then(async value => {
            let finalResult = await value.logs.filter(log => log.location === entry)
            return finalResult
          }).catch(e => console.log(e))
  return res
}

exports.getSpecific = async function (ele) {
  let spot = ele.querySelector('#location').innerText
  let date = ele.querySelector('#date').innerText
  let time = ele.querySelector('#time').innerText
  let res
  await getEntries(currentSpot)
        .then(value => {
          value.logs.forEach(current => {
            if (current.date === date && current.time === time && current.location === spot) {
              res = current
            }
          })
        })
  return res
}

exports.saveEdit = async function (obj, oldObj) {
  let newData
  newData = await getEntries(currentSpot).then(data => {
    let index = getIndex(data.logs, oldObj)
    data.logs[index] = obj
    return data
  })
  await saveEntry(newData).then(res => { return res }).catch(e => console.log(e))
  return 56
}

exports.deleteEntry = async function (obj) {
  let newData
  await getEntries(currentSpot).then(data => {
    let index = getIndex(data.logs, obj)
    data.logs.splice(index, 1)
    newData = data
  })
  await saveEntry(newData).then(res => { return res }).catch(e => console.log(e))
}

exports.deleteSpot = async function (spot) {
  storage.remove(spot, error => {
    if (error) throw error
  })
}

function saveEntry (data) {
  return new Promise((resolve, reject) => {
    storage.set(currentSpot, data, error => {
      if (error) throw error
      resolve('Saved')
    })
  })
}

function getIndex (arr, obj) {
  let location = obj.location
  let date = obj.date
  let time = obj.time
  return arr.findIndex(x => x.location === location && x.date === date && x.time === time)
}
