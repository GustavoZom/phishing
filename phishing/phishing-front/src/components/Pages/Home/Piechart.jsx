// src/Modules/Home/Piechart.jsx
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function Piechart({ conversion = 0, total = 100, clicked = 0 }) {
    const clickedValue = clicked;
    const notClickedValue = total - clicked;
    
    const chartData = [
        { 
            id: 0, 
            value: clickedValue, 
            label: 'Clicados',
            color: '#26BAB3'
        },
        { 
            id: 1, 
            value: notClickedValue, 
            label: 'Nao Clicados',
            color: '#B8B8B8'
        },
    ].filter(item => item.value > 0);

    return (
        <PieChart
            series={[
                {
                    data: chartData,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                },
            ]}
            {...pieParams}
        />
    );
}

const pieParams = {
    height: 140,
    margin: { right: 5 },
    hideLegend: true,
};