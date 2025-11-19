import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateList from '../../Modules/TemplateList/TemplateList';
import { templateService } from '../../services/templateService';
import './templateCriar.css';

function TemplateCriar() {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  
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
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorMode, setEditorMode] = useState('code'); // 'code' ou 'visual'

  // Carregar o script do TinyMCE
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js';
    script.referrerPolicy = 'origin';
    script.onload = () => {
      if (window.tinymce) {
        window.tinymce.init({
          selector: '#template-editor',
          height: 500,
          menubar: 'edit view insert format tools',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'code'
          ],
          toolbar: 'undo redo | blocks | bold italic underline strikethrough | fontfamily fontsize | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code | preview | help',
          content_style: `
            body { 
              font-family: Arial, sans-serif; 
              font-size: 14px; 
              line-height: 1.6;
              margin: 0;
              padding: 10px;
            }
            .mce-content-body {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 20px;
              border-radius: 8px;
            }
          `,
          branding: false,
          promotion: false,
          setup: (editor) => {
            editorRef.current = editor;
            editor.on('init', () => {
              setEditorLoaded(true);
              if (formData.code) {
                editor.setContent(formData.code);
              }
            });
            editor.on('change', () => {
              handleInputChange('code', editor.getContent());
            });
          }
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (window.tinymce && editorRef.current) {
        window.tinymce.remove(editorRef.current);
      }
    };
  }, []);

  // Atualizar conteúdo do editor quando formData.code mudar
  useEffect(() => {
    if (editorRef.current && editorLoaded && formData.code && editorMode === 'visual') {
      editorRef.current.setContent(formData.code);
    }
  }, [formData.code, editorLoaded, editorMode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
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
      setFormData({
        name: template.name || '',
        desc: template.description || '',
        code: template.code || ''
      });
    } catch (err) {
      console.error('Erro ao carregar template:', err);
      setError('Erro ao carregar dados do template');
    }
  };

  const validateTemplate = (code) => {
    const requiredVariables = ['{{title}}', '{{body}}', '{{name}}', '{{link}}'];
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
        // Atualizar template existente
        await templateService.updateTemplate(selectedTemplate.id, {
          name: formData.name,
          description: formData.desc || '',
          code: formData.code
        });
        setSuccess('Template atualizado com sucesso!');
      } else {
        // Criar novo template
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

  const handleClearForm = () => {
    setFormData({ name: '', desc: '', code: '' });
    setError('');
    setSuccess('');
    setSelectedTemplate(null);
  };

  const loadTemplateBase = () => {
    const baseTemplate = `
  <div class="template-container">
    <div class="template-content">
      <div class="template-header">
        <h1>{{title}}</h1>
      </div>
      
      <div class="template-body">
        <h2>Olá {{name}},</h2>
        
        <div class="template-body-content">
          {{body}}
        </div>
        
        <div class="template-button-container">
          <a href="{{link}}" class="template-action-button">
            {{button_text}}
          </a>
        </div>
      </div>
      
      <div class="template-footer">
        <p>Esta é uma mensagem automática, por favor não responda este email.</p>
        <p>&copy; 2024 Sua Empresa. Todos os direitos reservados.</p>
      </div>
    </div>
  </div>`;

    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        code: baseTemplate.trim()
      }));
      setError('');
    }, 0);
  };

  const renderPreview = () => {
    if (!formData.code) {
      return (
        <div className="previewPlaceholder">
          O preview do template será exibido aqui quando você criar o conteúdo
        </div>
      );
    }

    const previewHtml = formData.code
      .replace(/{{title}}/g, 'Título do Email')
      .replace(/{{body}}/g, '<p>Este é o conteúdo principal do email que será personalizado para cada campanha.</p>')
      .replace(/{{name}}/g, 'Nome do Usuário')
      .replace(/{{link}}/g, '#')
      .replace(/{{button_text}}/g, 'Clique Aqui');

    return (
      <div 
        className="templatePreview"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    );
  };

  const toggleEditorMode = () => {
    setEditorMode(prev => {
      const newMode = prev === 'code' ? 'visual' : 'code';
      
      // Sincronizar conteúdo entre os modos
      if (newMode === 'visual' && editorRef.current && editorLoaded) {
        editorRef.current.setContent(formData.code);
      } else if (newMode === 'code' && editorRef.current && editorLoaded) {
        const visualContent = editorRef.current.getContent();
        setFormData(prev => ({ ...prev, code: visualContent }));
      }
      
      return newMode;
    });
  };

  return (
    <div className="mainContainer">
      <div className="gCriarContainer">
        <div className="campanhaTitle">
          <h2>{selectedTemplate ? 'Editar Template' : 'Criar Template'}</h2>
          <button 
            className="btnNovoGrupo"
            onClick={() => navigate('/templates')}
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
                <div className="errorMessageForm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="successMessage">
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
                    <div className="editorControls">
                      <button 
                        type="button" 
                        onClick={loadTemplateBase}
                        className="btnExemplo"
                      >
                        Template Base
                      </button>
                      <button 
                        type="button" 
                        onClick={toggleEditorMode}
                        className="btnToggleMode"
                      >
                        {editorMode === 'code' ? '🔧 Modo Visual' : '📝 Modo Código'}
                      </button>
                    </div>
                  </div>
                  
                  {editorMode === 'code' ? (
                    <textarea 
                      className="codeEditor"
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      placeholder="Digite o código HTML do template aqui..."
                      rows="20"
                      disabled={loading}
                    />
                  ) : (
                    <>
                      <textarea 
                        id="template-editor"
                        style={{ display: 'none' }}
                      />
                      
                      {!editorLoaded && (
                        <div className="editorLoading">
                          <p>Carregando editor visual...</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="variablesInfo">
                  <h4>Variáveis Disponíveis:</h4>
                  <div className="variablesGrid">
                    <div className="variableItem">
                      <code>{'{{title}}'}</code>
                      <span>Título do email</span>
                    </div>
                    <div className="variableItem">
                      <code>{'{{body}}'}</code>
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
                onClick={handleClearForm}
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