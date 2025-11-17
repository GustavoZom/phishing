import { useState, useEffect } from 'react';
import { templateService } from '../../services/templateService';
import './templateCriar.css';

function TemplateList({ onTemplateSelect, selectedTemplateId, refreshTrigger }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, [refreshTrigger]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await templateService.getTemplates();
      setTemplates(response.items || []);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
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
        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          Crie seu primeiro template usando o formulário ao lado
        </p>
      </div>
    );
  }

  return (
    <table className="template-list">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nome</th>
          <th>Criado em</th>
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
            <td>{new Date(template.created_at).toLocaleDateString('pt-BR')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TemplateList;