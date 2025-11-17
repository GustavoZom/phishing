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
    <table className="template-list">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nome</th>
          <th>Tipo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {templates.map((template) => (
          <tr 
            key={template.id} 
            onClick={() => onTemplateSelect && onTemplateSelect(template)}
            style={{ 
              backgroundColor: selectedTemplateId === template.id ? '#e6f2ff' : 'transparent',
              cursor: 'pointer'
            }}
          >
            <td>{template.id}</td>
            <td>{template.name}</td>
            <td>{template.tipo || 'Personalizado'}</td>
            <td>
              <button 
                className="btn-delete"
                onClick={(e) => handleDelete(template.id, e)}
                disabled={deletingId === template.id}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {deletingId === template.id ? 'Excluindo...' : 'Excluir'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TemplateList;