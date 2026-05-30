const cron = require('node-cron');
const { main } = require('./index');

console.log('Scheduler iniciado. O bot de scraping rodará a cada 24h (às 02:00).');

// Roda às 02:00 da manhã todos os dias
cron.schedule('0 2 * * *', async () => {
  console.log('Iniciando cron job diário...');
  await main();
});
