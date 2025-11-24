import { useState } from 'react';
import { templateService } from '../../services/templateService';
import './templatesGerencia.css';

function TemplateList({ templates, loading, onTemplateSelect, selectedTemplateId, onRefresh }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (templateId, event) => {
    event.stopPropagation();
    
    if (!window.confirm('Tem certeza que deseja excluir este template?')) {
      return;
    }

    setDeletingId(templateId);
    try {
      await templateService.deleteTemplate(templateId);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      alert('Erro ao excluir template: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span>Carregando templates...</span>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="empty-state">
        <span>Nenhum template encontrado</span>
      </div>
    );
  }

  return (
    <div className="template-list-container">
      <div className="template-list-header">
        <span>Id</span>
        <span>Nome</span>
        <span></span>
      </div>
      
      <div className="template-list">
        {templates.length === 0 ? (
          <div className="empty-state">
            {error ? 'Erro ao carregar templates' : 'Nenhum template encontrado'}
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className={`template-item ${selectedTemplateId === template.id ? 'selected' : ''}`}
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
}

export default TemplateList;