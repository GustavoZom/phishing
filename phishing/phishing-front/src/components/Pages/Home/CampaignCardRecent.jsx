import React, { useState, useEffect, useCallback } from 'react';
import { BsPeople, BsGrid1X2 } from 'react-icons/bs';
import { campaignService } from '../../services/campaignService';
import Piechart from './Piechart';

// Constantes para melhor manutenção
const STATUS_CONFIG = {
  'a': { text: 'Ativa', color: '#26BAB3' },
  'f': { text: 'Finalizada', color: '#BA4D26' },
  'i': { text: 'Inativa', color: '#666' }
};

const DEFAULT_STATUS_CONFIG = { text: 'Desconhecido', color: '#666' };

function CampaignCardRecent({ refreshTrigger }) {
    const [recentCampaign, setRecentCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    //Carregar campanha recente
    const loadRecentCampaign = useCallback(async () => {
        try {
            setLoading(true);
            const response = await campaignService.getCampaigns();
            const campaigns = response?.items || [];
            
            const mostRecent = campaigns.length > 0 
                ? campaigns.reduce((latest, current) => 
                    current.id > latest.id ? current : latest
                  )
                : null;
            
            setRecentCampaign(mostRecent);
        } catch (err) {
            console.error('Erro ao carregar campanha recente:', err);
            setRecentCampaign(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRecentCampaign();
    }, [loadRecentCampaign, refreshTrigger]);

    const renderContent = (content, fallback = 'N/A') => {
        return content || fallback;
    };

    //Obter configuração de status
    const getStatusConfig = (status) => {
        return STATUS_CONFIG[status] || DEFAULT_STATUS_CONFIG;
    };

    //Lidar com Loading
    const LoadingState = () => (
        <div className="campaignLast">
            <h2>Última Campanha Criada</h2>
            <div className="cCardInfo">
                <div className="loading-card">Carregando...</div>
            </div>
        </div>
    );

    //Lidar com Empty
    const EmptyState = () => (
        <div className="campaignLast">
            <h2>Última Campanha Criada</h2>
            <div className="cCardInfo">
                <div className="no-data">Nenhuma campanha encontrada</div>
            </div>
        </div>
    );

    //Seção superior
    const CampaignUpperSection = ({ campaign }) => {
        const statusConfig = getStatusConfig(campaign.status);
        
        return (
            <div className="cLastSectionUpper">
                <div className="cLastSection left">
                    <div className="cLastGroup">
                        <BsPeople />
                        <span>{renderContent(campaign.group?.name)}</span>
                    </div>
        
                    <div className="cLastTemplate">
                        <BsGrid1X2 />
                        <span>{renderContent(campaign.template?.name)}</span>
                    </div>
                </div>
        
                <div className="cLastSection right">
                    <Piechart />
                </div>
            </div>
        );
    };

    //Seção inferior
    const CampaignBottomSection = ({ campaign }) => {
        const statusConfig = getStatusConfig(campaign.status);
        
        return (
            <div className="cLastSectionBottom">
                <div className="cLastSection left">
                    <span className="cLastDeadline">
                        Status:
                    </span>
                    <span 
                        className='cardCounter' 
                        style={{ color: statusConfig.color }}
                    >
                        {statusConfig.text}
                    </span>
                </div>
    
                <div className="cLastSection right">
                    <span className="cLastConversion">
                        ID:
                    </span>
                    <span className='cardCounter'>
                        {renderContent(campaign.id)}
                    </span>
                </div>
            </div>
        );
    };

    //Seção Principal
    const CampaignContent = ({ campaign }) => (
        <div className="campaignLast">
            <h2>Última Campanha Criada</h2>
        
            <div className="cCardInfo">
                <h3>{renderContent(campaign.name)}</h3>
        
                <div className="cLastSection">
                    <CampaignUpperSection campaign={campaign} />
                    <CampaignBottomSection campaign={campaign} />
                </div>
            </div>
        </div>
    );

    // Renderização condicional
    if (loading) {
        return <LoadingState />;
    }

    if (!recentCampaign) {
        return <EmptyState />;
    }

    return <CampaignContent campaign={recentCampaign} />;
}

export default CampaignCardRecent;