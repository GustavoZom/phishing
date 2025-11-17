import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CampaignListInfo from "../../Modules/CampaignListInfo/CampaignListInfo";
import { groupService } from '../../services/groupService';
import { templateService } from '../../services/templateService';
import './campanhaGerencia.css';

function CampanhaGerencia() {
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        group_id: '',
        template_id: '',
        start_date: '',
        end_date: '',
        send_time: '',
        status: ''
    });
    const [groups, setGroups] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    React.useEffect(() => {
        loadGroups();
        loadTemplates();
    }, []);

    const loadGroups = async () => {
        try {
            const response = await groupService.getGroups();
            setGroups(response.items || []);
        } catch (err) {
            console.error('Erro ao carregar grupos:', err);
        }
    };

    const loadTemplates = async () => {
        try {
            const response = await templateService.getTemplates();
            setTemplates(response.items || []);
        } catch (err) {
            console.error('Erro ao carregar templates:', err);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleClearFilters = () => {
        setFilters({
            id: '',
            name: '',
            group_id: '',
            template_id: '',
            start_date: '',
            end_date: '',
            send_time: '',
            status: ''
        });
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="mainContainer">
            <div className="cFilterContent">
                <div className="campanhaTitle">
                    <h2>Campanhas</h2>
                    <Link to="/campanhaCriar">
                        <span>Nova Campanha</span>
                    </Link>
                </div>

                <div className="cFilterContainer">
                    <div className="cFilterColumn">
                        <input 
                            type="text" 
                            placeholder="Id" 
                            value={filters.id}
                            onChange={(e) => handleFilterChange('id', e.target.value)}
                        />
                        <input 
                            type="date" 
                            placeholder="Data Disparo"
                            value={filters.start_date}
                            onChange={(e) => handleFilterChange('start_date', e.target.value)}
                        />
                    </div>

                    <div className="cFilterColumn">
                        <input 
                            type="text" 
                            placeholder="Nome" 
                            value={filters.name}
                            onChange={(e) => handleFilterChange('name', e.target.value)}
                        />
                        <input 
                            type="time" 
                            placeholder="Hora Disparo"
                            value={filters.send_time}
                            onChange={(e) => handleFilterChange('send_time', e.target.value)}
                        />
                    </div>

                    <div className="cFilterColumn">
                        <select
                            value={filters.group_id}
                            onChange={(e) => handleFilterChange('group_id', e.target.value)}
                        >
                            <option value="">Grupo</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                        <input 
                            type="date" 
                            placeholder="Data Fim"
                            value={filters.end_date}
                            onChange={(e) => handleFilterChange('end_date', e.target.value)}
                        />
                    </div>

                    <div className="cFilterColumn">
                        <select
                            value={filters.template_id}
                            onChange={(e) => handleFilterChange('template_id', e.target.value)}
                        >
                            <option value="">Template</option>
                            {templates.map(template => (
                                <option key={template.id} value={template.id}>
                                    {template.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="">Status</option>
                            <option value="a">Ativo</option>
                            <option value="i">Inativo</option>
                            <option value="f">Finalizado</option>
                        </select>
                    </div>

                    <div className="cFilterButtons">
                        <button className="btn-search" onClick={handleSearch}>
                            Pesquisar
                        </button>
                        <button className="btn-clear" onClick={handleClearFilters}>
                            Limpar Filtros
                        </button>
                    </div>
                </div>

                <div className="campaign">
                    <CampaignListInfo filters={filters} refreshTrigger={refreshTrigger}/>
                </div>
            </div>
        </div>
    );
}

export default CampanhaGerencia;