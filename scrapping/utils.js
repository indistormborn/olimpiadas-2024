module.exports = {
  dateNames: function () {
    const dataInicio = '2023-07-24T00:00:00';
    const dataFim = '2023-08-11T00:00:00';
    const datas = [];
    let dataAtual = new Date(dataInicio);

    while (dataAtual <= new Date(dataFim)) {
      const dia = dataAtual.getDate();
      const mes = dataAtual.toLocaleString('pt-BR', { month: 'long' });
      datas.push(`${dia}-${mes}`);
      dataAtual.setDate(dataAtual.getDate() + 1);
    }

    return datas;
  },

  findSchedule: function (obj) {
    let schedule = null;

    function find(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key === 'schedules') {
            schedule = obj[key];
            break;
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            find(obj[key]);
          }
        }
      }
    }

    find(obj);
    return schedule;
  }
}