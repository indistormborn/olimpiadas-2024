const googleApi = require('./google-api');
const olympicsApi = require('./olympics-api');
const moment = require('moment-timezone');
const { sleep, buildName, buildDescription, brazilSportsCodes } = require('./utils');
const CALENDAR_ID = process.env.CALENDAR_ID;

const resetDay = () => {
  return googleApi.listEvents(CALENDAR_ID, {
    timeMin: moment().tz('America/Sao_Paulo').startOf('day').toISOString(),
    timeMax: moment().tz('America/Sao_Paulo').endOf('day').toISOString()
  }).then(async (events) => {
    const batchSize = 7;
    const delay = 1000;
  
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      await Promise.all(batch.map(event => googleApi.deleteEvent(event.id, CALENDAR_ID).then(() => {
        console.log('Evento deletado:', event.summary);
      }).catch(() => {
        console.error('Evento não foi criado: ' + event.summary);
      })));
      console.log(`Excluindo o lote de eventos de ${i} a ${i + batchSize}`);
      await sleep(delay);
    }
  });
}

const addEvents = async () => {
  try {
    const countryEvents = await olympicsApi.getCountryEvents('BRA');
    console.log(`Country events: ${countryEvents.length}`);

    const countrySports = Array.from(new Set(countryEvents.map(event => event.disciplineCode)));
    console.log(`Country sports: ${countrySports.length}`);

    const remainingSportsCodes = brazilSportsCodes.filter(sport => !countrySports.includes(sport));
    console.log(`Remaining sports: ${remainingSportsCodes.length}`);

    const events = countryEvents;
    for (const sport of remainingSportsCodes) {
      const sportEvents = await olympicsApi.getSportEvents(sport);
      events.push(...sportEvents);
      console.log(`Events for ${sport}: ${sportEvents.length}`);
    }

    console.log(`Total events: ${events.length}`);

    const startOfDay = moment().startOf('day');
    const endOfDay = moment().endOf('day');
    const dayEvents = events.filter(event => moment(event.startDate).isAfter(startOfDay) && moment(event.startDate).isBefore(endOfDay));
    console.log(`Day events: ${dayEvents.length}`);

    const eventObjects = dayEvents.map(event => ({
      summary: buildName(event),
      description: buildDescription(event, 'BRA'),
      start: {
        dateTime: moment(event.startDate).tz('America/Sao_Paulo').toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: moment(event.endDate).isAfter(moment(event.startDate)) ? moment(event.endDate).tz('America/Sao_Paulo').toISOString() : moment(event.startDate).tz('America/Sao_Paulo').toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
    }));

    const batchSize = 7;
    const delay = 1000;

    return googleApi.addEventsInBatches(eventObjects, CALENDAR_ID, batchSize, delay);
  } catch (error) {
    console.error('Erro ao processar eventos:', error);
  }
}

module.exports = {
  resetDay,
  addEvents
}

