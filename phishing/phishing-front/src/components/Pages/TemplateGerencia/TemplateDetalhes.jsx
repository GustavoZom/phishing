import { useState } from 'react';
import { templateService } from '../../services/templateService';
import './templatesGerencia.css';

function TemplateDetalhes({ template, onTemplateDeleted, onRefresh }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!template || !window.confirm('Tem certeza que deseja excluir este template?')) {
      return;
    }

    setDeleting(true);
    try {
      await templateService.deleteTemplate(template.id);
      if (onTemplateDeleted) {
        onTemplateDeleted();
      }
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      alert('Erro ao excluir template: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (!template) {
    return (
      <div className="gDetailsContainer">
        <h3>Detalhes do Template</h3>
        <span className="gDetailsEmpty">Selecione um template à esquerda</span>
      </div>
    );
  }

  return (
    <div className="gDetailsContainer">
      <h3>Detalhes do Template</h3>
      <div className="gDetailsCard">
        <p><strong>Id:</strong> <span>{template.id}</span></p>
        <p><strong>Nome:</strong> <span>{template.name}</span></p>
        <p><strong>Descrição:</strong> <span>{template.description || 'Sem descrição'}</span></p>
        <p><strong>Criador:</strong> <span>{template.creator_id === 0 ? 'Admin' : `Usuário ${template.creator_id}`}</span></p>
        
        <div className="template-actions">

          <button 
            className="btn-delete"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Excluindo...' : 'Excluir Template'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TemplateDetalhes;