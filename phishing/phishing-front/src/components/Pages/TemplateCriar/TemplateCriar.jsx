import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import TemplateList from '../../Modules/TemplateList/TemplateList';
import { templateService } from '../../services/templateService';
import './templateCriar.css';

function TemplateCriar() {
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleEditorChange = (content) => {
    handleInputChange('code', content);
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
      setError('Código HTML do template é obrigatório');
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

      await templateService.createTemplate({
        name: formData.name,
        desc: formData.desc || '',
        code: formData.code
      });

      setSuccess('Template criado com sucesso!');
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

  const loadTemplateExample = () => {
    const exampleTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f4f4f4; 
            line-height: 1.6;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
            text-align: center; 
            padding-bottom: 20px; 
            border-bottom: 2px solid #e50914; 
            margin-bottom: 20px;
        }
        .header h1 { 
            color: #e50914; 
            margin: 0; 
            font-size: 28px;
        }
        .content { 
            margin: 25px 0; 
            color: #333;
        }
        .content h2 {
            color: #e50914;
            margin-bottom: 15px;
        }
        .button { 
            display: inline-block; 
            background-color: #e50914; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 4px; 
            font-weight: bold;
            margin: 15px 0;
        }
        .footer { 
            border-top: 1px solid #ddd; 
            padding-top: 20px; 
            font-size: 12px; 
            color: #999; 
            text-align: center; 
            margin-top: 20px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 10px;
            border-radius: 4px;
            margin: 15px 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{title}}</h1>
        </div>
        <div class="content">
            <h2>Olá {{name}},</h2>
            <p>{{body}}</p>
            
            <div class="warning">
                <strong>Importante:</strong> Esta é uma mensagem importante que requer sua atenção.
            </div>
            
            <p>Para prosseguir, clique no botão abaixo:</p>
            <a href="{{link}}" class="button">Clique Aqui para Continuar</a>
            
            <p>Se você tiver qualquer dúvida, não hesite em entrar em contato conosco.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Sua Empresa. Todos os direitos reservados.</p>
            <p>Esta é uma mensagem automática, por favor não responda este email.</p>
        </div>
    </div>
</body>
</html>
    `.trim();

    setFormData(prev => ({
      ...prev,
      code: exampleTemplate
    }));
    setError('');
  };

  const renderPreview = () => {
    if (!formData.code) {
      return (
        <div className="preview-placeholder">
          O preview do template será exibido aqui quando você inserir o código HTML
        </div>
      );
    }

    const previewHtml = formData.code
      .replace(/{{title}}/g, 'Exemplo de Título')
      .replace(/{{body}}/g, 'Este é um exemplo do conteúdo do corpo do email. Aqui você pode incluir informações importantes para o destinatário.')
      .replace(/{{name}}/g, 'João Silva')
      .replace(/{{link}}/g, '#');

    return (
      <div 
        className="template-preview"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    );
  };

  return (
    <div className="mainContainer">
      <div className="gCriarContainer">
        <div className="campanhaTitle">
          <h2>Criar Template</h2>
          <button 
            className="btn-novo-grupo"
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
                <div className="error-message-form">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="success-message">
                  {success}
                </div>
              )}

              <div className="variables-info">
                <h4>Variáveis Disponíveis:</h4>
                <div className="variables-grid">
                  <div className="variable-item">
                    <code className="variable-code">{'{{title}}'}</code>
                    <span>Título do email</span>
                  </div>
                  <div className="variable-item">
                    <code className="variable-code">{'{{body}}'}</code>
                    <span>Corpo do email</span>
                  </div>
                  <div className="variable-item">
                    <code className="variable-code">{'{{name}}'}</code>
                    <span>Nome do destinatário</span>
                  </div>
                  <div className="variable-item">
                    <code className="variable-code">{'{{link}}'}</code>
                    <span>Link para clique</span>
                  </div>
                </div>
                <p className="variables-warning">
                  <strong>Importante:</strong> Todas as variáveis devem estar presentes no template!
                </p>
              </div>
              
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
                  <div className="editor-header">
                    <label>Código HTML *</label>
                    <button 
                      type="button" 
                      onClick={loadTemplateExample}
                      className="btn-exemplo"
                    >
                      Carregar Exemplo
                    </button>
                  </div>
                  
                  <Editor
                    apiKey='sua-api-key-do-tinymce'
                    value={formData.code}
                    onEditorChange={handleEditorChange}
                    init={{
                      height: 400,
                      menubar: true,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | code',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      placeholder: 'Digite o código HTML do template aqui...'
                    }}
                    disabled={loading}
                  />
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
                className="btn-cancelar" 
                onClick={handleClearForm}
                disabled={loading}
              >
                Limpar
              </button>
              <button 
                className="btn-criar" 
                onClick={handleCreateTemplate}
                disabled={loading || !formData.name.trim() || !formData.code.trim()}
              >
                {loading ? 'Criando...' : 'Criar Template'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateCriar;