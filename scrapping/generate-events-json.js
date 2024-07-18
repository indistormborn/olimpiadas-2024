const { dateNames } = require('./utils')
const fs = require('fs')
const jsonfile = require('jsonfile')

const dates = dateNames()
const filePath = 'events.json'

for (const date of dates) {
  const file = fs.readFileSync(`./schedules-json/${date}.json`)
  const json = JSON.parse(file)

  for (const schedule of json) {
    const events = schedule.units
    const sport = schedule.discipline.description
    for (const event of events) {
      const obj = {
        sport: sport,
        description: event.description,
        match: event.match,
        start: event.startDateTimeUtc,
        end: event.endDateTimeUtc,
      }
      jsonfile.writeFile(filePath, obj, { flag: 'a', EOL: ',\n' }, function (err) {
        if (err) console.error(err)
      })
    }
  }
}

