import api from './api';

export const templateService = {
  async getTemplates(filters = {}) {
    try {
      console.log('Buscando templates com filtros:', filters);
      
      const params = new URLSearchParams();
      
      if (filters.id) params.append('id', filters.id);
      if (filters.name) params.append('name', filters.name);
      if (filters.page) params.append('page', filters.page);
      if (filters.per_page) params.append('per_page', filters.per_page);
      
      const response = await api.get(`/template/?${params.toString()}`);
      console.log('Templates carregados:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar templates');
    }
  },

  async createTemplate(templateData) {
    try {
      console.log('Criando novo template:', templateData);
      
      const formData = new FormData();
      formData.append('name', templateData.name);
      formData.append('code', templateData.code);
      
      if (templateData.description) {
        formData.append('desc', templateData.description);
      }
      
      const response = await api.post('/template/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Template criado com sucesso:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao criar template:', error);
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      'Erro ao criar template';
      throw new Error(errorMsg);
    }
  },

  async getTemplateById(id) {
    try {
      console.log('Buscando template ID:', id);
      const response = await api.get(`/template/${id}`);
      console.log('Template encontrado:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao buscar template:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar template');
    }
  },

  async updateTemplate(id, templateData) {
    try {
      console.log('Atualizando template ID:', id, templateData);
      
      const formData = new FormData();
      formData.append('id', id);
      if (templateData.name) formData.append('name', templateData.name);
      if (templateData.description) formData.append('desc', templateData.description);
      if (templateData.code) formData.append('code', templateData.code);
      
      const response = await api.put(`/template/`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Template atualizado:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar template');
    }
  },

  async deleteTemplate(id) {
    try {
      console.log('Excluindo template ID:', id);
      const response = await api.delete(`/template/${id}`);
      console.log('Template excluído:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      throw new Error(error.response?.data?.message || 'Erro ao excluir template');
    }
  }
};