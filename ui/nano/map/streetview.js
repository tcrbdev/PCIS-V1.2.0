import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withGoogleMap, GoogleMap, Marker, StreetViewPanorama } from "react-google-maps"
import { MAP } from 'react-google-maps/lib/constants';
import icon_Market from '../../../image/icon_Market.png'

class StreetMap extends Component {

    handleBounds = (props, map) => {
        if (map) {
            const { item } = this.props

            const mapInstance = map && map.context[MAP];
            setTimeout(() => { google.maps.event.trigger(mapInstance, "resize") }, 200)
        }
    }

    render() {
        const { item } = this.props
        return (
            <GoogleMap
                defaultZoom={18}
                defaultCenter={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                ref={(map) => (this.handleBounds(this.props, map))}
            >
                <Marker
                    title={item.BranchName}
                    position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                    icon={{ url: icon_Market }} />
                <StreetViewPanorama
                    defaultPosition={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                    visible
                />
            </GoogleMap>
        )
    }
}

const wrapStreetMap = withGoogleMap(StreetMap)

export default wrapStreetMap

// export default SimpleMapExampleGoogleMap

// export default connect(
//     (state) => ({
//         NANO_FILTER_CRITERIA: state.NANO_FILTER_CRITERIA,
//         SELECTED_CA_MAP: state.SELECTED_CA_MAP,
//         DO_BOUNDS_MAP: state.DO_BOUNDS_MAP,
//         RELATED_BRANCH_DATA: state.RELATED_BRANCH_DATA,
//         RELATED_EXITING_MARKET_DATA: state.RELATED_EXITING_MARKET_DATA,
//         RELATED_TARGET_MARKET_DATA: state.RELATED_TARGET_MARKET_DATA,
//         RELATED_COMPLITITOR_DATA: state.RELATED_COMPLITITOR_DATA,
//         RELATED_CA_IN_MARKET_DATA: state.RELATED_CA_IN_MARKET_DATA
//     }), {
//         setOpenBranchMarker: setOpenBranchMarker,
//         setOpenBranchMarkerMenu: setOpenBranchMarkerMenu,
//         setOpenExitingMarketMarker: setOpenExitingMarketMarker,
//         setOpenExitingMarketMarkerMenu: setOpenExitingMarketMarkerMenu,
//         setOpenTargetMarketMarker: setOpenTargetMarketMarker
//     })(wrapMap)