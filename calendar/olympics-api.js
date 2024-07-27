
class OlympicsApi {
  constructor() {
    if (!OlympicsApi.instance) {
      this.countryUrls = {
        BRA: 'https://sph-s-api.olympics.com/summer/schedules/api/POR/schedule/noc/BRA'
      };

      this.sportUrl = 'https://sph-s-api.olympics.com/summer/schedules/api/POR/schedule/discipline/#sport#';

      OlympicsApi.instance = this;
    }
    return OlympicsApi.instance;
  }

  async getCountryEvents(country) {
    try {
      const response = await fetch(this.countryUrls[country], {
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
      });
      const json = await response.json();
      return json.units;
    } catch (error) {
      console.error(`Erro ao buscar eventos para o país: ${country}`, error);
      throw error;
    }
  }

  async getSportEvents(sport) {
    try {
      const url = this.sportUrl.replace('#sport#', sport);
      const response = await fetch(url, {
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
      });
      const json = await response.json();
      return json.units;
    } catch (error) {
      console.error(`Erro ao buscar eventos para o esporte: ${sport}`, error);
      throw error;
    }
  }
}

module.exports = new OlympicsApi();
