import api from './api';

export const templateService = {
  async createTemplate(templateData) {
    try {
      console.log('🔍 Dados recebidos para criar template:', templateData);
      
      // Preparar dados exatamente como o backend espera
      const data = new URLSearchParams();
      data.append('name', templateData.name);
      data.append('code', templateData.code);
      
      // O backend espera 'desc' não 'description'
      if (templateData.description !== undefined) {
        data.append('desc', templateData.description);
      } else {
        data.append('desc', ''); // Enviar vazio se não existir
      }
      
      console.log('📤 Dados sendo enviados:', Object.fromEntries(data));
      
      const response = await api.post('/template/', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('✅ Template criado com sucesso:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erro detalhado ao criar template:', error);
      console.log('📋 Resposta completa do erro:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      // Mensagem de erro mais específica
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
      console.log('🔍 Atualizando template ID:', id, templateData);
      
      const data = new URLSearchParams();
      data.append('name', templateData.name);
      data.append('code', templateData.code);
      data.append('desc', templateData.description || '');
      
      console.log('📤 Dados sendo enviados para update:', Object.fromEntries(data));
      
      const response = await api.put(`/template/${id}`, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('✅ Template atualizado:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erro ao atualizar template:', error);
      console.log('📋 Resposta do erro:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar template');
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
      console.error('Erro ao buscar templates:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar templates');
    }
  },

  async getTemplateById(id) {
    try {
      const response = await api.get(`/template/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar template:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar template');
    }
  },

  async deleteTemplate(id) {
    try {
      const response = await api.delete(`/template/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      throw new Error(error.response?.data?.message || 'Erro ao excluir template');
    }
  }
};