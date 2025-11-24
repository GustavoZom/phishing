import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../../services/campaignService';
import './campaignList.css';

const STATUS_CONFIG = {
  'a': { text: 'Ativa', color: '#26BAB3', borderColor: '#26BAB3' },
  'f': { text: 'Finalizada', color: '#BA4D26', borderColor: '#BA4D26' },
  'i': { text: 'Inativa', color: '#666', borderColor: '#666' },
};

const DEFAULT_STATUS_CONFIG = {
  text: 'Desconhecido',
  color: '#666',
  borderColor: '#666'
};

const CampaignList = ({ onCampaignSelect, selectedCampaignId, refreshTrigger }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCampaignClick = useCallback((campaign) => {
    navigate(`/campanha/${campaign.id}`);

    if (onCampaignSelect) {
      onCampaignSelect(campaign);
    }
  }, [navigate, onCampaignSelect]);

  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Carregando campanhas...');
      const response = await campaignService.getCampaigns();

      const campaignsData = response.items || response;
      const safeCampaigns = Array.isArray(campaignsData) ? campaignsData : [];

      setCampaigns(safeCampaigns);
      console.log('Campanhas carregadas:', safeCampaigns.length);
    
    } catch (err) {
      console.error('Erro ao carregar campanhas:', err);
      setError(err?.message || 'Erro ao carregar campanhas');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns, refreshTrigger]);

  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || DEFAULT_STATUS_CONFIG;
    
    return (
      <span
        className="status-badge"
        style={{ 
          backgroundColor: config.borderColor,
          color: 'white',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          textAlign: 'center'
        }}
      >
        {config.text}
      </span>
    );
  };

  const renderCellContent = (content, fallback = 'N/A') => {
    return content || fallback;
  };

  const LoadingState = () => (
    <div className="campaignListContainer">
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Carregando campanhas...</p>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="empty-state">
      {error ? 'Erro ao carregar campanhas' : 'Nenhuma campanha encontrada'}
    </div>
  );

  const ErrorMessage = () => (
    error && (
      <div className="error-message">
        {error}
      </div>
    )
  );

  const ListHeader = () => (
    <div className="campaign-list-header">
      <span>Id</span>
      <span>Nome</span>
      <span>Grupo</span>
      <span>Template</span>
      <span>Status</span>
    </div>
  );

  const CampaignItem = ({ campaign }) => (
    <div
      key={campaign.id}
      className={`campaign-item ${selectedCampaignId === campaign.id ? 'selected' : ''}`}
      onClick={() => handleCampaignClick(campaign)}
    >
      <span className="campaign-id">{renderCellContent(campaign.id)}</span>
      <span className="campaign-name">{renderCellContent(campaign.name)}</span>
      <span className="campaign-group">{renderCellContent(campaign.group?.name)}</span>
      <span className="campaign-template">{renderCellContent(campaign.template?.name)}</span>
      {getStatusBadge(campaign.status)}
    </div>
  );

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="campaign-list-container">
      <ErrorMessage />
      <ListHeader />
      
      <div className="campaign-list">
        {campaigns.length === 0 ? (
          <EmptyState />
        ) : (
          campaigns.map((campaign) => (
            <CampaignItem key={campaign.id} campaign={campaign} />
          ))
        )}
      </div>
    </div>
  );
};

export default CampaignList;