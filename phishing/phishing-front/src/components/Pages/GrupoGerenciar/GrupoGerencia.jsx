import React, { useState, useEffect } from 'react';
import { BsApp, BsJustify, BsInboxes, BsPeople, BsGrid1X2, BsPersonCircle, BsFillTrashFill, BsPencilSquare } from "react-icons/bs";
import { FaPenToSquare } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import GroupList from '../../Modules/GroupList/GroupList';
import { groupService } from '../../services/groupService';
import './grupoGerencia.css';

function GrupoGerencia() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    person_code: ''
  });

  useEffect(() => {
    if (selectedGroup) {
      loadGroupMembers(selectedGroup.id);
    }
  }, [selectedGroup]);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setGroupMembers([]);
    setError('');
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    setSelectedGroup(null);
    setError('');
  };

  const loadGroupMembers = async (groupId) => {
    try {
      setLoading(true);
      setError('');
      const response = await groupService.getGroupMembers(groupId);
      setGroupMembers(response.items || []);
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
      setError(error.message);
      setGroupMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setMemberForm({ name: '', email: '', person_code: '' });
    setShowAddMemberModal(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      email: member.email,
      person_code: member.person_code
    });
    setShowAddMemberModal(true);
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Tem certeza que deseja excluir este membro?')) {
      return;
    }

    try {
      setError('');
      await groupService.deleteMember(memberId);
      loadGroupMembers(selectedGroup.id);
    } catch (error) {
      console.error('Erro ao excluir membro:', error);
      setError(error.message);
    }
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    
    if (!memberForm.name.trim() || !memberForm.email.trim() || !memberForm.person_code.trim()) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      setError('');
      if (editingMember) {
        await groupService.updateMember(editingMember.id, {
          name: memberForm.name,
          email: memberForm.email,
          person_code: memberForm.person_code
        });
      } else {
        await groupService.addMemberToGroup(selectedGroup.id, {
          name: memberForm.name,
          email: memberForm.email,
          person_code: memberForm.person_code
        });
      }

      setShowAddMemberModal(false);
      loadGroupMembers(selectedGroup.id);
      setMemberForm({ name: '', email: '', person_code: '' });
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
      setError(error.message);
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup || !window.confirm('Tem certeza que deseja excluir este grupo?')) {
      return;
    }

    try {
      setError('');
      await groupService.deleteGroup(selectedGroup.id);
      setSelectedGroup(null);
      handleRefresh();
    } catch (error) {
      console.error('Erro ao excluir grupo:', error);
      setError(error.message);
    }
  };

  const renderMembersList = () => {
    if (loading) {
      return (
        <div className="loading-members">
          <span>Carregando membros...</span>
        </div>
      );
    }

    if (groupMembers.length === 0) {
      return (
        <div className="no-members">
          <span>Nenhum membro adicionado ao grupo</span>
        </div>
      );
    }

    return groupMembers.map((member) => (
      <div key={member.id} className="membroListItem">
        <span className="member-id">{member.id}</span>
        <span className="member-name">{member.name}</span>
        <span className="member-email">{member.email}</span>
        <div className="member-actions">
          <button 
            className="btn-edit-member"
            onClick={() => handleEditMember(member)}
            title="Editar membro"
          >
            <BsPencilSquare />
          </button>
          {member.can_be_deleted !== false && (
            <button 
              className="btn-delete-member"
              onClick={() => handleDeleteMember(member.id)}
              title="Excluir membro"
            >
              <BsFillTrashFill />
            </button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="mainContainer">
      <div className="hSidenav">
      </div>
      
      <div className="gGerenciarContainer">
        <div className="gerenciaTitle">
          <h2>Grupos</h2>
          <Link to="/grupoCriar">
            <span className="btn-novo-grupo">Novo Grupo</span>
          </Link>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="gSectionContainer">
          <div className="gGerenciarSection left">
            <div className="userList">
              <GroupList 
                onGroupSelect={handleGroupSelect}
                selectedGroupId={selectedGroup?.id}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
          
          <div className="gGerenciarSection right">
            {selectedGroup ? (
              <>
                <div className="dadosGrupoSection">
                  <div className="infoGrupo">
                    <div className="infoHeader">
                      <div className="infoId">
                        <span className="label">Id:</span>
                        <span className="value">{selectedGroup.id}</span>
                      </div>
                      <div className="infoNome">
                        <span className="label">{selectedGroup.name}</span>
                      </div>
                    </div>
                    
                    <div className="infoDescricao">
                      <p>{selectedGroup.description || 'Sem descrição'}</p>
                    </div>
                  </div>
                </div>

                <div className="membrosSection">
                  <div className="membrosHeader">
                    <h3>Membros do Grupo</h3>
                    <div className="membrosHeaderActions">
                      <button 
                        className="btn-add-member"
                        onClick={handleAddMember}
                        title="Adicionar membro"
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="membrosListContainer">
                    <div className="membrosListHeaderG">
                      <span>Id</span>
                      <span>Nome</span>
                      <span>E-mail</span>
                      <span>Ações</span>
                    </div>
                    
                    <div className="membrosList">
                      {renderMembersList()}
                    </div>
                  </div>
                </div>

                <div className="formActions">
                  {selectedGroup.can_be_deleted !== false && (
                    <button 
                      className="btn-delete"
                      onClick={handleDeleteGroup}
                    >
                      <i className="bi bi-trash"></i> Excluir Grupo
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="no-group-selected">
                <h3>Selecione um grupo para visualizar os detalhes</h3>
                <p>Clique em um grupo da lista ao lado para ver suas informações</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddMemberModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingMember ? 'Editar Membro' : 'Adicionar Membro'}</h3>
              <button 
                className="btn-close-modal"
                onClick={() => setShowAddMemberModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleMemberSubmit} className="member-form">
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite o nome do membro"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>E-mail *</label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Digite o e-mail do membro"
                  required
                />
              </div>

              <div className="form-group">
                <label>Código da Pessoa *</label>
                <input
                  type="text"
                  value={memberForm.person_code}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, person_code: e.target.value }))}
                  placeholder="Digite o código único da pessoa"
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddMemberModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn-save"
                >
                  {editingMember ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GrupoGerencia;