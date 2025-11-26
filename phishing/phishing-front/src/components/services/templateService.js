import api from './api';

export const templateService = {
  async createTemplate(templateData) {
    try {
      const data = new URLSearchParams();
      data.append('name', templateData.name);
      data.append('code', templateData.code);
      data.append('desc', templateData.description || '');
      
      const response = await api.post('/template/', data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      return response.data;
    } catch (error) {
      let errorMsg = 'Erro ao criar template';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMsg = typeof error.response.data.error === 'object' 
          ? JSON.stringify(error.response.data.error)
          : error.response.data.error;
      }
      throw new Error(errorMsg);
    }
  },

  async updateTemplate(id, templateData) {
    try {
      const data = new URLSearchParams();
      data.append('name', templateData.name);
      data.append('code', templateData.code);
      data.append('desc', templateData.description || '');
      
      const response = await api.put(`/template/${id}`, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao atualizar template';
      throw new Error(errorMessage);
    }
  },

  async getTemplates(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.id) params.append('id', filters.id);
      if (filters.name) params.append('name', filters.name);
      if (filters.page) params.append('page', filters.page);
      if (filters.per_page) params.append('per_page', filters.per_page);
      
      const response = await api.get(`/template/?${params.toString()}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao carregar templates';
      throw new Error(errorMessage);
    }
  },

  async getTemplateById(id) {
    try {
      const response = await api.get(`/template/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao carregar template';
      throw new Error(errorMessage);
    }
  },

  async deleteTemplate(id) {
    try {
      const response = await api.delete(`/template/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao excluir template';
      throw new Error(errorMessage);
    }
  }
};