import api from './api';

export const groupService = {
  async getGroups(filters = {}) {
    try {
      console.log('Buscando grupos com filtros:', filters);
      
      const params = new URLSearchParams();
      
      if (filters.id) params.append('id', filters.id);
      if (filters.name) params.append('name', filters.name);
      if (filters.page) params.append('page', filters.page);
      if (filters.per_page) params.append('per_page', filters.per_page);
      
      const response = await api.get(`/group/?${params.toString()}`);
      console.log('Grupos carregados:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar grupos');
    }
  },

  async getGroupById(id) {
    try {
      console.log('Buscando grupo ID:', id);
      const response = await api.get(`/group/${id}`);
      console.log('Grupo encontrado:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao buscar grupo:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar grupo');
    }
  },

  async createGroup(groupData) {
    try {
      console.log('Criando novo grupo:', groupData);
      
      const formData = new FormData();
      formData.append('name', groupData.name);
      
      if (groupData.description) {
        formData.append('desc', groupData.description);
      }
      
      if (groupData.targets && groupData.targets.length > 0) {
        groupData.targets.forEach((target, index) => {
          formData.append('target', JSON.stringify(target));
        });
      }
      
      const response = await api.post('/group/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Grupo criado com sucesso:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      'Erro ao criar grupo';
      throw new Error(errorMsg);
    }
  },

  async updateGroup(id, groupData) {
    try {
      console.log('Atualizando grupo ID:', id, groupData);
      
      const formData = new FormData();
      if (groupData.name) formData.append('name', groupData.name);
      if (groupData.description) formData.append('desc', groupData.description);
      
      const response = await api.patch(`/group/${id}`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Grupo atualizado:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar grupo');
    }
  },

  async deleteGroup(id) {
    try {
      console.log('Excluindo grupo ID:', id);
      const response = await api.delete(`/group/${id}`);
      console.log('Grupo excluído:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao excluir grupo:', error);
      throw new Error(error.response?.data?.message || 'Erro ao excluir grupo');
    }
  },

  async getGroupMembers(groupId, filters = {}) {
    try {
      console.log('Buscando membros do grupo:', groupId);
      
      const params = new URLSearchParams();
      if (filters.target_id) params.append('target_id', filters.target_id);
      if (filters.name) params.append('name', filters.name);
      if (filters.email) params.append('email', filters.email);
      if (filters.person_code) params.append('person_code', filters.person_code);
      if (filters.page) params.append('page', filters.page);
      if (filters.per_page) params.append('per_page', filters.per_page);
      
      const response = await api.get(`/group/${groupId}/target?${params.toString()}`);
      console.log('Membros carregados:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar membros');
    }
  },

  async addMemberToGroup(groupId, memberData) {
    try {
      console.log('Adicionando membro ao grupo:', groupId, memberData);
      
      const formData = new FormData();
      formData.append('name', memberData.name);
      formData.append('person_code', memberData.person_code);
      formData.append('email', memberData.email);
      
      const response = await api.post(`/group/${groupId}/target`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Membro adicionado:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      throw new Error(error.response?.data?.message || 'Erro ao adicionar membro');
    }
  },

  async updateMember(memberId, memberData) {
    try {
      console.log('Atualizando membro ID:', memberId, memberData);
      
      const formData = new FormData();
      formData.append('name', memberData.name);
      formData.append('person_code', memberData.person_code);
      formData.append('email', memberData.email);
      
      const response = await api.patch(`/target/${memberId}`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Membro atualizado:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar membro');
    }
  },

  async deleteMember(memberId) {
    try {
      console.log('Excluindo membro ID:', memberId);
      const response = await api.delete(`/target/${memberId}`);
      console.log('Membro excluído:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao excluir membro:', error);
      throw new Error(error.response?.data?.message || 'Erro ao excluir membro');
    }
  },

  async getMemberById(memberId) {
    try {
      console.log('Buscando membro ID:', memberId);
      const response = await api.get(`/target/${memberId}`);
      console.log('Membro encontrado:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Erro ao buscar membro:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar membro');
    }
  }
};