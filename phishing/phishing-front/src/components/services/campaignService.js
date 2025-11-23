// src/services/campaignService.js
import api from './api';

export const campaignService = {
  async getCampaigns(filters = {}) {
    try {
      console.log('Buscando campanhas com filtros:', filters);
      
      const params = new URLSearchParams();
      
      if (filters.id) params.append('id', filters.id);
      if (filters.name) params.append('name', filters.name);
      if (filters.group_id) params.append('group_id', filters.group_id);
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.per_page) params.append('per_page', filters.per_page);
      
      const response = await api.get(`/campaign/?${params.toString()}`);
      console.log('Campanhas carregadas:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar campanhas');
    }
  },

  async getCampaignStats(campaignId) {
    try {
      console.log('Buscando estatísticas da campanha:', campaignId);
      
      // Buscar emails da campanha para calcular estatísticas
      const emailsResponse = await api.get(`/campaign/${campaignId}/email?per_page=1000`);
      const emails = emailsResponse.data.items || [];
      
      const totalEmails = emails.length;
      const clickedEmails = emails.filter(email => email.interacted).length;
      const conversionRate = totalEmails > 0 ? (clickedEmails / totalEmails) * 100 : 0;
      
      return {
        totalEmails,
        clickedEmails,
        conversionRate: Math.round(conversionRate * 100) / 100,
        emails
      };
      
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar estatísticas');
    }
  },

  async createCampaign(campaignData) {
    try {
      console.log('Criando nova campanha:', campaignData);
      
      const requiredFields = ['name', 'group_id', 'email', 'start_date', 'end_date', 'send_time'];
      const missingFields = requiredFields.filter(field => !campaignData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
      }
      
      const formData = new FormData();
      
      formData.append('name', campaignData.name);
      formData.append('group_id', campaignData.group_id);
      formData.append('email', campaignData.email);
      formData.append('start_date', campaignData.start_date);
      formData.append('end_date', campaignData.end_date);
      formData.append('send_time', campaignData.send_time);
      
      if (campaignData.template_id) {
        formData.append('template_id', campaignData.template_id);
      }
      if (campaignData.subject_text) {
        formData.append('subject_text', campaignData.subject_text);
      }
      if (campaignData.title_text) {
        formData.append('title_text', campaignData.title_text);
      }
      if (campaignData.body_text) {
        formData.append('body_text', campaignData.body_text);
      }
      if (campaignData.button_text) {
        formData.append('button_text', campaignData.button_text);
      }
      if (campaignData.desc) {
        formData.append('desc', campaignData.desc);
      }
      
      const response = await api.post('/campaign/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Campanha criada com sucesso:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message ||
                      'Erro ao criar campanha';
      throw new Error(errorMsg);
    }
  },

  async getCampaignById(id) {
    try {
      console.log('Buscando campanha ID:', id);
      const response = await api.get(`/campaign/${id}`);
      console.log('Campanha encontrada:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao buscar campanha:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar campanha');
    }
  },

  async updateCampaign(id, campaignData) {
    try {
      console.log('Atualizando campanha ID:', id, campaignData);
      
      const formData = new FormData();
      if (campaignData.name) formData.append('name', campaignData.name);
      if (campaignData.group_id) formData.append('group_id', campaignData.group_id);
      if (campaignData.email) formData.append('email', campaignData.email);
      if (campaignData.start_date) formData.append('start_date', campaignData.start_date);
      if (campaignData.end_date) formData.append('end_date', campaignData.end_date);
      if (campaignData.send_time) formData.append('send_time', campaignData.send_time);
      if (campaignData.subject_text) formData.append('subject_text', campaignData.subject_text);
      if (campaignData.title_text) formData.append('title_text', campaignData.title_text);
      if (campaignData.body_text) formData.append('body_text', campaignData.body_text);
      if (campaignData.button_text) formData.append('button_text', campaignData.button_text);
      
      const response = await api.patch(`/campaign/${id}`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Campanha atualizada:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar campanha');
    }
  },

  async deleteCampaign(id) {
    try {
      console.log('Excluindo campanha ID:', id);
      const response = await api.delete(`/campaign/${id}`);
      console.log('Campanha excluída:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao excluir campanha:', error);
      throw new Error(error.response?.data?.message || 'Erro ao excluir campanha');
    }
  }
};