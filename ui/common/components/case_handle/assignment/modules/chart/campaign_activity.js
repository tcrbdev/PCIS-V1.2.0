import React, { Component, PropTypes } from 'react'
import { Pie } from 'react-chartjs-2'

const data = {
    labels: [
        'DOCTOR',
        'H4C',
        '7-11',
        'HOTEL'
    ],
    datasets: [        
        {
            data: [300, 50, 100, 105],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ]
        }
    ]
};

const options={
    legend: {
        display: false
    }
};

class CampaignActivity extends Component {

    PropTypes = {
        modalOpen: PropTypes.bool.isRequired
    }

    render() {

        const { modalOpen } = this.props

        return (<Pie data={data} options={options} />);
    }
}

export default CampaignActivity