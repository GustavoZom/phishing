import React, { useState, useEffect } from 'react';
import { templateService } from '../../services/templateService';
import './templateList.css';

const TemplateList = ({ onTemplateSelect, selectedTemplateId, refreshTrigger }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    id: '',
    name: ''
  });

  useEffect(() => {
    loadTemplates();
  }, [refreshTrigger]);

  const loadTemplates = async (newFilters = filters) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Carregando templates com filtros:', newFilters);
      const response = await templateService.getTemplates(newFilters);
      
      const templatesData = response.items || response;
      setTemplates(Array.isArray(templatesData) ? templatesData : []);
      
      console.log('Templates carregados:', templatesData);
      
    } catch (err) {
      console.error('Erro ao carregar templates:', err);
      setError(err.message);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    loadTemplates(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { id: '', name: '' };
    setFilters(clearedFilters);
    loadTemplates(clearedFilters);
  };

  const handleTemplateClick = (template) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  if (loading) {
    return (
      <div className="templateListContainer">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Carregando templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="templateListContainer">
      <div className="template-filters">
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

      <div className="templateList">
        {templates.length === 0 ? (
          <div className="empty-state">
            {error ? 'Erro ao carregar templates' : 'Nenhum template encontrado'}
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className={`templateListCard ${selectedTemplateId === template.id ? 'selected' : ''}`}
              onClick={() => handleTemplateClick(template)}
            >
              <span>{template.id}</span>
              <span>{template.name}</span>
              <span>›</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TemplateList;