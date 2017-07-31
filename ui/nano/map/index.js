import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withGoogleMap, GoogleMap, Marker, Circle, InfoWindow, OverlayView, Polyline } from "react-google-maps"
import { MAP } from 'react-google-maps/lib/constants';

import { Layout, Icon, Button, Table, Tooltip } from 'antd';
import FontAwesome from 'react-fontawesome'
import SummaryTable from '../market/summarytable'
import { Doughnut } from 'react-chartjs-2'
import moment from 'moment'

import icon_full_branch from '../../../image/icon_full_branch.png'
import icon_Keyos from '../../../image/icon_Keyos.png'
import icon_Market from '../../../image/icon_Market.png'
import icon_Target from '../../../image/icon_Target.png'
import icon_Nano from '../../../image/icon_Nano.png'
import icon_Srisawat from '../../../image/icon_Srisawat.png'
import icon_SrisawatPower from '../../../image/icon_SrisawatPower.png'
import icon_Mtls from '../../../image/icon_Mtls.png'

// import { setOpenBranchMarker } from '../actions/nanomaster'

import styles from './index.scss'

const { Header } = Layout;

const onDomReady = () => {
    let iwOuter = $('.gm-style-iw');
    let iwBackground = iwOuter.prev();
    iwBackground.children(':nth-child(2)').css({ 'display': 'none' });
    iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
    iwBackground.children(':nth-child(3)').find('div').children().css({ 'box-shadow': '0 1px 6px rgba(72, 181, 233, 0.6)', 'z-index': '1' });

    let iwCloseBtn = iwOuter.next();
    iwCloseBtn.remove()
    iwOuter.css({ opacity: 1 })
}

const color = [
    { status: 'OS', color: '#00BCD4' },
    { status: 'SETUP', color: '#8bc34a' },
    { status: 'REJECT', color: '#e91e63' },
    { status: 'CANCEL', color: '#ff5722' },
    { status: 'POTENTIAL', color: '#9e9e9e' }];

const chartData = (item) => {

    let data = [1]
    let bg = ['#EEE']

    if (!_.isEmpty(item)) {
        const setup = _.find(item, { Status: 'APPROVED' })
        const reject = _.find(item, { Status: 'REJECTED' })
        const cancel = _.find(item, { Status: 'CANCELLED' })
        const potential = _.find(item, { Status: 'POTENTIAL' })
        data = [
            setup && setup.Ach,
            reject && reject.Ach,
            cancel && cancel.Ach,
            potential && (potential.Ach < 0 ? 0 : potential.Ach)]

        if (data[0] == 0 && data[1] == 0 && data[2] == 0 && data[3] == 0) {
            data[1]
            bg = ['#EEE']
        }
        else
            bg = ['#8bc34a', '#e91e63', '#ff5722', '#9e9e9e']
    }

    return {
        data: {
            datasets: [{
                data: data,
                backgroundColor: bg
            }],
            labels: ['SETUP', 'REJECT', 'CANCEL', 'POTENTIAL'],
            borderWidth: 0
        },
        options: {
            segmentStrokeWidth: 20,
            segmentStrokeColor: "rgba(255, 255, 255, 0.4)",
            legend: { display: false },
            maintainAspectRatio: false,
            fullWidth: true,
            tooltipFontSize: 10
        }
    }
}

const circle = [{
    radius: 5000,
    options: {
        strokeColor: '#08B21F',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#08B21F',
        fillOpacity: 0.04
    }
}, {
    radius: 10000,
    options: {
        strokeColor: '#F3CA04',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#F3CA04',
        fillOpacity: 0.04
    }
}, {
    radius: 15000,
    options: {
        strokeColor: '#F33A00',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#F33A00',
        fillOpacity: 0.04
    }
}]

const options = {
    center: { lat: 13.736717, lng: 100.523186 },
    circle: [{
        radius: 5000,
        options: {
            strokeColor: '#08B21F',
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: '#08B21F',
            fillOpacity: 0.04
        }
    }, {
        radius: 10000,
        options: {
            strokeColor: '#F3CA04',
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: '#F3CA04',
            fillOpacity: 0.04
        }
    }, {
        radius: 15000,
        options: {
            strokeColor: '#F33A00',
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: '#F33A00',
            fillOpacity: 0.04
        }
    }],
}

const handleBounds = (props, map) => {
    if (map) {
        const mapInstance = map && map.context[MAP];
        setTimeout(() => { google.maps.event.trigger(mapInstance, "resize") }, 200)

        let bounds = new google.maps.LatLngBounds()
        let hasMarker = false
        // // props.branch

        props.branch &&
            props.branch.map((item, index) => {
                let marker = new google.maps.Marker({
                    position: { lat: parseFloat(item.BranchLatitude), lng: parseFloat(item.BranchLongitude) }
                })
                hasMarker = true
                bounds.extend(marker.position)
            })

        props.exitingMarket &&
            props.exitingMarket.map((item, index) => {
                let marker = new google.maps.Marker({
                    position: { lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }
                })
                hasMarker = true
                bounds.extend(marker.position)
            })

        props.targetMarket &&
            props.targetMarket.map((item, index) => {
                let marker = new google.maps.Marker({
                    position: { lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }
                })
                hasMarker = true
                bounds.extend(marker.position)
            })

        props.SEARCH_COMPLITITOR_MARKER &&
            props.SEARCH_COMPLITITOR_MARKER.map((item, index) => {
                let marker = new google.maps.Marker({
                    position: { lat: parseFloat(item.Lat), lng: parseFloat(item.Long) }
                })
                hasMarker = true
                bounds.extend(marker.position)
            })

        if (hasMarker && props.isBounds)
            map.fitBounds(bounds)
    }
}

const getMarketSummaryData = (item) => {

    if (!_.isEmpty(item)) {
        const os = _.find(item, { Status: 'OS' }) || { Total: 0, Ach: 0 }
        const setup = _.find(item, { Status: 'APPROVED' }) || { Total: 0, Ach: 0 }
        const reject = _.find(item, { Status: 'REJECTED' }) || { Total: 0, Ach: 0 }
        const cancel = _.find(item, { Status: 'CANCELLED' }) || { Total: 0, Ach: 0 }
        const potential = _.find(item, { Status: 'POTENTIAL' }) || { Total: 0, Ach: 0 }
        const sum_penatation = setup.Ach + reject.Ach + cancel.Ach

        return [
            { Detail: 'Total App', OS: os.Total, SETUP: setup.Total, REJECT: reject.Total, CANCEL: cancel.Total, POTENTIAL: potential.Total, sum_penatation: sum_penatation },
            { Detail: 'Achive', OS: os.Ach, SETUP: setup.Ach, REJECT: reject.Ach, CANCEL: cancel.Ach, POTENTIAL: potential.Ach, sum_penatation: sum_penatation },
        ]
    }
    else {
        return []
    }
}

const getMarketSummaryColumns = () => {
    return [{
        title: (<div className={styles['div-center']}><span>Detail</span></div>),
        dataIndex: 'Detail',
        key: 'Detail',
        width: '16%',
        className: `${styles['align-left']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
    }, {
        title: (<div className={styles['div-center']}><span>{color[0].status} Bal.</span></div>),
        dataIndex: 'OS',
        width: '16%',
        className: `${styles['align-right-hightlight']} ${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(1)}%` : text}</span>
        }
    }, {
        title: (
            <div className={`${styles['div-point']} `}>
                <span className={styles['color-point']} style={{ backgroundColor: color[1].color }}>
                </span><span>Setup</span>
            </div>
        ),
        dataIndex: 'SETUP',
        key: 'SETUP',
        width: '16%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(1)}%` : text}</span>
        }
    }, {
        title: (
            <div className={styles['div-point']}>
                <span className={styles['color-point']} style={{ backgroundColor: color[2].color }}>
                </span><span>Reject</span>
            </div>
        ),
        dataIndex: 'REJECT',
        key: 'REJECT',
        width: '16%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(1)}%` : text}</span>
        }
    }, {
        title: (
            <div className={styles['div-point']}>
                <span className={styles['color-point']} style={{ backgroundColor: color[3].color }}>
                </span><span>Cancel</span>
            </div>
        ),
        dataIndex: 'CANCEL',
        key: 'CANCEL',
        width: '16%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(1)}%` : text}</span>
        }
    }, {
        title: (
            <div className={styles['div-point']}>
                <span className={styles['color-point']} style={{ backgroundColor: color[4].color }}>
                </span><span>Potential</span>
            </div>
        ),
        dataIndex: 'POTENTIAL',
        key: 'POTENTIAL',
        width: '16%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(1)}%` : text}</span>
        }
    }]
}

