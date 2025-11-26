import api from './api';

export const groupService = {
  async getGroups(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.id) params.append('id', filters.id);
      if (filters.name) params.append('name', filters.name);
      if (filters.page) params.append('page', filters.page);
      if (filters.per_page) params.append('per_page', filters.per_page);
      
      const response = await api.get(`/group/?${params.toString()}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao carregar grupos';
      throw new Error(errorMessage);
    }
  },

  async getGroupById(id) {
    try {
      const response = await api.get(`/group/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao carregar grupo';
      throw new Error(errorMessage);
    }
  },

  async createGroup(groupData) {
    try {
      const formData = new FormData();
      formData.append('name', groupData.name);
      
      if (groupData.description) formData.append('desc', groupData.description);
      
      if (groupData.targets && groupData.targets.length > 0) {
        groupData.targets.forEach((target) => {
          formData.append('target', JSON.stringify(target));
        });
      }
      
      const response = await api.post('/group/', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Erro ao criar grupo';
      throw new Error(errorMsg);
    }
  },

  async updateGroup(id, groupData) {
    try {
      const formData = new FormData();
      if (groupData.name) formData.append('name', groupData.name);
      if (groupData.description) formData.append('desc', groupData.description);
      
      const response = await api.patch(`/group/${id}`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao atualizar grupo';
      throw new Error(errorMessage);
    }
  },

  async deleteGroup(id) {
    try {
      const response = await api.delete(`/group/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao excluir grupo';
      throw new Error(errorMessage);
    }
  },

  async getGroupMembers(groupId, filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.target_id) params.append('target_id', filters.target_id);
      if (filters.name) params.append('name', filters.name);
      if (filters.email) params.append('email', filters.email);
      if (filters.person_code) params.append('person_code', filters.person_code);
      if (filters.page) params.append('page', filters.page);
      if (filters.per_page) params.append('per_page', filters.per_page);
      
      const response = await api.get(`/group/${groupId}/target?${params.toString()}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao carregar membros';
      throw new Error(errorMessage);
    }
  },

  async addMemberToGroup(groupId, memberData) {
    try {
      const formData = new FormData();
      formData.append('name', memberData.name);
      formData.append('person_code', memberData.person_code);
      formData.append('email', memberData.email);
      
      const response = await api.post(`/group/${groupId}/target`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao adicionar membro';
      throw new Error(errorMessage);
    }
  },

  async updateMember(memberId, memberData) {
    try {
      const formData = new FormData();
      formData.append('name', memberData.name);
      formData.append('person_code', memberData.person_code);
      formData.append('email', memberData.email);
      
      const response = await api.patch(`/target/${memberId}`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao atualizar membro';
      throw new Error(errorMessage);
    }
  },

  async deleteMember(memberId) {
    try {
      const response = await api.delete(`/target/${memberId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao excluir membro';
      throw new Error(errorMessage);
    }
  },

  async getMemberById(memberId) {
    try {
      const response = await api.get(`/target/${memberId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao carregar membro';
      throw new Error(errorMessage);
    }
  }
};