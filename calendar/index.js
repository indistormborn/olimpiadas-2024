require('dotenv').config();

const googleApi = require('./google-api');
const moment = require('moment-timezone');
const fs = require('fs');
const EVENTS_PATH = process.env.EVENTS_PATH;
const CALENDAR_ID = process.env.CALENDAR_ID;

fs.readFile(EVENTS_PATH, (err, data) => {
  if (err) return console.error('Erro ao carregar o arquivo de eventos:', err);
  const events = JSON.parse(data);

  const buildName = (event) => {
    if (event.match && event.match.team1 && event.match.team2) {
      return `${event.sport.toUpperCase()} | ${event.description} (${event.match.team1.description} x ${event.match.team2.description})`;
    }
    return `${event.sport.toUpperCase()} | ${event.description}`;
  }

  events.forEach(event => {
    const eventObj = {
      summary: buildName(event),
      start: {
        dateTime: moment(event.start).tz('America/Sao_Paulo').toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: moment(event.end).tz('America/Sao_Paulo').toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
    };

    googleApi.addEvent(eventObj, CALENDAR_ID);
  });
});
