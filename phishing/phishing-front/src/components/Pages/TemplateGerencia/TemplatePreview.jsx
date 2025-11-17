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

    // Substitui as variáveis por valores de exemplo para preview
    const previewHtml = template.code
      .replace(/{{title}}/g, 'Título do Email')
      .replace(/{{body}}/g, 'Este é o conteúdo do corpo do email que será enviado para o destinatário.')
      .replace(/{{name}}/g, 'João Silva')
      .replace(/{{link}}/g, '#');

    return (
      <div 
        className="template-preview-content"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    );
  };

  return (
    <div className="gPreviewContainer">
      <h3>Preview do Template</h3>
      <div className="template-preview">
        {renderTemplateContent()}
      </div>
      <div className="preview-info" style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p><strong>Variáveis disponíveis:</strong> {{title}}, {{body}}, {{name}}, {{link}}</p>
      </div>
    </div>
  );
}

export default TemplatePreview;