import React, { useState, useEffect } from 'react';
import Piechart from "../Home/Piechart";
import { campaignService } from '../../services/campaignService';
import "./campanhaInfo.css";

function Conversao({ campaignId }) {
    const [stats, setStats] = useState({
        conversionRate: 0,
        totalClicks: 0,
        totalEmails: 0,
        loading: true
    });

    useEffect(() => {
        if (campaignId) {
            loadCampaignStats();
        }
    }, [campaignId]);

    const loadCampaignStats = async () => {
        try {
            setStats(prev => ({ ...prev, loading: true }));
            const campaignStats = await campaignService.getCampaignStats(campaignId);
            
            setStats({
                conversionRate: campaignStats.conversionRate,
                totalClicks: campaignStats.clickedEmails,
                totalEmails: campaignStats.totalEmails,
                loading: false
            });
        } catch (error) {
            console.error('Erro ao carregar estatisticas:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const formatPercentage = (value) => {
        return `${value}%`;
    };

    const formatClickCount = (clicks, total) => {
        return `${clicks}/${total}`;
    };

    return (
        <div className="conversaoContainer">
            <div className="conversaoSection left">
                <div className="conversaoTaxa">
                    <h2>Taxa de Conversao</h2>
                    <span>{stats.loading ? '...' : formatPercentage(stats.conversionRate)}</span>
                </div>
                <div className="convesaoMedia">
                    <h2>Total de Clicks</h2>
                    <span>{stats.loading ? '...' : formatClickCount(stats.totalClicks, stats.totalEmails)}</span>
                </div>
            </div>
            <div className="conversaoSection right">
                <div className="conversaoChart">
                    <Piechart 
                        width="160%" 
                        height="160%" 
                        conversion={stats.conversionRate} 
                        total={stats.totalEmails}
                        clicked={stats.totalClicks}
                    />
                </div>
            </div>
        </div>
    );
}

export default Conversao;