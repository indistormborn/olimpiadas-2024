const request = require('https')
const { dateNames } = require('./utils')

const datas = dateNames()

for (const data of datas) {
  console.log(`Iniciando requisição para a data: ${data}`);
  request.get(`https://olympics.com/pt/paris-2024/calendario/${data}`, (res) => {
    let conteudo = '';
    res.on('data', (chunk) => {
      conteudo += chunk;
    });
    res.on('end', () => {
      console.log(`Recebido conteúdo completo para a data: ${data}`);
      const fs = require('fs');
      fs.writeFileSync(`./raw-html/${data}.html`, conteudo);
      console.log(`Arquivo salvo: ${data}.html`);
    });
  }).on('error', (erro) => {
    console.error(`Erro ao fazer requisição para a data: ${data} - ${erro.message}`);
  });
}
