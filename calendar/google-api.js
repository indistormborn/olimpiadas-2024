require('dotenv').config()
const fs = require('fs');
const { google } = require('googleapis');

const CREDENTIALS_PATH = process.env.CREDENTIALS_PATH;
const TOKEN_PATH = process.env.TOKEN_PATH;
const CALENDAR_ID = process.env.CALENDAR_ID;

class GoogleAPI {
  constructor() {
    if(!GoogleAPI.instance) {
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

  addEvent(eventObj) {
    const calendar = google.calendar({ version: 'v3', auth: this.auth });
    return calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: eventObj,
    }, (err, res) => {
      if (err) return console.error('Erro ao criar o evento:', err);
      console.log('Evento criado:', res.data);
    });
  }
}

module.exports = new GoogleAPI();

