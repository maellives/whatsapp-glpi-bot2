const axios = require('axios');
require('dotenv').config();

class GLPIApi {
  constructor() {
    this.baseURL = process.env.GLPI_URL;
    this.appToken = process.env.GLPI_APP_TOKEN;
    this.userToken = process.env.GLPI_USER_TOKEN;
    this.session = null;
  }

  async initSession() {
    try {
      const response = await axios.get(`${this.baseURL}/initSession`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `user_token ${this.userToken}`,
          'App-Token': this.appToken
        }
      });
      this.session = response.data.session_token;
      return this.session;
    } catch (error) {
      console.error('Error initializing GLPI session:', error);
      throw error;
    }
  }

  async createTicket(title, description, category) {
    if (!this.session) {
      await this.initSession();
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/Ticket`,
        {
          input: {
            name: title,
            content: description,
            itilcategories_id: category,
            status: 1 // New ticket
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Session-Token': this.session,
            'App-Token': this.appToken
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }

  async getTicket(ticketId) {
    if (!this.session) {
      await this.initSession();
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/Ticket/${ticketId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Session-Token': this.session,
            'App-Token': this.appToken
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting ticket:', error);
      throw error;
    }
  }
}

module.exports = new GLPIApi();