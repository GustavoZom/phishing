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
    // Usar o template salvo diretamente (já vem com o wrapper)
    const previewHtml = template.code
      .replace(/{{title}}/g, 'Título do Email')
      .replace(/{{body_text}}/g, '<p>Este é o conteúdo do corpo do email que será enviado para o destinatário.</p>')
      .replace(/{{name}}/g, 'João Silva')
      .replace(/{{link}}/g, '#')
      .replace(/{{button_text}}/g, 'Clique Aqui');

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
      <div className="preview-info">
        <p><strong>Variáveis disponíveis:</strong> {'{{title}}'}, {'{{body_text}}'}, {'{{name}}'}, {'{{link}}'}, {'{{button_text}}'}</p>
      </div>
    </div>
  );
}

export default TemplatePreview;