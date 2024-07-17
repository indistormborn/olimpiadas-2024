const { dateNames, findSchedule } = require('./utils')
const cheerio = require('cheerio')
const fs = require('fs')

const dates = dateNames()

for (const date of dates) {
  const html = fs.readFileSync(`./raw-html/${date}.html`, { encoding: 'utf8' })
  const $ = cheerio.load(html)
  const data = $('#__NEXT_DATA__')

  let json;
  try {
    json = JSON.parse(data.html())
  } catch (error) {
    console.log(date, error);
    continue;
  }

  const schedule = findSchedule(json)
  fs.writeFileSync(`./schedules-json/${date}.json`, JSON.stringify(schedule))
}

