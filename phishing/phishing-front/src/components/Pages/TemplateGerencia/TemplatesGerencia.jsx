import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TemplateList from "./TemplateList";
import TemplateDetalhes from "./TemplateDetalhes";
import TemplatePreview from "./TemplatePreview";
import { templateService } from '../../services/templateService';
import './templatesGerencia.css';

function TemplatesGerencia() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    tipo: ''
  });

  const location = useLocation();

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      loadTemplates();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadTemplates = async (filterParams = {}) => {
    setLoading(true);
    setError('');
    try {
      const response = await templateService.getTemplates(filterParams);
      setTemplates(response.items || []);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      setError(error.message);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = async (template) => {
    try {
      setError('');
      const templateData = await templateService.getTemplateById(template.id);
      setSelectedTemplate(templateData);
    } catch (error) {
      console.error('Erro ao carregar template:', error);
      setError(error.message);
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    const filterParams = {};
    if (filters.id) filterParams.id = filters.id;
    if (filters.name) filterParams.name = filters.name;
    loadTemplates(filterParams);
  };

  const handleClearFilters = () => {
    setFilters({ id: '', name: '', tipo: '' });
    loadTemplates();
  };

  const handleTemplateCreated = () => {
    loadTemplates();
  };

  const handleTemplateDeleted = () => {
    setSelectedTemplate(null);
    loadTemplates();
  };

  return (
    <div className="mainContainer">
      <div className="hSidenav">
      </div>

      <div className="gTemplatesContainer">
        <div className="gerenciaTitle">
          <h2>Templates</h2>
          <Link 
            to="/templateCriar" 
            state={{ refresh: true }}
          >
            <span>Novo Template</span>
          </Link>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="gSectionContainer">
          <div className="gTemplateSection left">
            <div className="gFilterContainer">
              <input 
                type="text" 
                placeholder="Id" 
                value={filters.id}
                onChange={(e) => handleFilterChange('id', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Nome" 
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />

              <select 
                value={filters.tipo}
                onChange={(e) => handleFilterChange('tipo', e.target.value)}
              >
                <option value="">Tipo</option>
                <option value="phishing">Phishing</option>
                <option value="educacional">Educacional</option>
                <option value="notificacao">Notificação</option>
              </select>

              <div className="filterButtons">
                <button className="btn-clear" onClick={handleClearFilters}>
                  Limpar Filtros
                </button>
                <button className="btn-search" onClick={handleSearch}>
                  Pesquisar
                </button>
              </div>
            </div>

            <div className="gTemplatelistContainer">
              <TemplateList 
                templates={templates}
                loading={loading}
                onTemplateSelect={handleTemplateSelect}
                selectedTemplateId={selectedTemplate?.id}
                onRefresh={loadTemplates}
              />
            </div>
          </div>

          <div className="gTemplateSection right">
            <div className="gGridRight">
              <TemplateDetalhes 
                template={selectedTemplate} 
                onTemplateDeleted={handleTemplateDeleted}
                onRefresh={loadTemplates}
              />
              <TemplatePreview template={selectedTemplate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplatesGerencia;