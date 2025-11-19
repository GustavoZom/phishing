import './templatesGerencia.css';

function TemplatePreview({ template }) {
  const renderTemplateContent = () => {
    if (!template || !template.code) {
      return (
        <div className="preview-empty">
          {template ? 'Template sem conteúdo HTML' : 'Selecione um template à esquerda para visualizar o preview'}
        </div>
      );
    }

    // Se o template já tiver estilos inline, usar diretamente
    if (template.code.includes('style=')) {
      const previewHtml = template.code
        .replace(/{{title}}/g, 'Título do Email')
        .replace(/{{body}}/g, '<p>Este é o conteúdo do corpo do email que será enviado para o destinatário.</p>')
        .replace(/{{name}}/g, 'João Silva')
        .replace(/{{link}}/g, '#')
        .replace(/{{button_text}}/g, 'Clique Aqui');

      return (
        <div className="template-preview-container">
          <div 
            className="template-preview-content"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      );
    }

    // Se não tiver estilos, aplicar os estilos globais
    const previewHtml = `
      <div class="template-container">
        <div class="template-content">
          <div class="template-header">
            <h1>${template.code.includes('{{title}}') ? 'Título do Email' : 'Seu Template'}</h1>
          </div>
          
          <div class="template-body">
            <h2>Olá ${template.code.includes('{{name}}') ? 'João Silva' : 'Cliente'},</h2>
            
            <div class="template-body-content">
              ${template.code.includes('{{body}}') ? '<p>Este é o conteúdo do corpo do email que será enviado para o destinatário.</p>' : template.code}
            </div>
            
            ${template.code.includes('{{link}}') ? `
            <div class="template-button-container">
              <a href="#" class="template-action-button">
                ${template.code.includes('{{button_text}}') ? 'Clique Aqui' : 'Acessar'}
              </a>
            </div>
            ` : ''}
          </div>
          
          <div class="template-footer">
            <p>Esta é uma mensagem automática, por favor não responda este email.</p>
          </div>
        </div>
      </div>
    `;

    return (
      <div className="template-preview-container">
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </div>
    );
  };

  return (
    <div className="gPreviewContainer">
      <h3>Preview do Template</h3>
      <div className="template-preview">
        {renderTemplateContent()}
      </div>
      <div className="preview-info">
        <p><strong>Variáveis disponíveis:</strong> {'{{title}}'}, {'{{body}}'}, {'{{name}}'}, {'{{link}}'}, {'{{button_text}}'}</p>
      </div>
    </div>
  );
}

export default TemplatePreview;