const getCAData = (item) => {
    if (!_.isEmpty(item)) {
        let data = []
        _.mapKeys(_.groupBy(item, "CAName"), (value, key) => {

            const os = _.find(item, { CAName: key, Status: 'OS' })
            const approved = _.find(item, { CAName: key, Status: 'APPROVED' })
            const reject = _.find(item, { CAName: key, Status: 'REJECTED' })
            const cancel = _.find(item, { CAName: key, Status: 'CANCELLED' })
            const total = _.find(item, { CAName: key, Status: 'TOTAL' })

            data.push({
                Name: key,
                OS_App: !_.isEmpty(os) ? os.Total : 0,
                OS_Ach: !_.isEmpty(os) ? os.Ach : 0,
                Setup_App: !_.isEmpty(approved) ? approved.Total : 0,
                Setup_Ach: !_.isEmpty(approved) ? approved.Ach : 0,
                Reject_App: !_.isEmpty(reject) ? reject.Total : 0,
                Reject_Ach: !_.isEmpty(reject) ? reject.Ach : 0,
                Cancel_App: !_.isEmpty(cancel) ? cancel.Total : 0,
                Cancel_Ach: !_.isEmpty(cancel) ? cancel.Ach : 0,
                Total_App: !_.isEmpty(total) ? total.Total : 0,
                Total_Ach: !_.isEmpty(total) ? total.Ach : 0,
                BillingDate: ''
            })
        })
        return _.orderBy(data, ['OS_Ach', 'Setup_Ach'], ['desc', 'desc'])
    }
    return []
}

const getColumnCA = [{
    title: (<div className={styles['div-center']}><span>Name</span></div>),
    dataIndex: 'Name',
    key: 'Name',
    width: '16%',
    className: `${styles['align-left']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
    render: (text, record, index) => {
        return <span>{text}</span>
    }
}, {
    title: (<div className={styles['div-center']}><span>Status</span></div>),
    width: '6%',
    className: `${styles['align-left']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
}, {
    title: (<div className={styles['div-center']}>WkCycle<br />Due</div>),
    dataIndex: 'BillingDate',
    key: 'BillingDate',
    width: '6%',
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
}, {
    title: (<span className={styles['align-center']}>OS Bal.</span>),
    className: `${styles['hight-light']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
    children: [{
        title: (<div className={styles['div-center']}><span>App</span></div>),
        dataIndex: 'OS_App',
        key: 'OS_App',
        width: '4.5%',
        className: `${styles['align-right-hightlight']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{text}</span>
        }
    }, {
        title: (<div className={styles['div-center']}><span>%</span></div>),
        dataIndex: 'OS_Ach',
        key: 'OS_Ach',
        width: '4.5%',
        className: `${styles['align-right-hightlight']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{parseFloat(text).toFixed(0)}%</span>
        }
    }]
}, {
    title: 'Setup',
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
    children: [{
        title: (<div className={styles['div-center']}><span>App</span></div>),
        dataIndex: 'Setup_App',
        key: 'Setup_App',
        width: '4.5%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{text}</span>
        }
    }, {
        title: (<div className={styles['div-center']}><span>%</span></div>),
        dataIndex: 'Setup_Ach',
        key: 'Setup_Ach',
        width: '4.5%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{parseFloat(text).toFixed(0)}%</span>
        }
    }]
}, {
    title: 'Reject',
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
    children: [{
        title: (<div className={styles['div-center']}><span>App</span></div>),
        dataIndex: 'Reject_App',
        key: 'Reject_App',
        width: '4.5%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{text}</span>
        }
    }, {
        title: (<div className={styles['div-center']}><span>%</span></div>),
        dataIndex: 'Reject_Ach',
        key: 'Reject_Ach',
        width: '4.5%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{parseFloat(text).toFixed(0)}%</span>
        }
    }]
}, {
    title: 'Cancel',
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
    children: [{
        title: (<div className={styles['div-center']}><span>App</span></div>),
        dataIndex: 'Cancel_App',
        key: 'Cancel_App',
        width: '4.5%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{text}</span>
        }
    }, {
        title: (<div className={styles['div-center']}><span>%</span></div>),
        dataIndex: 'Cancel_Ach',
        key: 'Cancel_Ach',
        width: '4.5%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{parseFloat(text).toFixed(0)}%</span>
        }
    }]
}, {
    title: 'Total',
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
    children: [{
        title: (<div className={styles['div-center']}><span>App</span></div>),
        dataIndex: 'Total_App',
        key: 'Total_App',
        width: '4.5%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{text}</span>
        }
    }, {
        title: (<div className={styles['div-center']}><span>%</span></div>),
        dataIndex: 'Total_Ach',
        key: 'Total_Ach',
        width: '4.5%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{parseFloat(text).toFixed(0)}%</span>
        }
    }]
}]

const getLinkDetail = (obj, props) => {
    return obj.map((m, i) => {
        const item = _.find(props.branch, { BranchCode: m.BranchCode })
        return (<span><a onClick={() => props.onBranchMarkerClick(item, true)}>{m.BranchName}</a>{(i + 1) < obj.length && ' / '}</span>)
    })
}

const STYLES = {
    mapContainer: {
        height: `100%`,
    }
};

const getPixelPositionOffset = (width, height) => {
    return { x: -(width / 2), y: -(height / 2) };
}

const getBranchMarkerMenu = (props) => {
    if (_.filter(props.criteria.MarkerOptions, o => o == 'MR').length > 0) {
        return props.branch.map((item, index) => {

            let icon = icon_full_branch

            switch (item.BranchType) {
                case 'K':
                    icon = icon_Keyos
                    break;
                case 'P':
                    icon = icon_Nano
                    break;
            }

            return (
                <OverlayView
                    key={item.BranchCode}
                    position={{ lat: parseFloat(item.BranchLatitude), lng: parseFloat(item.BranchLongitude) }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    getPixelPositionOffset={getPixelPositionOffset}>
                    <div className={styles['overlayView']}>

                        <div className={styles['circle-menu']}>
                            <input type="checkbox" className={styles["cn-button"]} id={`cn-button_${index}`} />
                            <Tooltip title={item.BranchName}>
                                <label className={styles["cn-button-open"]} htmlFor={`cn-button_${index}`}>
                                    <img className={styles['menu-marker']} src={icon} />
                                    <div className={styles['menu-close-button']}>
                                        <FontAwesome name="close" />
                                    </div>
                                </label>
                            </Tooltip>
                            <div className={styles["cn-wrapper"]} id={`cn-wrapper_${index}`}>
                                <ul>
                                    <li><Tooltip title="Market Picture"><label htmlFor={`cn-button_${index}`}><span><FontAwesome name="picture-o" /></span></label></Tooltip></li>
                                    <li><Tooltip title="Shop Layout"><label htmlFor={`cn-button_${index}`}><span><FontAwesome name="map-marker" /></span></label></Tooltip></li>
                                    <li><Tooltip title="Sale Summary"><label htmlFor={`cn-button_${index}`}><span><FontAwesome name="line-chart" /></span></label></Tooltip></li>
                                    <li onClick={() => props.onBranchMarkerClick(item)}><Tooltip title="Market Penatation"><label htmlFor={`cn-button_${index}`}><span><FontAwesome name="table" /></span></label></Tooltip></li>
                                    <li><Tooltip title="Portfolio Quality"><label htmlFor={`cn-button_${index}`}><span><FontAwesome name="dollar" /></span></label></Tooltip></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </OverlayView>
            )
        })
    }
}


const getCAExitingMarker = (props) => {

    return props.exitingMarket.map((item, index) => {
        return (
            <OverlayView
                key={index}
                position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={getPixelPositionOffset}>
                <img className={styles['ca-marker-img']} src={'http://172.17.9.94/newservices/LBServices.svc/employee/image/56367'} />
            </OverlayView>
        )
    })
}

const getExitingMarkerMenu = props => {

    return props.exitingMarket.map((item, index) => {
        return (
            <OverlayView
                key={index}
                position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={getPixelPositionOffset}>
                <div className={styles['overlayView']}>

                    <div className={styles['circle-menu']}>
                        <input type="checkbox" className={styles["cn-button"]} id={`cn-button-exiting_${index}`} />
                        <label className={styles["cn-button-open"]} htmlFor={`cn-button-exiting_${index}`}>
                            <img className={styles['menu-marker']} src={icon_Market} />
                            <div className={styles['menu-close-button']}>
                                <FontAwesome name="close" />
                            </div>
                        </label>
                        <div className={styles["cn-wrapper"]} id={`cn-wrapper_${index}`}>
                            <ul>
                                <li><Tooltip title="Market Picture"><label htmlFor={`cn-button-exiting_${index}`}><span><FontAwesome name="picture-o" /></span></label></Tooltip></li>
                                <li><Tooltip title="Shop Layout"><label htmlFor={`cn-button-exiting_${index}`}><span><FontAwesome name="map-marker" /></span></label></Tooltip></li>
                                <li><Tooltip title="Sale Summary"><label htmlFor={`cn-button-exiting_${index}`}><span><FontAwesome name="line-chart" /></span></label></Tooltip></li>
                                <li onClick={() => props.onMarkerClick(item)}><Tooltip title="Market Penatation"><label htmlFor={`cn-button-exiting_${index}`}><span><FontAwesome name="table" /></span></label></Tooltip></li>
                                <li><Tooltip title="Portfolio Quality"><label htmlFor={`cn-button-exiting_${index}`}><span><FontAwesome name="dollar" /></span></label></Tooltip></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </OverlayView>
        )
    })
}

const getBranchMarker = (props) => {

    if (_.filter(props.criteria.MarkerOptions, o => o == 'MR').length > 0) {

        return _.filter(props.branch, { showInfo: true }).map((item, index) => {

            let icon = icon_full_branch
            let related_branch = [], current_branch
            current_branch = _.find(item.BRANCH_DESCRIPTION, { BranchCode: item.BranchCode })

            switch (item.BranchType) {
                case 'K':
                    related_branch = _.filter(item.BRANCH_DESCRIPTION, o => o.BranchCode != item.BranchCode && o.BranchType != 'K')
                    icon = icon_Keyos
                    break;
                case 'P':
                case 'L':
                    related_branch = _.filter(item.BRANCH_DESCRIPTION, o => o.BranchCode != item.BranchCode)
                    icon = icon_Nano
                    break;
            }

            return (
                <Marker
                    key={index}
                    title={item.BranchName}
                    onClick={() => props.onBranchMarkerClick(item)}
                    position={{ lat: parseFloat(item.BranchLatitude), lng: parseFloat(item.BranchLongitude) }}
                    icon={{
                        url: icon
                    }}>
                    {
                        item.showInfo &&
                        (
                            <InfoWindow onDomReady={onDomReady}>
                                <Layout>
                                    <div className={styles['header']}>
                                        <Icon
                                            className="trigger"
                                            type='pie-chart' />
                                        <span>
                                            {`${item.BranchName}`}
                                        </span>
                                        <Icon
                                            onClick={() => props.onBranchMarkerClick(item)}
                                            className="trigger"
                                            type='close' />
                                    </div>
                                    <Layout style={{ backgroundColor: '#FFF', padding: '10px' }}>
                                        <div className={styles['detail-container']}>
                                            <div className={styles['detail-chart']}>
                                                <div style={{ width: '160px', height: '160px' }}>
                                                    <Doughnut {...chartData(item.BRANCH_INFORMATION) } />
                                                    <span>{`${parseFloat(!_.isEmpty(item.BRANCH_INFORMATION) && getMarketSummaryData(item.BRANCH_INFORMATION)[1].sum_penatation || 0).toFixed(0)}%`}</span>
                                                </div>
                                                <div>
                                                    <div className={styles['text-descrition']}>
                                                        <div>
                                                            <span>{`${current_branch.MarketShop} Shop `}</span>
                                                            <span>{`from ${current_branch.Market} Market (Open on ${current_branch.OpenDate ? moment(current_branch.OpenDate).format("MMM YYYY") : 'unknow'})`}</span>
                                                        </div>
                                                        <span>
                                                            {
                                                                current_branch.BranchType == 'K' ?
                                                                    `Base on `
                                                                    :
                                                                    `${related_branch.length} kiosk `
                                                            }
                                                            {
                                                                getLinkDetail(related_branch, props)
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className={styles['box-shadow']}>
                                                        <div className={`${styles['header']} ${styles['header-border']}`}>
                                                            <Icon
                                                                className="trigger"
                                                                type='bars' />
                                                            <span>Market Penetration</span>
                                                        </div>
                                                        <Layout style={{ backgroundColor: '#FFF' }}>
                                                            <Table
                                                                className={styles['summary-table-not-odd']}
                                                                dataSource={getMarketSummaryData(item.BRANCH_INFORMATION)}
                                                                columns={getMarketSummaryColumns()}
                                                                pagination={false}
                                                                bordered />
                                                        </Layout>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles['box-shadow']}>
                                                <div className={`${styles['header']} ${styles['header-border']}`}>
                                                    <Icon
                                                        className="trigger"
                                                        type='bars' />
                                                    <span>CA Contribution</span>
                                                </div>
                                                <Layout style={{ backgroundColor: '#FFF' }}>
                                                    <Table
                                                        className={styles['summary-table']}
                                                        dataSource={getCAData(item.CA_BRANCH_INFORMATION)}
                                                        columns={getColumnCA}
                                                        pagination={false}
                                                        bordered />
                                                </Layout>
                                            </div>
                                        </div>
                                    </Layout>
                                </Layout>
                            </InfoWindow>
                        )
                    }
                </Marker>
            )
        })
    }
}

const getLineKioskToBranch = (props) => {
    if (_.filter(props.criteria.MarkerOptions, o => o == 'MR').length > 0) {
        return props.branch.map((item, index) => {
            if (item.BranchType == 'K') {
                const BranchLocation = _.find(props.branch, { BranchCode: item.BranchCode.substring(0, 3) })
                if (BranchLocation)
                    return (
                        <Polyline
                            path={[
                                { lat: parseFloat(item.BranchLatitude), lng: parseFloat(item.BranchLongitude) },
                                { lat: parseFloat(BranchLocation.BranchLatitude), lng: parseFloat(BranchLocation.BranchLongitude) }
                            ]}
                            options={{ strokeColor: '#d80049' }} />
                    )
            }
        })
    }
}

const getBranchMarkerCircle = (props) => {
    if (_.filter(props.criteria.MarkerOptions, o => o == 'RA').length > 0) {
        return props.branch.map((item, index) => {
            const radius = circle.map(c => (
                <Circle
                    center={{ lat: parseFloat(item.BranchLatitude), lng: parseFloat(item.BranchLongitude) }}
                    radius={c.radius}
                    options={{ ...c.options }}
                />
            ))

            if (item.BranchType == "K") {
                if (_.isEmpty(_.find(props.branch, { BranchCode: item.OriginBranchCode }))) {
                    return radius
                }
            }
            else {
                return radius
            }
        })
    }
}

const getExitingMarker = props => {
    return props.exitingMarket.map((item, index) => {
        return (
            <Marker
                key={index}
                title={item.MarketName}
                onClick={() => props.onMarkerClick(item)}
                position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                icon={{
                    url: icon_Market
                }}>
                {
                    item.showInfo &&
                    (
                        <InfoWindow
                            title="Blabla"
                            onDomReady={onDomReady}>
                            <Layout>
                                <div className={styles['header']}>
                                    <Icon
                                        className="trigger"
                                        type='pie-chart' />
                                    <span>
                                        {`(${item.MarketCode}) ${item.MarketName} (${item.BranchType})`}
                                    </span>
                                    <Icon
                                        onClick={() => props.onMarkerClick(item)}
                                        className="trigger"
                                        type='close' />
                                </div>
                                <Layout style={{ backgroundColor: '#FFF', padding: '10px' }}>
                                    <div className={styles['detail-container']}>
                                        <div className={styles['detail-chart']}>
                                            <div style={{ width: '160px', height: '160px' }}>
                                                <Doughnut {...chartData(item.MARKET_INFORMATION) } />
                                                <span>{`${parseFloat(!_.isEmpty(item.MARKET_INFORMATION) && getMarketSummaryData(item.MARKET_INFORMATION)[1].sum_penatation || 0).toFixed(0)}%`}</span>
                                            </div>
                                            <div>
                                                <div className={styles['text-descrition']}>
                                                    <div>
                                                        <span>{`${item.MarketShop} Shop `}</span>
                                                        <span>{`Distance from ${item.BranchName} ${parseFloat(item.Radius).toFixed(2)}Km.`}</span>
                                                    </div>
                                                    <span>
                                                        {`Type B working hour 07:00 - 19:00 (Mon - Wed - Fri) `}
                                                    </span>
                                                </div>
                                                <div className={styles['box-shadow']}>
                                                    <div className={`${styles['header']} ${styles['header-border']}`}>
                                                        <Icon
                                                            className="trigger"
                                                            type='bars' />
                                                        <span>Market Penetration</span>
                                                    </div>
                                                    <Layout style={{ backgroundColor: '#FFF' }}>
                                                        <Table
                                                            className={styles['summary-table-not-odd']}
                                                            dataSource={getMarketSummaryData(item.MARKET_INFORMATION)}
                                                            columns={getMarketSummaryColumns()}
                                                            pagination={false}
                                                            bordered />
                                                    </Layout>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles['box-shadow']}>
                                            <div className={`${styles['header']} ${styles['header-border']}`}>
                                                <Icon
                                                    className="trigger"
                                                    type='bars' />
                                                <span>CA Contribution</span>
                                            </div>
                                            <Layout style={{ backgroundColor: '#FFF' }}>
                                                <Table
                                                    className={styles['summary-table']}
                                                    dataSource={getCAData(item.CA_INFORMATION)}
                                                    columns={getColumnCA}
                                                    pagination={false}
                                                    bordered />
                                            </Layout>
                                        </div>
                                    </div>
                                </Layout>
                            </Layout>
                        </InfoWindow>
                    )
                }
            </Marker>
        )
    })
}

const getComplititorMarker = props => {
    return props.SEARCH_COMPLITITOR_MARKER.map((item, index) => {
        let icon = icon_full_branch
        switch (item.TypeCode) {
            case '1':
                icon = icon_SrisawatPower
                break;
            case '2':
                icon = icon_Srisawat
                break;
            case '3':
                icon = icon_Mtls
                break;
        }

        return (
            <Marker
                key={index}
                title={item.Place}
                position={{ lat: parseFloat(item.Lat), lng: parseFloat(item.Long) }}
                icon={{
                    url: icon
                }}>
            </Marker>
        )
    })
}

// class GMap extends Component {

//     onBranchMarkerClick = (targetItem) => {
//         this.props.setOpenBranchMarker(targetItem, this.props.RELATED_BRANCH_DATA)
//     }

//     getBranchMarker = () => {
//         const { NANO_FILTER_CRITERIA, RELATED_BRANCH_DATA } = this.props

//         if (_.filter(NANO_FILTER_CRITERIA.MarkerOptions, o => o == 'MR').length > 0) {

//             return RELATED_BRANCH_DATA.map((item, index) => {

//                 let icon = icon_full_branch
//                 // let related_branch = [], current_branch
//                 // current_branch = _.find(item.BRANCH_DESCRIPTION, { BranchCode: item.BranchCode })

//                 switch (item.BranchType) {
//                     case 'K':
//                         // related_branch = _.filter(item.BRANCH_DESCRIPTION, o => o.BranchCode != item.BranchCode && o.BranchType != 'K')
//                         icon = icon_Keyos
//                         break;
//                     case 'P':
//                     case 'L':
//                         // related_branch = _.filter(item.BRANCH_DESCRIPTION, o => o.BranchCode != item.BranchCode)
//                         icon = icon_Nano
//                         break;
//                 }

//                 return (
//                     <Marker
//                         key={index}
//                         position={{ lat: parseFloat(item.BranchLatitude), lng: parseFloat(item.BranchLongitude) }}
//                         onClick={() => this.onBranchMarkerClick(item)}
//                         icon={{
//                             url: icon
//                         }}>
//                         {
//                             item.showInfo &&
//                             (
//                                 <InfoWindow onDomReady={onDomReady}>
//                                     <Layout>
//                                         <div className={styles['header']}>
//                                             <Icon
//                                                 className="trigger"
//                                                 type='pie-chart' />
//                                             <span>
//                                                 {`${item.BranchName}`}
//                                             </span>
//                                             <Icon
//                                                 onClick={() => this.onBranchMarkerClick(item)}
//                                                 className="trigger"
//                                                 type='close' />
//                                         </div>
//                                         <Layout style={{ backgroundColor: '#FFF', padding: '10px' }}>
//                                             <div className={styles['detail-container']}>
//                                                 <div className={styles['detail-chart']}>
//                                                     <div style={{ width: '160px', height: '160px' }}>
//                                                         <Doughnut {...chartData(item.BRANCH_INFORMATION) } />
//                                                         <span>{`${parseFloat(!_.isEmpty(item.BRANCH_INFORMATION) && getMarketSummaryData(item.BRANCH_INFORMATION)[1].sum_penatation || 0).toFixed(0)}%`}</span>
//                                                     </div>
//                                                     <div>
//                                                         <div className={styles['text-descrition']}>
//                                                             <div>
//                                                                 <span>{`${current_branch.MarketShop} Shop `}</span>
//                                                                 <span>{`from ${current_branch.Market} Market (Open on ${current_branch.OpenDate ? moment(current_branch.OpenDate).format("MMM YYYY") : 'unknow'})`}</span>
//                                                             </div>
//                                                             <span>
//                                                                 {
//                                                                     current_branch.BranchType == 'K' ?
//                                                                         `Base on `
//                                                                         :
//                                                                         `${related_branch.length} kiosk `
//                                                                 }
//                                                                 {
//                                                                     getLinkDetail(related_branch, props)
//                                                                 }
//                                                             </span>
//                                                         </div>
//                                                         <div className={styles['box-shadow']}>
//                                                             <div className={`${styles['header']} ${styles['header-border']}`}>
//                                                                 <Icon
//                                                                     className="trigger"
//                                                                     type='bars' />
//                                                                 <span>Market Penetration</span>
//                                                             </div>
//                                                             <Layout style={{ backgroundColor: '#FFF' }}>
//                                                                 <Table
//                                                                     className={styles['summary-table-not-odd']}
//                                                                     dataSource={getMarketSummaryData(item.BRANCH_INFORMATION)}
//                                                                     columns={getMarketSummaryColumns()}
//                                                                     pagination={false}
//                                                                     bordered />
//                                                             </Layout>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className={styles['box-shadow']}>
//                                                     <div className={`${styles['header']} ${styles['header-border']}`}>
//                                                         <Icon
//                                                             className="trigger"
//                                                             type='bars' />
//                                                         <span>CA Contribution</span>
//                                                     </div>
//                                                     <Layout style={{ backgroundColor: '#FFF' }}>
//                                                         <Table
//                                                             className={styles['summary-table']}
//                                                             dataSource={getCAData(item.CA_BRANCH_INFORMATION)}
//                                                             columns={getColumnCA}
//                                                             pagination={false}
//                                                             bordered />
//                                                     </Layout>
//                                                 </div>
//                                             </div>
//                                         </Layout>
//                                     </Layout>
//                                 </InfoWindow>
//                             )
//                         }
//                     </Marker>
//                 )
//             })
//         }
//     }

//     handleBounds = (map) => {
//         if (map) {
//             const { RELATED_BRANCH_DATA } = this.props
//             const mapInstance = map || map.context[MAP];
//             setTimeout(() => { google.maps.event.trigger(mapInstance, "resize") }, 200)

//             let bounds = new google.maps.LatLngBounds()
//             let hasMarker = false

//             RELATED_BRANCH_DATA.map((item, index) => {
//                 let marker = new google.maps.Marker({
//                     position: { lat: parseFloat(item.BranchLatitude), lng: parseFloat(item.BranchLongitude) }
//                 })
//                 hasMarker = true
//                 bounds.extend(marker.position)
//             })

//             // props.exitingMarket &&
//             //     props.exitingMarket.map((item, index) => {
//             //         let marker = new google.maps.Marker({
//             //             position: { lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }
//             //         })
//             //         hasMarker = true
//             //         bounds.extend(marker.position)
//             //     })

//             // props.targetMarket &&
//             //     props.targetMarket.map((item, index) => {
//             //         let marker = new google.maps.Marker({
//             //             position: { lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }
//             //         })
//             //         hasMarker = true
//             //         bounds.extend(marker.position)
//             //     })

//             if (hasMarker && this.props.isBounds)
//                 map.fitBounds(bounds)
//         }

//     }

//     render() {
//         return (
//             <GoogleMap
//                 defaultZoom={8}
//                 defaultCenter={options.center}
//                 ref={(map) => (this.handleBounds(map))}>
//                 {
//                     this.getBranchMarker()
//                 }
//             </GoogleMap >
//         )
//     }

// }

// const Map = withGoogleMap(GMap)

// export default connect(
//     (state) => ({
//         NANO_FILTER_CRITERIA: state.NANO_FILTER_CRITERIA,
//         RELATED_BRANCH_DATA: state.RELATED_BRANCH_DATA
//     }), {
//         setOpenBranchMarker: setOpenBranchMarker
//     })(Map)

const map = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={8}
        defaultCenter={options.center}
        ref={(map) => (handleBounds(props, map))}>
        {
            getBranchMarkerMenu(props)
        }
        {
            getBranchMarker(props)
        }
        {
            getBranchMarkerCircle(props)
        }
        {
            /*getExitingMarkerMenu(props)*/
        }
        {
            getExitingMarker(props)
        }
        {
            getCAExitingMarker(props)
        }
        {
            getComplititorMarker(props)
        }
        {
            props.targetMarket &&
            props.targetMarket.map((item, index) => {
                return (
                    <Marker
                        key={index}
                        onClick={() => props.onTargetMarketClick(item)}
                        position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                        icon={{
                            url: icon_Target
                        }}>
                        {
                            item.showInfo &&
                            (
                                <InfoWindow onDomReady={onDomReady}>
                                    <Layout>
                                        <div className={styles['header']}>
                                            <Icon
                                                className="trigger"
                                                type='pie-chart' />
                                            <span>
                                                {`${item.MarketName}`}
                                            </span>
                                            <Icon
                                                onClick={() => props.onTargetMarketClick(item)}
                                                className="trigger"
                                                type='close' />
                                        </div>
                                        <Layout style={{ backgroundColor: '#FFF', padding: '10px' }}>
                                            <span>Region : {item.RegionCode}</span>
                                            <span>Province : {item.ProvinceName}</span>
                                            <span>Market Type : {item.MarketType}</span>
                                            <span>Age :{item.MarketAge}</span>
                                            <span>Open Day : {item.MarketOpenDay}</span>
                                            <span>Open Time : {item.MarketOpenTime}</span>
                                            <span>Shop : {item.MarketShop}</span>
                                        </Layout>
                                    </Layout>
                                </InfoWindow>
                            )
                        }
                    </Marker>
                )

            })
        }
    </GoogleMap >
))

export default map
