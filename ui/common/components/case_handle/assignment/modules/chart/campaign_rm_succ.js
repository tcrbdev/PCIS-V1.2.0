import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';

const data = {

    labels: ['Buppachat', 'Walaiporn', 'Chayapon'],
    datasets: [
         {
            label: "App Onhand",
            data: [10, 8, 10],
            backgroundColor: "rgba(0, 0, 0, .2)"
        }, 
        {
            label: "SUCC",
            data: [5, 2, 7],
            backgroundColor: 'rgba(107,186,112, 1)'
        }    
    ]
}

const option = {
    legend: { display: false },
    scales: {
        xAxes: [{
            stacked: true,
            gridLines: { display: true }
        }],
        yAxes: [{
            stacked: false,
            gridLines: { display: true },
            ticks: {
                display: true,
                beginAtZero: true
            }
        }]
    }
}

class CampaignRMSuccess extends Component {

    render() {
        return (
            <Bar data={data} options={option} width={100} height={50} />
        )
    }

}

export default CampaignRMSuccess