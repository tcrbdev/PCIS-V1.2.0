import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';

const data = {

    labels: ['DOCTOR', 'H4C', '7-11', 'HOTEL'],
    datasets: [
        {
            label: "SUCC",
            data: [5, 1, 7, 2],
            backgroundColor: 'rgba(107,186,112, 1)'
        },
        {
            label: "Assign Completed",
            data: [10, 8, 10, 4],
            backgroundColor: "rgba(0, 0, 0, .2)"
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
            gridLines: { display: true }
        }]
    }
}

class CampaignBMSuccess extends Component {

    render() {
        return (
            <Bar data={data} options={option} width={100} height={50} />
        )
    }

}

export default CampaignBMSuccess