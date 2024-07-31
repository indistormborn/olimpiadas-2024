const { resetDay, addEvents } = require('./steps');

exports.handler = async (event, context) => {
  console.log('Evento:', event);
  try {
    await resetDay();
  } catch (error) {
    console.error('Erro ao resetar o dia:', error);
  }
  try {
    await addEvents();
  } catch (error) {
    console.error('Erro ao adicionar os eventos:', error);
  }
  console.log('Contexto:', context);
};

