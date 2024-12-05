const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['pt'] });

// Treinar o NLP com padrões comuns
async function setupNLP() {
  // Intenções para criar chamados
  manager.addDocument('pt', 'criar chamado', 'create.ticket');
  manager.addDocument('pt', 'abrir chamado', 'create.ticket');
  manager.addDocument('pt', 'novo chamado', 'create.ticket');
  manager.addDocument('pt', 'preciso de ajuda', 'create.ticket');
  manager.addDocument('pt', 'tenho um problema', 'create.ticket');

  // Intenções para status
  manager.addDocument('pt', 'status do chamado', 'check.status');
  manager.addDocument('pt', 'como está meu chamado', 'check.status');
  manager.addDocument('pt', 'andamento do chamado', 'check.status');
  manager.addDocument('pt', 'acompanhar chamado', 'check.status');

  // Intenções para ajuda
  manager.addDocument('pt', 'ajuda', 'help');
  manager.addDocument('pt', 'como usar', 'help');
  manager.addDocument('pt', 'comandos', 'help');
  manager.addDocument('pt', 'o que você faz', 'help');

  // Respostas
  manager.addAnswer('pt', 'create.ticket', 'Claro! Vou te ajudar a criar um novo chamado. Qual é o problema que você está enfrentando?');
  manager.addAnswer('pt', 'check.status', 'Para verificar o status de um chamado, preciso do número dele. Qual é o número do chamado?');
  manager.addAnswer('pt', 'help', 'Posso te ajudar com:\n\n📝 Criar novos chamados\n🔍 Verificar status de chamados existentes\n\nVocê pode simplesmente me dizer o que precisa em linguagem natural!');

  await manager.train();
}

setupNLP();

module.exports = {
  async processMessage(text) {
    const result = await manager.process('pt', text);
    return {
      intent: result.intent,
      score: result.score,
      answer: result.answer
    };
  }
};