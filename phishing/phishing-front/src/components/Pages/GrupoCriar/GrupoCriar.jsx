import React, { useState } from 'react';
import GroupList from '../../Modules/GroupList/GroupList';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../../services/groupService';
import './grupoCriar.css';

function GrupoCriar() {
  const [formData, setFormData] = useState({
    name: '',
    desc: ''
  });
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    person_code: ''
  });

  const navigate = useNavigate();
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGroupSelect = (group) => {
    setFormData({
      name: group.name,
      desc: group.description || ''
    });
  };

  const handleAddMember = () => {
    setMemberForm({ name: '', email: '', person_code: '' });
    setShowAddMemberModal(true);
  };

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    
    if (!memberForm.name.trim() || !memberForm.email.trim() || !memberForm.person_code.trim()) {
      alert('Todos os campos são obrigatórios');
      return;
    }

    const newMember = {
      id: Date.now(),
      name: memberForm.name,
      email: memberForm.email,
      person_code: memberForm.person_code
    };

    setGroupMembers(prev => [...prev, newMember]);
    setShowAddMemberModal(false);
    setMemberForm({ name: '', email: '', person_code: '' });
  };

  const handleRemoveMember = (memberId) => {
    setGroupMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const handleCreateGroup = async () => {
    if (!formData.name.trim()) {
      setError('Nome do grupo é obrigatório');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await groupService.createGroup({
        name: formData.name,
        description: formData.desc || '',
        targets: groupMembers.map(member => ({
          name: member.name,
          email: member.email,
          person_code: member.person_code
        }))
      });

      setSuccess('Grupo criado com sucesso!');
      setFormData({ name: '', desc: '' });
      setGroupMembers([]);
      
      setRefreshTrigger(prev => prev + 1);
      
    } catch (err) {
      console.error('Erro ao criar grupo:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({ name: '', desc: '' });
    setGroupMembers([]);
    setError('');
    setSuccess('');
  };

  const renderMembersList = () => {
    if (groupMembers.length === 0) {
      return (
        <div className="no-members">
          <span>Nenhum membro adicionado ao grupo</span>
        </div>
      );
    }

    return groupMembers.map((member) => (
      <div key={member.id} className="membroItem">
        <span className="member-name">{member.name}</span>
        <span className="member-email">{member.email}</span>
        <div className="member-actions">
          <button 
            className="btn-remove-member"
            onClick={() => handleRemoveMember(member.id)}
            title="Remover membro"
          >
            Remover
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="mainContainer">
      <div className="hSidenav">
      </div>
      
      <div className="gCriarContainer">
         <div className="campanhaTitle">
          <h2>Grupos</h2>
          <div>
            <button 
              className="btn-voltar-grupo"
              onClick={() => navigate('/grupoGerencia')}
            >
              Voltar para Grupos
            </button>
            <span className="btn-novo-grupo">Novo Grupo</span>
          </div>
        </div>
        
        <div className="gSectionContainer">
          <div className="gCriarSection left">
            <div className="userList">
              <GroupList 
                onGroupSelect={handleGroupSelect}
                selectedGroupId={null}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
          
          <div className="gCriarSection right">
            <div className="dadosGrupoSection">
              <h3>Dados do Grupo</h3>
              
              {error && (
                <div className="error-message-form">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="success-message">
                  {success}
                </div>
              )}
              
              <div className="formGrupo">
                <div className="formGroup">
                  <label>Nome do Grupo *</label>
                  <input 
                    type="text" 
                    placeholder="Digite o nome do grupo" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="formGroup">
                  <label>Descrição do Grupo</label>
                  <textarea 
                    placeholder="Digite a descrição do grupo" 
                    rows="3" 
                    value={formData.desc}
                    onChange={(e) => handleInputChange('desc', e.target.value)}
                    disabled={loading}
                  />
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
                    +
                  </button>
                </div>
              </div>
              
              <div className="membrosListContainer">
                <div className="membrosListHeader">
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
              <button 
                className="btn-cancelar" 
                onClick={handleClearForm}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                className="btn-criar" 
                onClick={handleCreateGroup}
                disabled={loading || !formData.name.trim()}
              >
                {loading ? 'Criando...' : 'Criar Grupo'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddMemberModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Adicionar Membro</h3>
              <button 
                className="btn-close-modal"
                onClick={() => setShowAddMemberModal(false)}
              >
                ×
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
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GrupoCriar;