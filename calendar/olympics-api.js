
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
      const response = await fetch(this.urls[country], {
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
}

module.exports = new OlympicsApi();
