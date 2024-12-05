const glpi = require('../config/glpi');
const nlpService = require('../services/nlpService');
const office365Auth = require('../config/oauth');

class MessageHandler {
  constructor() {
    this.userStates = new Map();
    this.CONFIDENCE_THRESHOLD = 0.7;
    this.userCredentials = new Map();
  }

  async handleMessage(message) {
    const chat = await message.getChat();
    const content = message.body;
    const userId = message.from;

    const userState = this.userStates.get(userId) || { step: 'initial' };

    // Verificar se o usuário já está autenticado
    if (!this.userCredentials.has(userId) && userState.step !== 'awaiting_email' && userState.step !== 'awaiting_password') {
      await chat.sendMessage('👋 Para abrir um chamado, primeiro preciso validar seu acesso.\nPor favor, digite seu email corporativo:');
      this.userStates.set(userId, { step: 'awaiting_email' });
      return;
    }

    // Processar autenticação
    if (userState.step === 'awaiting_email') {
      if (this.validateEmailFormat(content)) {
        userState.email = content;
        await chat.sendMessage('📧 Email registrado. Agora, por favor, digite sua senha:');
        userState.step = 'awaiting_password';
        this.userStates.set(userId, userState);
      } else {
        await chat.sendMessage('❌ Email inválido. Por favor, digite um email corporativo válido:');
      }
      return;
    }

    if (userState.step === 'awaiting_password') {
      const authResult = await office365Auth.validateCredentials(userState.email, content);
      if (authResult.valid) {
        this.userCredentials.set(userId, {
          email: userState.email,
          accessToken: authResult.accessToken,
          refreshToken: authResult.refreshToken
        });
        await chat.sendMessage('✅ Autenticação realizada com sucesso! Como posso ajudar?');
        this.userStates.set(userId, { step: 'initial' });
      } else {
        await chat.sendMessage('❌ Credenciais inválidas. Por favor, digite seu email novamente:');
        this.userStates.set(userId, { step: 'awaiting_email' });
      }
      return;
    }

    // Resto do código existente para processamento de mensagens
    if (content.startsWith('!')) {
      await this.handleDirectCommands(chat, content, userId);
      return;
    }

    if (userState.step !== 'initial') {
      await this.handleTicketCreationFlow(chat, message, userState, userId);
      return;
    }

    const nlpResult = await nlpService.processMessage(content);
    
    if (nlpResult.score > this.CONFIDENCE_THRESHOLD) {
      switch (nlpResult.intent) {
        case 'create.ticket':
          await chat.sendMessage('📝 Vou te ajudar a criar um novo chamado. Por favor, me diga qual é o título do problema:');
          this.userStates.set(userId, { step: 'awaiting_title' });
          break;

        case 'check.status':
          await chat.sendMessage('🔍 Para verificar o status, preciso do número do chamado. Pode me informar?');
          this.userStates.set(userId, { step: 'awaiting_ticket_number' });
          break;

        case 'help':
          await this.sendHelp(chat);
          break;

        default:
          await this.handleUnknownIntent(chat);
      }
    } else {
      await this.handleUnknownIntent(chat);
    }
  }

  validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ... resto do código existente ...
}

module.exports = new MessageHandler();