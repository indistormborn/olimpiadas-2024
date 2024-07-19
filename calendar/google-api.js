require('dotenv').config()
const fs = require('fs');
const { google } = require('googleapis');

const CREDENTIALS_PATH = process.env.CREDENTIALS_PATH;
const TOKEN_PATH = process.env.TOKEN_PATH;

const crypto = require('crypto');

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

  addEvent(eventObj, calendarId) {
    const calendar = google.calendar({ version: 'v3', auth: this.auth });
    return calendar.events.insert({
      calendarId: calendarId,
      resource: eventObj,
    }, (err, res) => {
      if (err) return console.error('Erro ao criar o evento:', err, 'dados do evento >>>>>>>', JSON.stringify(eventObj));
      const { data } = res;
      console.log('Evento criado:', data.summary);
      const hash = crypto.createHash('sha256').update(`${data.summary}${data.start.dateTime}${data.end.dateTime}`).digest('hex');
      fs.writeFileSync(`log-${Date.now()}.csv`, `${data.id},${hash}\n`, { encoding: 'utf-8', flag: 'a' });
    });
  }
}

module.exports = new GoogleAPI();

