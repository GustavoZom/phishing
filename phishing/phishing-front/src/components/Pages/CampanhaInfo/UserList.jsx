import React, { useState, useEffect } from 'react';
import { campaignService } from '../../services/campaignService';
import "./campanhaInfo.css";

function UserList({ campaignId }){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (campaignId) {
            loadCampaignUsers();
        }
    }, [campaignId]);

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
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch {
            return 'Data invalida';
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
                    <span>Data Click</span>
                </div>
                <div className="userListContainer">
                    <div className="loading-state">
                        Carregando usuarios...
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
                    <span>Data Click</span>
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
                <span>Data Click</span>
            </div>

            <div className="userListContainer">
                {users.length === 0 ? (
                    <div className="no-data">
                        Nenhum usuario encontrado para esta campanha
                    </div>
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="userListItem">
                            <span>{user.target?.id || 'N/A'}</span>
                            <span>{user.target?.name || 'N/A'}</span>
                            <span>{user.target?.email || 'N/A'}</span>
                            <span className={user.interacted ? 'clicked-yes' : 'clicked-no'}>
                                {user.interacted ? 'Sim' : 'Nao'}
                            </span>
                            <span>{user.interacted ? formatDate(user.interaction_date) : 'N/A'}</span>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default UserList;