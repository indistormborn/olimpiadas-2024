const axios = require('axios')

class OlympicsApi {
  constructor() {
    if (!OlympicsApi.instance) {
      this.urls = {
        BRA: 'https://sph-s-api.olympics.com/summer/schedules/api/POR/schedule/noc/BRA'
      };
      OlympicsApi.instance = this;
    }
    return OlympicsApi.instance;
  }

  async getCountryEvents(country) {
    try {
      const response = await axios.get(this.urls[country]);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar eventos para o país: ${country}`, error);
      throw error; 
    }
  }
}

module.exports = new OlympicsApi();
