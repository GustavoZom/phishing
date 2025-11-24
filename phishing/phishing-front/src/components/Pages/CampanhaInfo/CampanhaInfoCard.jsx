// src/Pages/CampanhaInfo/CampanhaInfoCard.js
import { BsGrid1X2, BsPeople, BsCalendar3Week, BsClock} from "react-icons/bs";
import "./campanhaInfo.css";

function CampanhaInfoCard({ campaign }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        return timeString.substring(0, 5);
    };

    const getDaysUntilDeadline = () => {
        if (!campaign.end_date) return 'N/A';
        const today = new Date();
        const end = new Date(campaign.end_date);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? `${diffDays} dias` : 'Expirado';
    };

    const getStatusText = (status) => {
        const statusMap = {
            'a': 'Ativa',
            'i': 'Anativa', 
            'f': 'Finalizada'
        };
        return statusMap[status] || 'Status desconhecido';
    };

    const getStatusColor = (status) => {
        const colorMap = {
            'a': '#26BAB3',
            'i': '#B8B8B8',
            'f': '#BA4D26'
        };
        return colorMap[status] || '#666';
    };

    return (
        <div className="cardCampanha">
        <div className="cardTitle">
            <div className="cardName">
            <span className="cardId">Id: {campaign.id}</span>
            <h3>{campaign.name}</h3>
            </div>
            <span 
                className="cardStatus"
                style={{ 
                    borderColor: getStatusColor(campaign.status),
                    color: getStatusColor(campaign.status)
                }}
            >
                {getStatusText(campaign.status)}
            </span>
        </div>

        <div className="cardGrid">
            <div className="cardColumn">
            <div className="cardItem">
                <BsPeople className="iconInfo" />
                <span>{campaign.group?.name || 'N/A'}</span>
            </div>
            <div className="cardItem">
                <BsGrid1X2 className="iconInfo" />
                <span>{campaign.template?.name || 'N/A'}</span>
            </div>
            </div>

            <div className="cardColumn">
            <div className="cardItem">
                <BsCalendar3Week className="iconInfo" />
                <span>{formatDate(campaign.start_date)}</span>
            </div>
            <div className="cardItem">
                <BsClock className="iconInfo" />
                <span>{formatTime(campaign.send_time)}</span>
            </div>
            </div>

            <div className="cardColumn end">
            <span className="finalizaLabel">Finaliza em:</span>
            <span className="finalizaTempo">{getDaysUntilDeadline()}</span>
            </div>
        </div>
        </div>
    );
}

export default CampanhaInfoCard;