import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CampanhaInfoCard from "./CampanhaInfoCard";
import Conversao from "./Conversao";
import UserList from "./UserList";
import { groupService } from '../../services/groupService';
import { campaignService } from '../../services/campaignService';
import { templateService } from '../../services/templateService';
import { useNavigate } from 'react-router-dom';
import './campanhaInfo.css';

function CampanhaInfo(){
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [template, setTemplate] = useState(null);
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
            
            if (campaignData.template_id) {
                try {
                    const templateData = await templateService.getTemplateById(campaignData.template_id);
                    setTemplate(templateData);
                } catch (err) {
                    console.error('Erro ao carregar template:', err);
                }
            }
            
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

    const isCampaignInactive = () => {
        return campaign && campaign.status === 'i';
    };

    const renderEmailPreview = () => {
        if (!template?.code) {
            return (
                <div className="previewPlaceholder">
                    Template não encontrado
                </div>
            );
        }

        const previewHtml = template.code
            .replace(/{{title}}/g, campaign.title_text || 'Título do Email')
            .replace(/{{body_text}}/g, campaign.body_text || 'Conteúdo do email...')
            .replace(/{{name}}/g, 'Nome do Usuário')
            .replace(/{{link}}/g, '#')
            .replace(/{{button_text}}/g, campaign.button_text || 'Clique Aqui');

        return (
            <div 
                className="emailPreviewContent"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
        );
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
                        {error || 'Campanha não encontrada'}
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
                        {!isCampaignInactive() && (
                            <Conversao campaignId={id} />
                        )}
                        
                        <div className="emailTemplate">
                            <h2>E-mail</h2>
                            <div className="sectionBox previewBox">
                                <h3>Prévia do E-mail</h3>
                                <div className="emailPreview">
                                    {renderEmailPreview()}
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