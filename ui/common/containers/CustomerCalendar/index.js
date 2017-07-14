import React, { Component } from 'react'

import { Calendar, Button, Modal, Icon } from 'antd';
import moment from 'moment'

class CustomerCalendar extends Component {
    state = {
        modal: false,
        selectDate: new Date()
    }

    addEventCalendar = (date) => {
        this.setState({ modal: !this.state.modal, selectDate: date })
    }

    closeModal = () => {
        this.setState({ modal: !this.state.modal })
    }

    componentDidMount() {
        console.log("Did Mount : ", this.refs)
        this.initMap()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.modal)
            this.initMap()
    }

    initMap = () => {
        var uluru = { lat: -25.363, lng: 131.044 };
        var map = new google.maps.Map(this.refs.map, {
            zoom: 4,
            center: uluru
        });
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });
    }

    render() {
        return (
            <div>
                <Calendar onSelect={this.addEventCalendar} />
                <Modal visible={this.state.modal} onCancel={this.closeModal} style={{ minWidth: '50%' }} >
                    <div ref="map" id="map" style={{ width: '100%', height: '400px' }}></div>
                </Modal>
            </div>
        )
    }
}

export default CustomerCalendar
