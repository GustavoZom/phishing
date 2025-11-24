import React, { useState, useEffect } from 'react';
import { groupService } from '../../services/groupService';
import './groupList.css';

const GroupList = ({ onGroupSelect, selectedGroupId, refreshTrigger }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    id: '',
    name: ''
  });

  useEffect(() => {
    loadGroups();
  }, [refreshTrigger]);

  const loadGroups = async (newFilters = filters) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Carregando grupos com filtros:', newFilters);
      const response = await groupService.getGroups(newFilters);
      
      const groupsData = response.items || response;
      setGroups(Array.isArray(groupsData) ? groupsData : []);
      
      console.log('Grupos carregados:', groupsData);
      
    } catch (err) {
      console.error('Erro ao carregar grupos:', err);
      setError(err.message);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    loadGroups(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { id: '', name: '' };
    setFilters(clearedFilters);
    loadGroups(clearedFilters);
  };

  const handleGroupClick = (group) => {
    if (onGroupSelect) {
      onGroupSelect(group);
    }
  };

  if (loading) {
    return (
      <div className="campaignListContainer">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Carregando grupos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="campaignListContainer">
      <div className="group-filters">
        <div className="filter-row">
          <input
            type="text"
            placeholder="ID"
            value={filters.id}
            onChange={(e) => handleFilterChange('id', e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Nome"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-actions">
          <button onClick={handleSearch} className="btn-search">
            Pesquisar
          </button>
          <button onClick={handleClearFilters} className="btn-clear">
            Limpar
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="cardListHeader">
        <span>Id</span>
        <span>Nome</span>
        <span></span>
      </div>

      <div className="campaignList">
        {groups.length === 0 ? (
          <div className="empty-state">
            {error ? 'Erro ao carregar grupos' : 'Nenhum grupo encontrado'}
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className={`campaignListCard ${selectedGroupId === group.id ? 'selected' : ''}`}
              onClick={() => handleGroupClick(group)}
            >
              <span>{group.id}</span>
              <span>{group.name}</span>
              <span>›</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupList;