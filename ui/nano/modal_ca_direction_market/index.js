import React, {Component} from 'react'
import {connect} from 'react-redux'

import {Layout, Icon, Tooltip, Modal, Timeline} from 'antd';
import FontAwesome from 'react-fontawesome'

import styles from '../map/index.scss'

import {withGoogleMap, GoogleMap, Marker, Polyline} from "react-google-maps";

import bluebird from 'bluebird'
import _ from 'lodash'

const MapWithAMarker = withGoogleMap(props => (
    <GoogleMap defaultZoom={8} defaultCenter={props.center}>
        {props
            .paths
            .map(item => (<Marker
                position={{
                lat: item.lat,
                lng: item.lng
            }}/>))
}
        <Polyline
            path={props.paths}
            options={{
            strokeColor: '#108ee9',
            strokeWeight: 5
        }}/>
    </GoogleMap>
));

const getDirectionsAPI = (origin, destination, index) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var request = {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            };

            // Pass the directions request to the directions service.
            var directionsService = new google.maps.DirectionsService;

            directionsService.route(request, (response, status) => {
                if (status == google.maps.DirectionsStatus.OK) {
                    resolve({response, index});
                } else {
                    if (status === 'OVER_QUERY_LIMIT') {
                        reject({code: 1005, message: 'Over query limit'})
                    } else {
                        reject(status);
                    }
                }
            });
        }, _.random(300, 800));
    });
};

class ModalCaDirectMarket extends Component {

    constructor(props)
    {
        super(props);

        const latProps = props.center.lat,
            lngProps = props.center.lng;

        this.state = {
            visibleContent: false,
            origin: new google
                .maps
                .LatLng(latProps, lngProps),
            paths: [
                {
                    lat: latProps,
                    lng: lngProps
                }
            ],
            loop: false,
            checkpoint: [],
            branch: [
                {
                    lat: 12.7802959,
                    lng: 101.9723228
                }, {
                    lat: 7.4469444,
                    lng: 100.1277778
                }, {
                    lat: 8.52144,
                    lng: 99.8251398
                }, {
                    lat: 8.287423,
                    lng: 100.1927389
                }, {
                    lat: 13.76624,
                    lng: 100.47177
                }, {
                    lat: 13.700516,
                    lng: 102.507671
                },, {
                    lat: 13.85766,
                    lng: 100.64348
                }, {
                    lat: 13.59452,
                    lng: 100.59644
                }, {
                    lat: 13.7241555,
                    lng: 100.5305322
                }, {
                    lat: 13.70508,
                    lng: 100.52896
                }, {
                    lat: 13.87581,
                    lng: 100.41157
                }, {
                    lat: 13.84331,
                    lng: 100.49496
                }, {
                    lat: 13.84018,
                    lng: 100.54906
                }, {
                    lat: 13.7444748,
                    lng: 100.4992596
                }, {
                    lat: 13.85612,
                    lng: 100.86649
                }
            ]
        }

        this
            .testFunc
            .bind(this);
    }

    componentDidMount() {
        if (document.getElementById('modal-ca-directino-market') === null || document.getElementById('modal-ca-directino-market') === undefined) {
            var divModal = document.createElement("div")
            divModal.id = 'modal-ca-directino-market'

            document
                .getElementById('ca-directino-market')
                .appendChild(divModal)
        }
    }

    componentWillReceiveProps(nextProps, nextState)
    {
        if (nextProps.caDirectionOpen) {
            this.findBestRouteToMarket();
        }
    }

    componentDidUpdate(prevProps, prevState)
    {
        if (this.state.loop) {
            this.findBestRouteToMarket();
        }
    }

    async testFunc() {

        branch.map((path, index) => {
            const destination = new google
                .maps
                .LatLng(path.lat, path.lng);

            getDirectionsAPI(this.state.origin, destination, index);
        });
    }

    findBestRouteToMarket = () => {
        
        if (this.state.branch.length > 0) {
            let {branch} = this.state

            let api = [];

            branch.map((path, index) => {
                const destination = new google
                    .maps
                    .LatLng(path.lat, path.lng);

                api.push(getDirectionsAPI(this.state.origin, destination, index));
            });

            bluebird
                .all(api)
                .then(resp => {
                    const nextPath = _.orderBy(resp.map(item => ({distance: item.response.routes[0].legs[0].distance.value, index: item.index})), "distance")[0]

                    let obj = this.state.paths

                    obj.push(branch[nextPath.index])

                    const origin = new google
                        .maps
                        .LatLng(branch[nextPath.index].lat, branch[nextPath.index].lng)

                    _.remove(branch, (item, index) => index == nextPath.index)

                    this.setState({paths: obj, origin, branch, loop: true});
                })
        } else {
            this.setState({loop: false});
        }
    }

    setVisibleContent = () => {
        this.setState({
            visibleContent: !this.state.visibleContent
        })
    }

    render() {
        const {caDirectionOpen, openCaDirectionToMarket} = this.props
        const iconVisible = this.state.visibleContent
            ? 'plus-square'
            : 'minus-square';
        const titleVisible = this.state.visibleContent
            ? 'Show'
            : 'Hide';

        return (
            <Modal
                wrapClassName={`parent_salesummary ${styles['modalParentDirectionInfo']}`}
                className={styles['modalDirectionInfo']}
                visible={caDirectionOpen}
                onOk={false}
                footer={null}
                closable={false}
                maskClosable={false}
                mask={false}
                getContainer={() => document.getElementById('modal-ca-directino-market')}>
                <article className={styles['wrapper']}>
                    <div className={`${styles['header-container']} ModalHeader`}>
                        <div
                            className={styles['title-img-direction']}
                            style={{
                            marginRight: '20px'
                        }}>
                            <span>
                                <FontAwesome
                                    name="road"
                                    style={{
                                    marginRight: '7px'
                                }}/>
                                Ca Direction to market
                            </span>
                        </div>
                        <Tooltip title={titleVisible}>
                            <Icon
                                onClick={this.setVisibleContent}
                                className={styles["trigger-close"]}
                                type={iconVisible}/>
                        </Tooltip>
                        <Tooltip title='Close'>
                            <Icon
                                onClick={openCaDirectionToMarket}
                                className={styles["trigger-close"]}
                                type='close'/>
                        </Tooltip>
                    </div>
                    {!this.state.visibleContent && <Layout>
                        <Layout
                            style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#FFF',
                            padding: '5px',
                            minWidth: '950px',
                            height: '650px'
                        }}>
                            <div
                                className={styles['detail-container']}
                                style={{
                                display: 'flex',
                                width: '80%',
                                height: '100%',
                                fles: '1'
                            }}>
                                <MapWithAMarker
                                    key={this.state.paths.length}
                                    center={this.props.center}
                                    paths={this.state.paths}
                                    containerElement={< div style = {{ height: `100%` }}/>}
                                    mapElement={< div style = {{ height: `100%` }}/>}/>
                            </div>
                            <div
                                className="ModalHeader"
                                style={{
                                width: '40%',
                                height: '100%'
                            }}>
                                <Timeline>
                                    <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                                    <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                                    <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                                    <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                                </Timeline>
                            </div>
                        </Layout>
                    </Layout>
}
                </article>
            </Modal>
        )
    }

}

export default ModalCaDirectMarket