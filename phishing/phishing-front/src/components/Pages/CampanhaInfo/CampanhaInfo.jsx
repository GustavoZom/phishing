import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CampanhaInfoCard from "./CampanhaInfoCard";
import Conversao from "./Conversao";
import UserList from "./UserList";
import { groupService } from '../../services/groupService';
import { campaignService } from '../../services/campaignService';
import { useNavigate } from 'react-router-dom';
import './campanhaInfo.css';

function CampanhaInfo(){
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            loadCampaignData();
        }
    }, [id]);

    const loadCampaignData = async () => {
        try {
            setLoading(true);
            const campaignData = await campaignService.getCampaignById(id);
            setCampaign(campaignData);
            
            // Carregar membros do grupo mesmo para campanhas inativas
            if (campaignData.group_id) {
                try {
                    const membersResponse = await groupService.getGroupMembers(campaignData.group_id);
                    setGroupMembers(membersResponse.items || []);
                } catch (err) {
                    console.error('Erro ao carregar membros do grupo:', err);
                }
            }
        } catch (err) {
            console.error('Erro ao carregar campanha:', err);
            setError('Erro ao carregar dados da campanha');
        } finally {
            setLoading(false);
        }
    };

    // Função para verificar se a campanha está inativa
    const isCampaignInactive = () => {
        return campaign && campaign.status === 'i';
    };

    if (loading) {
        return (
            <div className="mainContainer">
                <div className="cInfoContainer">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Carregando campanha...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div className="mainContainer">
                <div className="cInfoContainer">
                    <div className="error-message">
                        {error || 'Campanha nao encontrada'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mainContainer">
            <div className="hSidenav">
            </div>
            
            <div className="cInfoContainer">
                <div className="campanhaTitle">
                    <h2>Campanhas</h2>
                              <button 
                                className="btn-voltar-grupo"
                                onClick={() => navigate('/campanhaGerencia')}
                                >
                                Voltar para Campanhas
                                </button>
                </div>
                
                <div className="cSectionContainer">
                    <div className="cInfoSection left">
                        <div className="cardView">
                            <CampanhaInfoCard campaign={campaign} />
                        </div>

                        <div className="userList">
                            <UserList campaignId={id} groupMembers={groupMembers} />
                        </div>
                    </div>
                    
                    <div className="cInfoSection right">
                        {/* Mostrar Conversao apenas se a campanha NÃO estiver inativa */}
                        {!isCampaignInactive() && (
                            <Conversao campaignId={id} />
                        )}
                        
                        <div className="emailTemplate">
                            <h2>E-mail</h2>
                            <div className="sectionBox previewBox">
                                <h3>Previa do E-mail</h3>
                                <div className="emailPreview">
                                    <h2 style={{ color: "#e50914" }}>{campaign.title_text || "TITULO DO E-MAIL"}</h2>
                                    <h3>{campaign.subject_text || "Assunto do e-mail"}</h3>
                                    <p>
                                        {campaign.body_text || "Conteudo do e-mail sera exibido aqui..."}
                                    </p>
                                    <button className="btn-preview">
                                        {campaign.button_text || "CLIQUE AQUI"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CampanhaInfo;