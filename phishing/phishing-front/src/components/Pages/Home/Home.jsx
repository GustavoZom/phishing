import React, { useState, useEffect, useCallback } from 'react';
import { BsFileEarmarkPlay, BsFileEarmarkRuled, BsFileEarmarkCheck } from 'react-icons/bs';
import CampaignCardDeadline from './CampaignCardDeadline';
import CampaignCardRecent from './CampaignCardRecent';
import CampaignList from '../../Modules/CampaignList/CampaignList';
import { campaignService } from '../../services/campaignService';
import './home.css';

const STATS_CONFIG = {
    active: {
        icon: BsFileEarmarkPlay,
        backgroundColor: "#B6DDF0",
        label: "Campanhas Ativas"
    },
    total: {
        icon: BsFileEarmarkRuled,
        backgroundColor: "#F0E4B6",
        label: "Total de Campanhas"
    },
    finished: {
        icon: BsFileEarmarkCheck,
        backgroundColor: "#F0B6C8",
        label: "Campanhas Finalizadas"
    }
};

const INITIAL_STATS = {
    active: 0,
    total: 0,
    finished: 0
};

function Home() {
    const [campaignStats, setCampaignStats] = useState(INITIAL_STATS);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const loadCampaignStats = useCallback(async () => {
        try {
            setLoading(true);
            const response = await campaignService.getCampaigns();
            const campaigns = response.items || [];
            
            const activeCampaigns = campaigns.filter(camp => camp.status === 'active').length;
            const finishedCampaigns = campaigns.filter(camp => camp.status === 'finished').length;
            const totalCampaigns = campaigns.length;
            
            setCampaignStats({
                active: activeCampaigns,
                total: totalCampaigns,
                finished: finishedCampaigns
            });
            
        } catch (err) {
            console.error('Erro ao carregar estatísticas:', err);
            setCampaignStats(INITIAL_STATS);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCampaignStats();
    }, [loadCampaignStats, refreshTrigger]);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const StatItem = ({ type, value }) => {
        const config = STATS_CONFIG[type];
        const IconComponent = config.icon;
    
        return(
            <div className="cItem">
                <div className='campanhaIcon' style={{ backgroundColor: config.backgroundColor }}> 
                    <IconComponent/>
                </div>
                <h4>{config.label}</h4>
                <h3>{loading ? '...' : value}</h3>
            </div>
        );
    };

    const GeneralViewSection = () => (
        <div className="generalView">
            <h2>Visão Geral</h2>
            <div className="campanhaInfo">
                <StatItem type="active" value={campaignStats.active}/>
                <StatItem type="total" value={campaignStats.total}/>
                <StatItem type="finished" value={campaignStats.finished}/>
            </div>
        </div>
    );

    const CampaignHeader = () => (
        <div className="campaignHeader">
            <h2>Campanhas</h2>
            <button
                className="btnRefresh"
                onClick={handleRefresh}
                disabled={loading}
            >
                {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
        </div>
    );

    return (
        <div className="mainContainer">
            <div className="hSidenav">
            </div>

            <div className="hContent">
                <div className="hSectionLeft">
                    <GeneralViewSection/>

                    <div className="campaign">
                        <CampaignHeader/>
                        <CampaignList refreshTrigger={refreshTrigger}/>
                    </div>
                </div>
                
                <div className="hSectionRight">
                    <div className="cardContainer">
                        <CampaignCardRecent refreshTrigger={refreshTrigger}/>
                        <CampaignCardDeadline refreshTrigger={refreshTrigger}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;