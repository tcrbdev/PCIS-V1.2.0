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

class LocationMap extends Component {

    state = {
        locationMode: 'google',
        locationDetail: {
            type: 'map',
            code: '',
            text: null,
            lat: options.center.lat,
            lng: options.center.lng
        },
        defaultCenter: options
    }

    componentWillReceiveProps(nextProps) {
        this.setInitFormProps(nextProps)
    }

    componentWillMount() {
        this.setInitFormProps(this.props)
    }

    setInitFormProps(props) {
        const { locationMode, locationDetail } = props

        if (locationDetail.lat) {
            this.setState({
                locationMode,
                locationDetail,
                defaultCenter: {
                    center: {
                        lat: locationDetail.lat,
                        lng: locationDetail.lng
                    }
                }
            })
        }
    }

    handleBounds = (props, map) => {
        const mapInstance = map && map.context[MAP]

        if (mapInstance) {
            setTimeout(() => { google.maps.event.trigger(mapInstance, "resize") }, 200)
        }
    }

    onMapClick = (event) => {
        const { onClick } = this.props

        let geocoder = new google.maps.Geocoder()

        var lat = parseFloat(event.latLng.lat())
        var lng = parseFloat(event.latLng.lng())
        var latlng = new google.maps.LatLng(lat, lng)

        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                const locationMode = 'google'
                const locationDetail = {
                    type: 'map',
                    code: '',
                    text: results[0].formatted_address,
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                }
                onClick(locationDetail)
            }
        }.bind(this))
    }

    render() {
        let icon = Icon_Other
        const { disabled } = this.props

        switch (this.state.locationDetail.type) {
            case '':
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
                ref={map => this.handleBounds(this.props, map)}
                defaultZoom={13}
                {...this.state.defaultCenter}
                disableDoubleClickZoom={true}
                onClick={(event) => {
                    if (!disabled)
                        this.onMapClick(event)
                }}>
                <Marker
                    icon={{
                        url: icon
                    }}
                    position={{ ...this.state.locationDetail }} />
            </GoogleMap>
        )
    }
}

export default withGoogleMap(LocationMap)