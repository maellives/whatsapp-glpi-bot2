require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { createWhatsAppClient } = require('./config/whatsapp');
const messageHandler = require('./handlers/messageHandler');
const logger = require('./config/logger');

// Create logs directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Initialize WhatsApp client
const client = createWhatsAppClient();

client.on('qr', (qr) => {
  logger.info('QR Code generated');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  logger.info('WhatsApp client connected and ready!');
});

client.on('message', async msg => {
  try {
    await messageHandler.handleMessage(msg);
  } catch (error) {
    logger.error('Error processing message:', error);
  }
});

client.on('disconnected', (reason) => {
  logger.error('Client was disconnected:', reason);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
});

client.initialize().catch(error => {
  logger.error('Failed to initialize client:', error);
});