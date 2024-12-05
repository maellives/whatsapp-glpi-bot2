const { Client, LocalAuth } = require('whatsapp-web.js');
const logger = require('./logger');

const createWhatsAppClient = () => {
  return new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      executablePath: process.env.CHROME_PATH || undefined,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    }
  });
};

module.exports = { createWhatsAppClient };