import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';

const data = {

    labels: ['30D+', '60D+', '90D+', '120D+'],
    datasets: [{}]
}

data.datasets[0] = {
    label: "App Onhand",
    data: [10, 8, 10, 4, 5],
    backgroundColor: "rgba(242, 104, 104, .8)"
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
                beginAtZero: true,
                min: 0,
                max: data.datasets[0].data.reduce((a, b) => { return Math.max(a, b) }) + 10
            }
        }]
    }
}

class CampaignAging extends Component {

    render() {
        return (
            <Bar data={data} options={option} width={100} height={50} />
        )
    }

}

export default CampaignAging