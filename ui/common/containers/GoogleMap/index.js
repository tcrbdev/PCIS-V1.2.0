import React, { Component } from 'react'
import { Icon, Button } from 'antd';

export default class GoogleMap extends Component {

    componentDidMount() {
        console.log(this.refs)
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
            <div ref="map" style={this.props.style}></div>
        )
    }
}