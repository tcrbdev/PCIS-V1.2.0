import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withGoogleMap, GoogleMap, Marker, Circle, InfoWindow, OverlayView, Polyline, StreetViewPanorama, DirectionsRenderer, TrafficLayer, InfoBox } from "react-google-maps"
import { MAP } from 'react-google-maps/lib/constants';

import Icon_LB_Branch from '../../../../image/icon_full_branch.png'
import Icon_Full_Branch from '../../../../image/icon_lending_branch.png'
import Icon_Thailife_Branch from '../../../../image/icon_full_branch2.png'
import Icon_Nano_Branch from '../../../../image/icon_Nano.png'
import Icon_Kiosk_Branch from '../../../../image/icon_Keyos.png'
import Icon_Market from '../../../../image/icon_Market.png'
import Icon_Other from '../../../../image/map-marker.png'
import Icon_Current from '../../../../image/current_location.png'

const options = {
    center: { lat: 13.736717, lng: 100.523186 }
}

const handleBounds = (props, map) => {
    // if (map) {
    //     const { event: { E_Latitude, E_Longitude } } = props

    //     let bounds = new google.maps.LatLngBounds()

    //     let marker = new google.maps.Marker({
    //         position: { lat: parseFloat(E_Latitude), lng: parseFloat(E_Longitude) }
    //     })

    //     bounds.extend(marker.position)
    //     map.fitBounds(bounds)
    // }
}

const MiniMap = (props) => {
    const { event: { E_LocationType, E_Latitude, E_Longitude } } = props

    let icon = Icon_Other

    switch (E_LocationType) {
        case 'L':
            icon = Icon_LB_Branch
            break;
        case 'P':
            icon = Icon_Nano_Branch
            break;
        case 'K':
            icon = Icon_Kiosk_Branch
            break;
        case 'M':
            icon = Icon_Market
            break;
    }

    return (
        <GoogleMap
            ref={map => handleBounds(props, map)}
            defaultZoom={8}
            defaultCenter={{ lat: parseFloat(E_Latitude), lng: parseFloat(E_Longitude) }}
            disableDoubleClickZoom={true}>
            <Marker
                icon={{
                    url: icon
                }}
                position={{ lat: parseFloat(E_Latitude), lng: parseFloat(E_Longitude) }} />
        </GoogleMap>
    )

}

export default withGoogleMap(MiniMap)