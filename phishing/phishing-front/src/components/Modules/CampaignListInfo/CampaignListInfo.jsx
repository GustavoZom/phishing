// src/Modules/CampaignListInfo/CampaignListInfo.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../../services/campaignService';
import './campaignListInfo.css';

function CampaignListInfo({ filters, refreshTrigger }) {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCampaignClick = (campaign) => {
        navigate(`/campanha/${campaign.id}`);
    };

    useEffect(() => {
        loadCampaigns();
    }, [filters, refreshTrigger]);

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            setError('');
            
            console.log('Carregando campanhas com filtros:', filters);
            const response = await campaignService.getCampaigns(filters);
            
            const campaignsData = response.items || response;
            setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
            
        } catch (err) {
            console.error('Erro ao carregar campanhas:', err);
            setError(err.message);
            setCampaigns([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        return timeString.substring(0, 5);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'a': { text: 'Ativo', color: '#26BAB3', borderColor: '#26BAB3' },
            'i': { text: 'Inativo', color: '#B8B8B8', borderColor: '#B8B8B8' },
            'f': { text: 'Finalizado', color: '#BA4D26', borderColor: '#BA4D26' }
        };
        
        const config = statusConfig[status] || { text: 'Desconhecido', color: '#666', borderColor: '#666' };
        
        return (
            <span 
                style={{ 
                    border: `1px solid ${config.borderColor}`,
                    color: config.color,
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    justifySelf: 'start',
                    whiteSpace: 'nowrap',
                    width: '80px'
                }}
            >
                {config.text}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Carregando campanhas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                {error}
            </div>
        );
    }

    return (
        <>
            <div className="cGerenciaHeader">
                <span>Id</span>
                <span>Nome</span>
                <span>Grupo</span>
                <span>Template</span>
                <span>Data Disparo</span>
                <span>Hora Disparo</span>
                <span>Data Fim</span>
                <span>Status</span>
            </div>

            <div className="cGerenciaList">
                {campaigns.length === 0 ? (
                    <div className="empty-state">
                        Nenhuma campanha encontrada
                    </div>
                ) : (
                    campaigns.map((campaign) => (
                        <div 
                            key={campaign.id} 
                            className="cGerenciaCard"
                            onClick={() => handleCampaignClick(campaign)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span>{campaign.id}</span>
                            <span>{campaign.name}</span>
                            <span>{campaign.group?.name || 'N/A'}</span>
                            <span>{campaign.template?.name || 'N/A'}</span>
                            <span>{formatDate(campaign.start_date)}</span>
                            <span>{formatTime(campaign.send_time)}</span>
                            <span>{formatDate(campaign.end_date)}</span>
                            {getStatusBadge(campaign.status)}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default CampaignListInfo;