import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateList from '../../Modules/TemplateList/TemplateList';
import { templateService } from '../../services/templateService';
import './templateCriar.css';
import JoditEditor from 'jodit-react';

function TemplateCriar() {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  const config = useMemo(() => ({
      readonly: false,
      language: 'pt_br',
      speechRecognize: false,
      disablePlugins: ['aiAssistant'],
      history: {
        enable: true,
        maxHistoryLength: 100
    }
  }), []);

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewVariables, setPreviewVariables] = useState({
    title: 'Título do Email',
    body_text: '<p>Este é o conteúdo principal do email que será personalizado para cada campanha.</p>',
    name: 'Nome do Usuário',
    button_text: 'Clique Aqui'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleEditorChange = (e) => {
    const htmlContent = e;
    handleInputChange('code', htmlContent);
  };

  const handlePreviewVariableChange = (variable, value) => {
    setPreviewVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    if (template && template.id) {
      loadTemplateData(template.id);
    }
  };

  const loadTemplateData = async (templateId) => {
    try {
      const template = await templateService.getTemplateById(templateId);
      
      let editorContent = template.code || '';
      
      setFormData({
        name: template.name || '',
        desc: template.description || '',
        code: editorContent
      });

    } catch (err) {
      console.error('Erro ao carregar template:', err);
      setError('Erro ao carregar dados do template');
    }
  };

  const validateTemplate = (code) => {
    const requiredVariables = ['{{title}}', '{{body_text}}', '{{name}}', '{{link}}', '{{button_text}}'];
    const missingVariables = requiredVariables.filter(variable => !code.includes(variable));
    
    if (missingVariables.length > 0) {
      return `Template deve conter todas as variáveis: ${missingVariables.join(', ')}`;
    }
    return null;
  };

  const handleCreateTemplate = async () => {
    if (!formData.name.trim()) {
      setError('Nome do template é obrigatório');
      return;
    }

    if (!formData.code.trim()) {
      setError('Conteúdo do template é obrigatório');
      return;
    }

    const validationError = validateTemplate(formData.code);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (selectedTemplate) {
        await templateService.updateTemplate(selectedTemplate.id, {
          name: formData.name,
          description: formData.desc || '',
          code: formData.code
        });
        setSuccess('Template atualizado com sucesso!');
      } else {
        await templateService.createTemplate({
          name: formData.name,
          description: formData.desc || '',
          code: formData.code
        });
        setSuccess('Template criado com sucesso!');
      }

      setFormData({ name: '', desc: '', code: '' });
      setSelectedTemplate(null);
      setRefreshTrigger(prev => prev + 1);
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      console.error('Erro ao criar template:', err);
      setError(err.message || 'Erro ao criar template');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplateBase = () => {
    const baseTemplate = `
<div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #e50914; margin-bottom: 20px;">
  <h1 style="color: #e50914; margin: 0; font-size: 28px;">{{title}}</h1>
</div>

<div style="margin: 25px 0; color: #333;">
  <h2 style="color: #333; margin-bottom: 15px;">Olá {{name}},</h2>
  
  <div style="font-size: 16px; line-height: 1.6;">
    {{body_text}}
  </div>
  
  <div style="text-align: center; margin: 25px 0;">
    <a href="{{link}}" style="display: inline-block; background-color: #e50914; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">
      {{button_text}}
    </a>
  </div>
</div>

<div style="border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
  <p>Esta é uma mensagem automática, por favor não responda este email.</p>
</div>`;

    setFormData(prev => ({
      ...prev,
      code: baseTemplate.trim()
    }));
    setError('');
  };

  const generatePreview = (htmlContent) => {
    return htmlContent
      .replace(/{{title}}/g, previewVariables.title)
      .replace(/{{body_text}}/g, previewVariables.body_text)
      .replace(/{{name}}/g, previewVariables.name)
      .replace(/{{link}}/g, '#')
      .replace(/{{button_text}}/g, previewVariables.button_text);
  };

  const renderPreview = () => {
    if (!formData.code) {
      return (
        <div className="previewPlaceholder">
          O preview do template será exibido aqui quando você criar o conteúdo
        </div>
      );
    }

    const previewHtml = generatePreview(formData.code);

    return (
      <div 
        className="templatePreview"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    );
  };

  const editorValue = formData.code;

  return (
    <div className="mainContainer">
      <div className="hSidenav">
      </div>
      
      <div className="gCriarContainer">
        <div className="campanhaTitle">
          <h2>{selectedTemplate ? 'Editar Template' : 'Criar Template'}</h2>
          <button 
            className="btn-voltar-template"
            onClick={() => navigate('/templateGerencia')}
          >
            Voltar para Templates
          </button>
        </div>
        
        <div className="gSectionContainer">
          <div className="gCriarSection left">
            <div className="userList">
              <TemplateList 
                onTemplateSelect={handleTemplateSelect}
                selectedTemplateId={selectedTemplate?.id}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
          
          <div className="gCriarSection right">
            <div className="dadosGrupoSection">
              <h3>Dados do Template</h3>
              
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
                  <label>Nome do Template *</label>
                  <input 
                    type="text" 
                    placeholder="Digite o nome do template" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="formGroup">
                  <label>Descrição do Template</label>
                  <textarea 
                    placeholder="Digite a descrição do template" 
                    rows="3" 
                    value={formData.desc}
                    onChange={(e) => handleInputChange('desc', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="formGroup">
                  <div className="editorHeader">
                    <label>Conteúdo do Template *</label>
                    <button 
                      type="button" 
                      onClick={loadTemplateBase}
                      className="btnExemplo"
                    >
                      Template Base
                    </button>
                  </div>
                  <JoditEditor
                    ref={editor}
                    value={editorValue}
                    onBlur={newcontent => handleEditorChange(newcontent)}
                    config={config}
                  />
                </div>

                <div className="previewVariablesConfig">
                  <h4>Configurar Preview:</h4>
                  <div className="variablesInputs">
                    <div className="variableInput">
                      <label>Título:</label>
                      <input 
                        type="text" 
                        value={previewVariables.title}
                        onChange={(e) => handlePreviewVariableChange('title', e.target.value)}
                        placeholder="Título do email"
                      />
                    </div>
                    <div className="variableInput">
                      <label>Nome:</label>
                      <input 
                        type="text" 
                        value={previewVariables.name}
                        onChange={(e) => handlePreviewVariableChange('name', e.target.value)}
                        placeholder="Nome do usuário"
                      />
                    </div>
                    <div className="variableInput">
                      <label>Texto do Botão:</label>
                      <input 
                        type="text" 
                        value={previewVariables.button_text}
                        onChange={(e) => handlePreviewVariableChange('button_text', e.target.value)}
                        placeholder="Texto do botão"
                      />
                    </div>
                    <div className="variableInput full-width">
                      <label>Corpo do Email:</label>
                      <textarea 
                        value={previewVariables.body_text.replace(/<[^>]*>/g, '')}
                        onChange={(e) => handlePreviewVariableChange('body_text', `<p>${e.target.value}</p>`)}
                        placeholder="Conteúdo do email"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                <div className="variablesInfo">
                  <h4>Variáveis Disponíveis:</h4>
                  <div className="variablesGrid">
                    <div className="variableItem">
                      <code>{'{{title}}'}</code>
                      <span>Título do email</span>
                    </div>
                    <div className="variableItem">
                      <code>{'{{body_text}}'}</code>
                      <span>Corpo do email</span>
                    </div>
                    <div className="variableItem">
                      <code>{'{{name}}'}</code>
                      <span>Nome do usuário</span>
                    </div>
                    <div className="variableItem">
                      <code>{'{{link}}'}</code>
                      <span>Link do botão</span>
                    </div>
                    <div className="variableItem">
                      <code>{'{{button_text}}'}</code>
                      <span>Texto do botão</span>
                    </div>
                  </div>
                  <p className="variablesWarning">
                    <strong>Importante:</strong> Todas as variáveis devem estar presentes no template!
                  </p>
                </div>
              </div>
            </div>

            <div className="previewSection">
              <h3>Preview do Template</h3>
              
              <div className="previewContainer">
                {renderPreview()}
              </div>
            </div>

            <div className="formActions">
              <button 
                className="btnCancelar" 
                onClick={() => {
                  setFormData({ name: '', desc: '', code: '' });
                  setPreviewVariables({
                    title: 'Título do Email',
                    body_text: '<p>Este é o conteúdo principal do email que será personalizado para cada campanha.</p>',
                    name: 'Nome do Usuário',
                    button_text: 'Clique Aqui'
                  });
                  setError('');
                  setSuccess('');
                  setSelectedTemplate(null);
                }}
                disabled={loading}
              >
                Limpar
              </button>
              <button 
                className="btnCriar" 
                onClick={handleCreateTemplate}
                disabled={loading || !formData.name.trim() || !formData.code.trim()}
              >
                {loading ? (selectedTemplate ? 'Atualizando...' : 'Criando...') : (selectedTemplate ? 'Atualizar Template' : 'Criar Template')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateCriar;