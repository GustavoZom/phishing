import React, { useState, useEffect } from 'react';
import { campaignService } from '../../services/campaignService';
import { groupService } from '../../services/groupService';
import "./campanhaInfo.css";

function UserList({ campaignId, groupMembers }){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (campaignId) {
            loadCampaignUsers();
        } else if (groupMembers && groupMembers.length > 0) {
            setUsers(groupMembers.map(member => ({
                id: member.id,
                target: member,
                interacted: false,
                interaction_date: null
            })));
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [campaignId, groupMembers]);

    const loadCampaignUsers = async () => {
        try {
            setLoading(true);
            const stats = await campaignService.getCampaignStats(campaignId);
            setUsers(stats.emails || []);
        } catch (err) {
            console.error('Erro ao carregar usuarios:', err);
            setError('Erro ao carregar lista de usuarios');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Data invalida';
        }
    };

    const handleDeleteMember = async (memberId) => {
        if (!window.confirm('Tem certeza que deseja excluir este membro?')) {
            return;
        }

        try {
            await groupService.deleteMember(memberId);
            // Recarregar a lista
            if (campaignId) {
                loadCampaignUsers();
            } else {
                setUsers(prev => prev.filter(user => user.target.id !== memberId));
            }
        } catch (error) {
            console.error('Erro ao excluir membro:', error);
            alert('Erro ao excluir membro: ' + error.message);
        }
    };

    const getStatusBadge = (interacted) => {
        if (interacted) {
            return (
                <span className="clicked-no" title="Usuario clicou no link">
                    Sim
                </span>
            );
        } else {
            return (
                <span className="clicked-yes" title="Usuario nao clicou no link">
                    Nao
                </span>
            );
        }
    };

    if (loading) {
        return (
            <>
                <div className="userListHeader">
                    <span>Id</span>
                    <span>Nome</span>
                    <span>E-mail</span>
                    <span>Clicou</span>
                    <span>Data do Click</span>
                </div>
                <div className="userListContainer">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Carregando usuarios...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className="userListHeader">
                    <span>Id</span>
                    <span>Nome</span>
                    <span>E-mail</span>
                    <span>Clicou</span>
                    <span>Data do Click</span>
                </div>
                <div className="userListContainer">
                    <div className="error-message">
                        {error}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="userListHeader">
                <span>Id</span>
                <span>Nome</span>
                <span>E-mail</span>
                <span>Clicou</span>
                <span>Data do Click</span>
            </div>

            <div className="userListContainer">
                {users.length === 0 ? (
                    <div className="no-data">
                        Nenhum email encontrado para esta campanha
                    </div>
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="userListItem">
                            <span>{user.target_id || 'N/A'}</span>
                            <span>{user.target?.name || 'N/A'}</span>
                            <span>{user.target?.email || 'N/A'}</span>
                            <span>{getStatusBadge(user.interacted)}</span>
                            <span>{user.interacted ? formatDate(user.interaction_date) : '-'}</span>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default UserList;