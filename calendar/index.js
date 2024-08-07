require('dotenv').config();

/**
 * Representa os detalhes de um durante as Olimpíadas.
 * 
 * @typedef {Object} Event
 * @property {string} disciplineName - Nome da disciplina.
 * @property {string} eventUnitName - Nome da unidade do evento.
 * @property {string} id - Identificador único do evento.
 * @property {string} disciplineCode - Código da disciplina.
 * @property {string} genderCode - Código de gênero.
 * @property {string} eventCode - Código do evento.
 * @property {string} phaseCode - Código da fase.
 * @property {string} eventId - ID do evento.
 * @property {string} eventName - Nome do evento.
 * @property {string} phaseId - ID da fase.
 * @property {string} phaseName - Nome da fase.
 * @property {string} disciplineId - ID da disciplina.
 * @property {number} eventOrder - Ordem do evento.
 * @property {string} phaseType - Tipo de fase.
 * @property {string} eventUnitType - Tipo de unidade do evento.
 * @property {string} olympicDay - Dia olímpico.
 * @property {string} startDate - Data de início.
 * @property {string} endDate - Data de término.
 * @property {boolean} hideStartDate - Se a data de início deve ser ocultada.
 * @property {boolean} hideEndDate - Se a data de término deve ser ocultada.
 * @property {string} startText - Texto de início.
 * @property {number} order - Ordem.
 * @property {string} venue - Local do evento.
 * @property {string} venueDescription - Descrição do local.
 * @property {string} location - Localização.
 * @property {string} locationDescription - Descrição da localização.
 * @property {string} status - Status do evento.
 * @property {string} statusDescription - Descrição do status.
 * @property {number} medalFlag - Indicador de medalha.
 * @property {boolean} liveFlag - Indicador se o evento está ao vivo.
 * @property {string} scheduleItemType - Tipo de item de agenda.
 * @property {string} unitNum - Número da unidade.
 * @property {string} sessionCode - Código da sessão.
 * @property {Array.<Competitor>} competitors - Competidores participantes.
 * @property {ExtraData} extraData - Dados extras.
 * 
 * @typedef {Object} Competitor
 * @property {string} code - Código do competidor.
 * @property {string} noc - Comitê Olímpico Nacional.
 * @property {string} name - Nome do competidor.
 * @property {number} order - Ordem de apresentação. 
 */

const googleApi = require('./google-api');
const olympicsApi = require('./olympics-api');
const moment = require('moment-timezone');
const CALENDAR_ID = process.env.CALENDAR_ID;

/**
 * Builds the event name
 * @param {Event} event 
 * @returns {string}
 */

const buildName = (event) => {
  if (event.competitors.length === 2) { // If it's a team event
    return `${event.disciplineName.toUpperCase()} | ${event.eventUnitName} (${event.competitors[0].name} x ${event.competitors[1].name})`;
  }
  return `${event.disciplineName.toUpperCase()} | ${event.eventUnitName}`;
}

const buildDescription = (event, country) => {
  if (event.competitors.length > 2) {
    const countryCompetitorsNames = event.competitors.filter(competitor => competitor.noc === country).map(competitor => competitor.name);
    return `Competidores de ${country}: ${countryCompetitorsNames.join(',')} \nLocal: ${event.locationDescription} \nStatus: ${event.statusDescription} \n`;
  }
  return `Local: ${event.locationDescription} \nStatus: ${event.statusDescription} \n`;
}

const brazilSportsCodes = [
  'ATH', 'BDM', 'BKB', 'BOX', 'CSL',
  'CSP', 'BMF', 'BMX', 'CRD', 'MTB',
  'FEN', 'FBL', 'GAR', 'GTR', 'GRY',
  'HBL', 'EQU', 'JUD', 'WLF', 'WRE',
  'OWS', 'SWM', 'MPN', 'ROW', 'RU7',
  'DIV', 'SKB', 'SRF', 'TKW', 'TEN',
  'TTE', 'ARC', 'SHO', 'TRI', 'SAL',
  'VVO', 'VBV'
];

async function insertEvents() {
  try {
    // pega os eventos que tem pessoas do brasil listadas como competidoras
    const countryEvents = await olympicsApi.getCountryEvents('BRA');
    console.log(`Country events: ${countryEvents.length}`);

    // pega os codigos dos eventos
    const countrySports = Array.from(new Set(countryEvents.map(event => event.disciplineCode)));
    console.log(`Country sports: ${countrySports.length}`);

    // verifica quais eventos do brasil não vieram pelo endpoint do país
    const remainingSportsCodes = brazilSportsCodes.filter(sport => !countrySports.includes(sport));
    console.log(`Remaining sports: ${remainingSportsCodes.length}`);

    const events = countryEvents;
    for (const sport of remainingSportsCodes) {
      const sportEvents = await olympicsApi.getSportEvents(sport);
      events.push(...sportEvents);
      console.log(`Events for ${sport}: ${sportEvents.length}`);
    }

    console.log(`Total events: ${events.length}`);

    const eventObjects = events.map(event => ({
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

    await googleApi.addEventsInBatches(eventObjects, CALENDAR_ID, batchSize, delay);
  } catch (error) {
    console.error('Erro ao processar eventos:', error);
  }
}

insertEvents();

