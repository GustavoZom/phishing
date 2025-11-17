import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GroupList from '../../Modules/GroupList/GroupList';
import './grupoGerencia.css';

function GrupoGerencia() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="mainContainer">
      <div className="gGerenciarContainer">
        <div className="campanhaTitle">
          <h2>Grupos</h2>
          <Link to="/grupoCriar">
            <span className="btn-novo-grupo">Novo Grupo</span>
          </Link>
        </div>
        
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
                      <div className="infoStatus">
                        <span className="status-badge">Sem campanha</span>
                      </div>
                    </div>
                    
                    <div className="infoDescricao">
                      <p>{selectedGroup.description || 'Sem descrição'}</p>
                    </div>
                  </div>
                </div>

                <div className="membrosSection">
                  <h3>Membros do Grupo</h3>
                  
                  <div className="membrosListContainer">
                    <div className="membrosListHeader">
                      <span>Id</span>
                      <span>Nome</span>
                      <span>E-mail</span>
                    </div>
                    
                    <div className="membrosList">
                      <div className="membroListItem">
                        <span>Funcionalidade em desenvolvimento</span>
                        <span>Em breve você poderá visualizar os membros</span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="formActions">
                  <button className="btn-editar">Editar Grupo</button>
                  <button className="btn-excluir">Excluir Grupo</button>
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
    </div>
  );
}

export default GrupoGerencia;