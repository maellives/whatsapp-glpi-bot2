# Chatbot WhatsApp GLPI

Bot para WhatsApp integrado com GLPI para abertura e acompanhamento de chamados de suporte.

## 📋 Pré-requisitos

- Node.js 16.x ou superior
- NPM 8.x ou superior
- Servidor GLPI configurado e acessível
- Conta Microsoft 365 com permissões administrativas
- Acesso ao Azure Portal
- WhatsApp instalado no celular

## 🚀 Instalação

### 1. Configuração do Ambiente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/whatsapp-glpi-bot.git

# Entre no diretório
cd whatsapp-glpi-bot

# Instale as dependências
npm install
```

### 2. Configuração do GLPI

1. **Gerar Tokens no GLPI**
   - Acesse o GLPI como administrador
   - Vá em `Configuração > Geral > API`
   - Ative a API REST
   - Crie um novo token de API (App-Token)
   - Crie um token de usuário (User-Token) para o usuário que será usado pelo bot

2. **Teste de Conexão com GLPI**
   ```bash
   curl -X GET \
   -H "Content-Type: application/json" \
   -H "Authorization: user_token YOUR_USER_TOKEN" \
   -H "App-Token: YOUR_APP_TOKEN" \
   http://seu-servidor-glpi/apirest.php/initSession
   ```

### 3. 🔐 Configuração do Azure AD para OAuth

#### Registrar Aplicativo no Azure AD

1. **Acessar o Portal do Azure**
   - Acesse [portal.azure.com](https://portal.azure.com)
   - Faça login com sua conta administrativa do Microsoft 365

2. **Registrar Novo Aplicativo**
   - No menu lateral, clique em "Azure Active Directory"
   - Vá em "Registros de aplicativos"
   - Clique em "Novo registro"

3. **Configurar o Aplicativo**
   - Nome: "GLPI WhatsApp Bot"
   - Tipos de conta suportados: "Contas somente nesta organização"
   - URI de Redirecionamento:
     - Tipo: "Web"
     - URL: sua URL de callback (ex: https://seu-dominio/oauth/callback)

4. **Coletar Informações**
   - Anote o "ID do Aplicativo (client)"
   - Anote o "ID do Diretório (tenant)"

5. **Criar Segredo do Cliente**
   - Na página do aplicativo, vá em "Certificados e segredos"
   - Clique em "Novo segredo do cliente"
   - Descrição: "Bot Secret"
   - Expiração: escolha conforme sua política
   - IMPORTANTE: Salve o valor do segredo imediatamente

6. **Configurar Permissões**
   - Vá em "Permissões de API"
   - Adicione:
     - IMAP.AccessAsUser.All
     - offline_access
     - User.Read
   - Conceda consentimento administrativo

### 4. ⚙️ Configuração do Bot

1. **Configurar Variáveis de Ambiente**
   - Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
   - Edite o arquivo `.env`:
   ```env
   # Configurações GLPI
   GLPI_URL=http://seu-servidor-glpi/apirest.php
   GLPI_APP_TOKEN=seu-app-token-do-glpi
   GLPI_USER_TOKEN=seu-user-token-do-glpi
   NLP_LANGUAGE=pt

   # Configurações Office 365
   OFFICE365_CLIENT_ID=seu-client-id-do-azure
   OFFICE365_CLIENT_SECRET=seu-client-secret-do-azure
   OFFICE365_TENANT_ID=seu-tenant-id-do-azure
   OAUTH_REDIRECT_URI=https://seu-dominio/oauth/callback
   ```

### 5. 🚀 Inicialização

1. **Primeira Execução**
   ```bash
   npm start
   ```

2. **Autenticação WhatsApp**
   - Um QR Code será exibido no terminal
   - Abra o WhatsApp no seu celular
   - Vá em Menu > WhatsApp Web
   - Escaneie o QR Code
   - Aguarde a mensagem "Cliente WhatsApp conectado e pronto!"

### 6. 🔒 Segurança

1. **Firewall e VPN**
   - Configure o firewall para permitir acesso ao GLPI apenas da VPN
   - Garanta que o servidor do bot tenha acesso à VPN

2. **Monitoramento**
   - Configure logs do sistema
   - Implemente monitoramento de uptime
   - Configure alertas para falhas

3. **Backup**
   - Configure backup da pasta `.wwebjs_auth`
   - Faça backup regular das configurações

### 7. 🔍 Verificação

1. **Teste do Bot**
   - Envie uma mensagem para o número do WhatsApp configurado
   - Teste a criação de um chamado
   - Verifique o status de um chamado existente

2. **Verificação do GLPI**
   - Confirme se os chamados estão sendo criados corretamente
   - Verifique se as informações estão completas
   - Teste as notificações

## 📝 Uso

### Comandos Disponíveis

- `criar chamado` - Inicia o processo de criação de um novo chamado
- `status chamado` - Consulta o status de um chamado existente
- `ajuda` - Exibe a lista de comandos disponíveis

### Fluxo de Criação de Chamado

1. Digite "criar chamado" ou similar
2. Informe o título do problema
3. Descreva o problema detalhadamente
4. Confirme a criação do chamado

### Consulta de Status

1. Digite "status chamado" ou similar
2. Informe o número do chamado
3. O bot mostrará as informações atualizadas

## 🔧 Manutenção

### Atualizações

```bash
# Atualizar dependências
npm update

# Verificar por atualizações de segurança
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

### Logs

- Logs são salvos em `logs/`
- Rotação de logs a cada 7 dias
- Monitore erros frequentes

### Backup

```bash
# Backup da autenticação WhatsApp
cp -r .wwebjs_auth/ backup/

# Backup das configurações
cp .env backup/
```

## 🚨 Solução de Problemas

### Problemas Comuns

1. **QR Code não aparece**
   - Verifique a conexão com internet
   - Reinicie o serviço
   - Limpe a pasta `.wwebjs_auth`

2. **Erro de Autenticação GLPI**
   - Verifique os tokens no `.env`
   - Teste a conexão via curl
   - Verifique o acesso à VPN

3. **Bot Não Responde**
   - Verifique os logs
   - Confirme se o serviço está rodando
   - Verifique a conexão do WhatsApp

### Comandos Úteis

```bash
# Reiniciar o bot
npm restart

# Verificar logs
tail -f logs/bot.log

# Verificar status do serviço
systemctl status whatsapp-glpi-bot
```

## 📚 Recursos Adicionais

- [Documentação GLPI API](https://github.com/glpi-project/glpi/blob/master/apirest.md)
- [WhatsApp Web.js Docs](https://docs.wwebjs.dev/)
- [Azure AD Documentation](https://docs.microsoft.com/azure/active-directory/)

## 🤝 Suporte

Para suporte, abra uma issue no repositório ou contate a equipe de suporte.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.