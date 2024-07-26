# Olimpíada 2024

Este projeto foi criado para facilitar o acompanhamento dos eventos em que o Brasil participará nas Olimpíadas de 2024, oferecendo atualizações em tempo real e informações detalhadas sobre cada competição.

Para tutoriais acessar o calendário e adicionar ao Google Calendar, acesse: https://indistormborn.github.io/olimpiadas-2024.

## Stack
- Node.js
- Google Calendar API
- Moment.js com Timezone
- Fetch API
- Crypto
- Cheerio

## Contribuiçes

Contribuições são sempre bem-vindas. Caso tenha sugestões de melhorias ou correções, por favor, abra uma issue ou envie um pull request.

## TODO
- [ ] Add `listEvents` ao GoogleAPI
- [ ] Add `updateEvent` ao GoogleAPI
- [ ] Add `updateEventsInBatches` ao GoogleAPI
- [ ] Add checkagem de hashes dos logs para verificar se o evento teve alguma atualização de horário
- [ ] Criar função lambda com cron de x em x horas pra atualizar eventos
___
#### Nota sobre Scrapping [DEPRECADO]

Em 22-07-2024, foi observado que a página do [calendário da Olimpíada de 2024](https://olympics.com/pt/paris-2024/calendario/24-julho) não possui mais informações sobre os eventos diretamente. Agora, os dados são obtidos através de uma API pública.
