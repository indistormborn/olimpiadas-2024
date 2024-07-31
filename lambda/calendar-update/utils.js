const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

module.exports = {
  sleep,
  buildName,
  buildDescription,
  brazilSportsCodes
};

