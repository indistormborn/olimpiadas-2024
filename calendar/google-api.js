require('dotenv').config()
const fs = require('fs');
const { google } = require('googleapis');

const CREDENTIALS_PATH = process.env.CREDENTIALS_PATH;
const TOKEN_PATH = process.env.TOKEN_PATH;

const crypto = require('crypto');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GoogleAPI {
  constructor() {
    if (!GoogleAPI.instance) {
      const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, { encoding: 'utf-8' }));
      const { client_secret, client_id, redirect_uris } = credentials.web;

      this.auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
      this.auth.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, { encoding: 'utf-8' })));

      // refresh tokens when it expires and set the new tokens
      this.auth.on('tokens', (tokens) => {
        if (tokens.refresh_token) {
          fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
            if (err) return console.error(err);
            console.log('Token atualizado e armazenado em', TOKEN_PATH);
          });
          this.auth.setCredentials(tokens);
        }
      });

      GoogleAPI.instance = this;
    }
    return GoogleAPI.instance;
  }

  async addEvent(eventObj, calendarId) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.auth });

      const response = await calendar.events.insert({
        calendarId: calendarId,
        resource: eventObj,
      });

      const { data } = response;
      return data;
    } catch (err) {
      console.error('Erro ao criar o evento:', err, 'dados do evento >>>>>>>', JSON.stringify(eventObj));
      throw err;
    }
  }

  async addEventsInBatches(events, calendarId, batchSize, delay) {
    const logFileName = `log-${Date.now()}.csv`
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      await Promise.all(batch.map(event => this.addEvent(event, calendarId).then((data) => {
        console.log('Evento criado:', data.summary);
        const hash = crypto.createHash('sha256').update(`${data.summary}${data.start.dateTime}${data.end.dateTime}`).digest('hex');
        fs.writeFileSync(logFileName, `${data.id},${hash}\n`, { encoding: 'utf-8', flag: 'a' });
      })));
      console.log(`Adicionado o lote de eventos de ${i} a ${i + batchSize}`);
      await sleep(delay);
    }
  }
}

module.exports = new GoogleAPI();

