const axios = require('axios');

class Office365Auth {
  constructor() {
    this.clientId = process.env.OFFICE365_CLIENT_ID;
    this.clientSecret = process.env.OFFICE365_CLIENT_SECRET;
    this.tenantId = process.env.OFFICE365_TENANT_ID;
    this.redirectUri = process.env.OAUTH_REDIRECT_URI;
  }

  async validateCredentials(email, password) {
    try {
      const tokenEndpoint = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
      
      const params = new URLSearchParams();
      params.append('client_id', this.clientId);
      params.append('scope', 'https://outlook.office365.com/IMAP.AccessAsUser.All offline_access');
      params.append('client_secret', this.clientSecret);
      params.append('username', email);
      params.append('password', password);
      params.append('grant_type', 'password');

      const response = await axios.post(tokenEndpoint, params);
      
      return {
        valid: true,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token
      };
    } catch (error) {
      console.error('Erro na autenticação Office 365:', error);
      return {
        valid: false,
        error: 'Credenciais inválidas'
      };
    }
  }
}

module.exports = new Office365Auth();