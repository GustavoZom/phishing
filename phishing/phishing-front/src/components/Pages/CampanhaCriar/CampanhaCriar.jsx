import React, { useState, useEffect } from 'react';
import SideNav from "../../Modules/sidenav/SideNav";
import { campaignService } from '../../services/campaignService';
import { groupService } from '../../services/groupService';
import { templateService } from '../../services/templateService';
import './campanhaCriar.css';

function CampanhaCriar() {
  const [formData, setFormData] = useState({
    name: '',
    group_id: '',
    template_id: '',
    start_date: '',
    end_date: '',
    send_time: '',
    subject_text: '',
    title_text: 'Título do Email',
    body_text: 'Conteúdo do email...',
    button_text: 'Clique Aqui',
    email: ''
  });
  
  const [groups, setGroups] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadGroups();
    loadTemplates();
  }, []);

  useEffect(() => {
    if (formData.template_id) {
      loadTemplateData(formData.template_id);
    } else {
      setSelectedTemplate(null);
    }
  }, [formData.template_id]);

  const loadGroups = async () => {
    try {
      const response = await groupService.getGroups();
      setGroups(response.items || []);
    } catch (err) {
      console.error('Erro ao carregar grupos:', err);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await templateService.getTemplates();
      setTemplates(response.items || []);
    } catch (err) {
      console.error('Erro ao carregar templates:', err);
    }
  };

  const loadTemplateData = async (templateId) => {
    try {
      const template = await templateService.getTemplateById(templateId);
      setSelectedTemplate(template);
      
      // Preencher campos com valores padrão do template
      setFormData(prev => ({
        ...prev,
        subject_text: prev.subject_text || 'Assunto Importante',
        title_text: prev.title_text || 'Título do Email',
        body_text: prev.body_text || 'Conteúdo do email...',
        button_text: prev.button_text || 'Clique Aqui'
      }));
    } catch (err) {
      console.error('Erro ao carregar template:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateCampaign = async () => {
    // Validações básicas
    const requiredFields = [
      'name', 'group_id', 'template_id', 'start_date', 
      'end_date', 'send_time', 'email', 'subject_text',
      'title_text', 'body_text'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('Criando campanha:', formData);
      
      await campaignService.createCampaign(formData);

      setSuccess('Campanha criada com sucesso!');
      
      // Limpar o form
      setFormData({
        name: '',
        group_id: '',
        template_id: '',
        start_date: '',
        end_date: '',
        send_time: '',
        subject_text: '',
        title_text: 'Título do Email',
        body_text: 'Conteúdo do email...',
        button_text: 'Clique Aqui',
        email: ''
      });
      setSelectedTemplate(null);
      
    } catch (err) {
      console.error('Erro ao criar campanha:', err);
      setError(err.message || 'Erro ao criar campanha');
    } finally {
      setLoading(false);
    }
  };

  const renderEmailPreview = () => {
    if (!selectedTemplate?.code) {
      return (
        <div className="previewPlaceholder">
          Selecione um template para ver a prévia do email
        </div>
      );
    }

    // Gerar preview dinamicamente do código do template
    const previewHtml = selectedTemplate.code
      .replace(/{{title}}/g, formData.title_text || 'Título do Email')
      .replace(/{{body_text}}/g, formData.body_text || 'Conteúdo do email...')
      .replace(/{{name}}/g, 'Nome do Usuário')
      .replace(/{{link}}/g, '#')
      .replace(/{{button_text}}/g, formData.button_text || 'Clique Aqui');

    return (
      <div 
        className="emailPreviewContent"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    );
  };

  return (
    <div className="campanhaCriar">
      <div className="hSidenav">
        <SideNav />
      </div>

      <div className="cCriarContent">
        <h2>Nova Campanha</h2>

        {error && (
          <div className="errorMessage">
            {error}
          </div>
        )}

        {success && (
          <div className="successMessage">
            {success}
          </div>
        )}

        {/* Dados da campanha */}
        <div className="sectionContainer">
          <h3 className="sectionTitle">Dados da Campanha</h3>
          <div className="sectionBox">
            <div className="formSingleColumn">
              <div className="formGroup">
                <label>Nome da Campanha *</label>
                <input 
                  type="text" 
                  placeholder="Campanha Inverno 2025" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="formGroup">
                <label>Grupo *</label>
                <select 
                  value={formData.group_id}
                  onChange={(e) => handleInputChange('group_id', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Selecione...</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <label>Template *</label>
                <select 
                  value={formData.template_id}
                  onChange={(e) => handleInputChange('template_id', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Selecione...</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <label>E-mail do Remetente *</label>
                <input 
                  type="email" 
                  placeholder="remetente@empresa.com" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="dateRow">
                <div className="formGroup">
                  <label>Data Início *</label>
                  <input 
                    type="date" 
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="formGroup">
                  <label>Data Fim *</label>
                  <input 
                    type="date" 
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="formGroup">
                <label>Hora do Disparo *</label>
                <input 
                  type="time" 
                  value={formData.send_time}
                  onChange={(e) => handleInputChange('send_time', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configurar Template */}
        <div className="sectionContainer">
          <h3 className="sectionTitle">
            Configurar Template {selectedTemplate && `- ${selectedTemplate.name}`}
          </h3>
          <div className="sectionBox">
            <div className="formSingleColumn">
              <div className="formGroup">
                <label>Assunto do e-mail *</label>
                <input 
                  type="text" 
                  placeholder="Seu pagamento está atrasado" 
                  value={formData.subject_text}
                  onChange={(e) => handleInputChange('subject_text', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="formGroup">
                <label>Título do e-mail *</label>
                <input 
                  type="text" 
                  placeholder="Conta Suspensa" 
                  value={formData.title_text}
                  onChange={(e) => handleInputChange('title_text', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="formGroup">
                <label>Corpo do e-mail *</label>
                <textarea 
                  rows="6" 
                  placeholder="Digite o conteúdo do e-mail..." 
                  value={formData.body_text}
                  onChange={(e) => handleInputChange('body_text', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="formGroup">
                <label>Texto do Botão</label>
                <input 
                  type="text" 
                  placeholder="ATUALIZAR AQUI" 
                  value={formData.button_text}
                  onChange={(e) => handleInputChange('button_text', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Prévia do E-mail */}
        <div className="sectionContainer">
          <h3 className="sectionTitle">Prévia do E-mail</h3>
          <div className="sectionBox previewBox">
            <div className="emailPreview">
              {renderEmailPreview()}
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="actionButtons">
          <button 
            className="btn-cancel" 
            onClick={() => {
              setFormData({
                name: '',
                group_id: '',
                template_id: '',
                start_date: '',
                end_date: '',
                send_time: '',
                subject_text: '',
                title_text: 'Título do Email',
                body_text: 'Conteúdo do email...',
                button_text: 'Clique Aqui',
                email: ''
              });
              setSelectedTemplate(null);
              setError('');
              setSuccess('');
            }}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            className="btn-create" 
            onClick={handleCreateCampaign}
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Campanha'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CampanhaCriar;