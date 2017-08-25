import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withGoogleMap, GoogleMap, Marker, Circle, InfoWindow, OverlayView, Polyline, StreetViewPanorama } from "react-google-maps"
import { MAP } from 'react-google-maps/lib/constants';

import { Layout, Icon, Button, Table, Tooltip, Modal, Form, Row, Col, Popover, Carousel } from 'antd';
import FontAwesome from 'react-fontawesome'
import { Doughnut } from 'react-chartjs-2'
import moment from 'moment'

import InsertNote from './insertnote'
import StreetViewMap from './streetview'
// import NewNote from './newnote'
// import NoteTable from './notetable'

import icon_full_branch from '../../../image/icon_full_branch.png'
import icon_Keyos from '../../../image/icon_Keyos.png'
import icon_Market from '../../../image/icon_Market.png'
import icon_Target from '../../../image/icon_Target.png'
import icon_Nano from '../../../image/icon_Nano.png'
import icon_Srisawat from '../../../image/icon_Srisawat.png'
import icon_SrisawatPower from '../../../image/icon_SrisawatPower.png'
import icon_Mtls from '../../../image/icon_Mtls.png'
import pinpao from '../../../image/pinpao.png'

import {
    setOpenBranchMarker,
    setOpenBranchMarkerMenu,
    setOpenExitingMarketMarker,
    setOpenExitingMarketMarkerMenu,
    setOpenTargetMarketMarker,
    insertUpdateMarkerNote
} from '../actions/nanomaster'

import styles from './index.scss'

const { Header } = Layout

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

        if (props.DO_BOUNDS_MAP) {
            let bounds = new google.maps.LatLngBounds()
            let hasMarker = false

            const {
            RELATED_BRANCH_DATA,
                RELATED_EXITING_MARKET_DATA,
                RELATED_TARGET_MARKET_DATA,
                RELATED_COMPLITITOR_DATA
            } = props

            RELATED_BRANCH_DATA.map((item, index) => {
                let marker = new google.maps.Marker({
                    position: { lat: parseFloat(item.BranchLatitude), lng: parseFloat(item.BranchLongitude) }
                })
                hasMarker = true
                bounds.extend(marker.position)
            })

            RELATED_EXITING_MARKET_DATA.map((item, index) => {
                let marker = new google.maps.Marker({
                    position: { lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }
                })
                hasMarker = true
                bounds.extend(marker.position)
            })

            RELATED_TARGET_MARKET_DATA.map((item, index) => {
                let marker = new google.maps.Marker({
                    position: { lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }
                })
                hasMarker = true
                bounds.extend(marker.position)
            })

            RELATED_COMPLITITOR_DATA.map((item, index) => {
                let marker = new google.maps.Marker({
                    position: { lat: parseFloat(item.Lat), lng: parseFloat(item.Long) }
                })
                hasMarker = true
                bounds.extend(marker.position)
            })

            if (hasMarker)
                map.fitBounds(bounds)
        }
    }
}

const getMarketSummaryData = (item) => {

    if (!_.isEmpty(item)) {
        const Amt = _.find(item, { Status: 'OS' }) || { Total: 0, Ach: 0 }
        const os = _.find(item, { Status: 'OS' }) || { Total: 0, Ach: 0 }
        const setup = _.find(item, { Status: 'APPROVED' }) || { Total: 0, Ach: 0 }
        const reject = _.find(item, { Status: 'REJECTED' }) || { Total: 0, Ach: 0 }
        const cancel = _.find(item, { Status: 'CANCELLED' }) || { Total: 0, Ach: 0 }
        const potential = _.find(item, { Status: 'POTENTIAL' }) || { Total: 0, Ach: 0 }
        const sum_penatation = setup.Ach + reject.Ach + cancel.Ach

        return [
            {
                Detail: 'Total App',
                Amt: Amt.Amt ? Amt.Amt : '',
                OS: os.Total,
                SETUP: setup.Total,
                REJECT: reject.Total,
                CANCEL: cancel.Total,
                POTENTIAL: potential.Total,
                sum_penatation: sum_penatation
            },
            {
                Detail: 'Achive',
                OS: os.Ach,
                SETUP: setup.Ach,
                REJECT: reject.Ach,
                CANCEL: cancel.Ach,
                POTENTIAL: potential.Ach,
                sum_penatation: sum_penatation
            },
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
        width: '15%',
        className: `${styles['align-left']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
    }, {
        title: (<div className={styles['div-center']}><span>{color[0].status} Bal.</span></div>),
        className: `${styles['align-right-hightlight']} ${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        children: [{
            dataIndex: 'Amt',
            width: '8%',
            className: `${styles['header-hide']} ${styles['align-right-hightlight']} ${styles['align-center']} sm-padding`,
            render: (text, record, index) => {
                return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `` : `${text}`}</span>
            }
        }, {
            dataIndex: 'OS',
            width: '8%',
            className: `${styles['header-hide']} ${styles['align-right-hightlight']} ${styles['align-center']} sm-padding`,
            render: (text, record, index) => {
                return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%` : text}</span>
            }
        }],
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
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%` : text}</span>
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
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%` : text}</span>
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
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%` : text}</span>
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
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%` : text}</span>
        }
    }]
}

const getFormatShortDay = (value) => {

    if (_.isEmpty(value)) {
        return ''
    }
    else {
        let day = value.split(',').sort()
        const dayArray = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa']

        let result = ""
        let lastValue = ''

        day.map((item, index) => {
            const nextIndex = index + 1 > day.length ? day.length : index + 1
            if ((item - 1) == lastValue) {
                result = `${result}${index != 0 ? '-' : ''}${dayArray[item]}`
            }
            else {
                result = `${result}${index != 0 ? '/' : ''}${dayArray[item]}`
            }
            lastValue = item
        })

        let valueNotContinue = result.split('/')
        if (valueNotContinue.length > 1 || valueNotContinue[0].indexOf('-') > 0) {
            let obj = valueNotContinue.map((item, index) => {
                let value = item.split('-')
                if (value.length > 1) {
                    return `${value[0]}-${value[value.length - 1]}`
                }
                else {
                    return value[0]
                }
            })
            result = obj.join('/')
        }

        return result
    }
}

const getCAData = (item) => {
    if (!_.isEmpty(item)) {
        let data = []
        _.mapKeys(_.groupBy(item, "CAName"), (value, key) => {

            const caid = value[0].CAID
            const os = _.find(value, { CAName: key, Status: 'OS' })
            const approved = _.find(value, { CAName: key, Status: 'APPROVED' })
            const reject = _.find(value, { CAName: key, Status: 'REJECTED' })
            const cancel = _.find(value, { CAName: key, Status: 'CANCELLED' })
            const total = _.find(value, { CAName: key, Status: 'TOTAL' })

            data.push({
                Name: key,
                CAID: caid == 99999 ? 1 : 0,
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
                BillingDate: getFormatShortDay(value[0].CycleDue),
                StatusDate: _.isEmpty(value[0].StartWork) ? '' : moment(value[0].StartWork).format('MMM-YY')
            })
        })

        return _.orderBy(data, ['CAID', 'OS_Ach', 'Setup_Ach'], ['asc', 'desc', 'desc'])
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
    title: (<div className={styles['div-center']}>Start<br />Month</div>),
    dataIndex: 'StatusDate',
    key: 'StatusDate',
    width: '6%',
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
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

const getLinkDetail = (obj, props, branch_radius) => {
    return obj.map((m, i) => {
        const item = _.find(props.RELATED_BRANCH_DATA, { BranchCode: m.BranchCode })
        const radius = parseFloat(_.find(branch_radius, { BranchCode: m.BranchCode }).Radius).toFixed(1)
        return (<span><a onClick={() => props.setOpenBranchMarker(item, props.RELATED_BRANCH_DATA, true)}>{m.BranchName}</a> {radius}Km. {(i + 1) < obj.length && ' / '} </span>)
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
    const { NANO_FILTER_CRITERIA, RELATED_BRANCH_DATA } = props

    if (_.filter(NANO_FILTER_CRITERIA.MarkerOptions, o => o == 'MR').length > 0) {
        return RELATED_BRANCH_DATA.map((item, index) => {
            if (item.showMenu) {
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
                                <input type="checkbox" className={styles["cn-button"]} id={`cn-button_${index}`} checked={true} />
                                <Tooltip title={item.BranchName}>
                                    <label className={styles["cn-button-open"]} htmlFor={`cn-button_${index}`} onClick={() => props.setOpenBranchMarkerMenu(item, props.RELATED_BRANCH_DATA, false)}>
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
                                        <li onClick={() => props.setOpenBranchMarker(item, props.RELATED_BRANCH_DATA, true)}><Tooltip title="Market Penatation"><label htmlFor={`cn-button_${index}`}><span><FontAwesome name="table" /></span></label></Tooltip></li>
                                        <li><Tooltip title="Portfolio Quality"><label htmlFor={`cn-button_${index}`}><span><FontAwesome name="dollar" /></span></label></Tooltip></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </OverlayView>
                )
            }
        })
    }
}

const getBranchMarker = (props, handleShowModal) => {

    const { RELATED_BRANCH_DATA } = props

    // return _.filter(RELATED_BRANCH_DATA, { showInfo: true }).map((item, index) => {
    return RELATED_BRANCH_DATA.map((item, index) => {

        let icon = icon_full_branch
        let related_branch = [], current_branch
        current_branch = _.find(item.BRANCH_DESCRIPTION, { BranchCode: item.BranchCode })

        switch (item.BranchType) {
            case 'K':
                icon = icon_Keyos
                related_branch = _.filter(item.BRANCH_DESCRIPTION, o => o.BranchCode != item.BranchCode && o.BranchType != 'K')
                break;
            case 'P':
                icon = icon_Nano
                related_branch = _.filter(item.BRANCH_DESCRIPTION, o => o.BranchCode != item.BranchCode)
                break;
            case 'L':
                icon = icon_full_branch
                related_branch = _.filter(item.BRANCH_DESCRIPTION, o => o.BranchCode != item.BranchCode)
                break;
        }

        if (item.showMenu) {
            icon = '_blanks'
        }

        const start_work_date = !_.isEmpty(item.TM_WorkPeriod) ? moment.duration(moment(new Date()).diff(moment(item.TM_WorkPeriod)))._data : ''
        const work_date_format = `Work Period : ${start_work_date.years}.${start_work_date.months}.${start_work_date.days}`

        return (
            <Marker
                key={index}
                title={item.BranchName}
                onClick={() => props.setOpenBranchMarkerMenu(item, props.RELATED_BRANCH_DATA, true)}
                position={{ lat: parseFloat(item.BranchLatitude), lng: parseFloat(item.BranchLongitude) }}
                icon={{
                    url: icon
                }}>
                {
                    item.showInfo &&
                    (
                        <InfoWindow onDomReady={onDomReady}>
                            <Layout>
                                <div className={styles['headers']}>
                                    {
                                        <div className={styles['ca-imgs']}>
                                            <Popover placement="left" content={
                                                <div className={styles['marker-tm-picture']}>
                                                    <img className={styles['ca-big-img']} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${item.TM_Code}`} />
                                                    <span>{`${item.TM_Name}`}</span>
                                                    <span>{`${work_date_format}`}</span>
                                                    <span>{`${item.TM_Tel}`}</span>
                                                </div>
                                            } >
                                                <img src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${item.TM_Code}`} />
                                            </Popover>
                                        </div>
                                    }
                                    <span className={styles['title-img']}>
                                        {`${item.BranchName}`}
                                    </span>
                                    <Icon
                                        onClick={() => props.setOpenBranchMarker(item, props.RELATED_BRANCH_DATA, false)}
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
                                                        <span>{`From ${current_branch.Market} Markets (Branch Open : ${current_branch.OpenDate ? moment(current_branch.OpenDate).format("MMM-YY") : 'unknow'})`}</span>
                                                    </div>
                                                    <span>
                                                        {/* <Icon type="phone" style={{ marginRight: '5px' }} /> */}
                                                        <i className={`flaticon flaticon-phone21 ${styles['marg_left_none']}`} />
                                                        <span>{`${item.BranchTel}`} </span>
                                                        {
                                                            current_branch.BranchType == 'K' ?
                                                                `Distances From `
                                                                :``
                                                                //`${related_branch.length > 0 ? `${related_branch.length} kiosk` : ''} `
                                                        }
                                                        {
                                                            getLinkDetail(related_branch, props, item.BRANCH_RADIUS)
                                                        }
                                                    </span>
                                                    <div className={styles['note-icon']}>
                                                        <Tooltip title='Note' placement="bottom">
                                                            <FontAwesome name='comments' onClick={() => handleShowModal(item)} />
                                                        </Tooltip>
                                                    </div>
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
                                        {
                                            item.NOTE.length > 0 &&
                                            item.NOTE[0].IsDefault &&
                                            <div className={styles['note-container']}>
                                                <span>Note *</span>
                                                <span>{item.NOTE[0].Note}</span>
                                            </div>
                                        }
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
    const { NANO_FILTER_CRITERIA, RELATED_BRANCH_DATA } = props

    if (_.filter(NANO_FILTER_CRITERIA.MarkerOptions, o => o == 'RA').length > 0) {
        return RELATED_BRANCH_DATA.map((item, index) => {
            const radius = circle.map(c => (
                <Circle
                    center={{ lat: parseFloat(item.BranchLatitude), lng: parseFloat(item.BranchLongitude) }}
                    radius={c.radius}
                    options={{ ...c.options }}
                />
            ))

            if (item.BranchType == "K") {
                if (_.isEmpty(_.find(props.RELATED_BRANCH_DATA, { BranchCode: item.OriginBranchCode }))) {
                    return radius
                }
            }
            else {
                return radius
            }
        })
    }
}

const getCAExitingMarker = (props) => {

    const { NANO_FILTER_CRITERIA, RELATED_EXITING_MARKET_DATA } = props

    return RELATED_EXITING_MARKET_DATA.map((item, index) => {
        return (
            <OverlayView
                key={index}
                position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={getPixelPositionOffset}>
                <div className={styles['ca-marker-img-container']}>
                    <img src={pinpao} />
                    <img className={styles['ca-marker-img']} src={'http://172.17.9.94/newservices/LBServices.svc/employee/image/57345'} />

                </div>
            </OverlayView>
        )
    })
}

const getCAPicture = (props, marketCode) => {
    let ca = []
    if (_.isEmpty(props.SELECTED_CA_MAP)) {
        _.mapKeys(_.groupBy(_.filter(props.RELATED_CA_IN_MARKET_DATA, { MarketCode: marketCode }), 'CA_Code'), (value, key) => {
            ca.push(key)
        })
    }
    else {
        ca.push(props.SELECTED_CA_MAP)
    }

    return ca
}

const getExitingMarkerMenu = props => {
    return props.RELATED_EXITING_MARKET_DATA.map((item, index) => {
        if (item.showMenu) {
            return (
                <OverlayView
                    key={index}
                    position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    getPixelPositionOffset={getPixelPositionOffset}>
                    <div className={styles['overlayView']}>
                        <div className={styles['circle-menu']}>
                            <input type="checkbox" className={styles["cn-button"]} id={`cn-button-exiting_${index}`} checked={true} />
                            <label className={styles["cn-button-open"]} htmlFor={`cn-button-exiting_${index}`} onClick={() => props.setOpenExitingMarketMarkerMenu(item, props.RELATED_EXITING_MARKET_DATA, false)}>
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
                                    <li onClick={() => props.setOpenExitingMarketMarker(item, props.RELATED_EXITING_MARKET_DATA, true)}><Tooltip title="Market Penatation"><label htmlFor={`cn-button-exiting_${index}`}><span><FontAwesome name="table" /></span></label></Tooltip></li>
                                    <li><Tooltip title="Portfolio Quality"><label htmlFor={`cn-button-exiting_${index}`}><span><FontAwesome name="dollar" /></span></label></Tooltip></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </OverlayView>
            )
        }
    })
}

const getExitingMarker = (props, handleShowModal) => {
    const { NANO_FILTER_CRITERIA, RELATED_EXITING_MARKET_DATA } = props
    let icon = icon_Market

    return RELATED_EXITING_MARKET_DATA.map((item, index) => {
        if (item.showMenu) {
            icon = '_blanks'
        }
        if (NANO_FILTER_CRITERIA.CAName && !item.showMenu && !item.showInfo) {
            return (
                <OverlayView
                    key={index}
                    position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    getPixelPositionOffset={getPixelPositionOffset}>
                    <Tooltip title={item.MarketName}>
                        <div className={styles['ca-marker-img-container']} onClick={() => props.setOpenExitingMarketMarkerMenu(item, RELATED_EXITING_MARKET_DATA, true)}>
                            {
                                getCAPicture(props, item.MarketCode).map(ca => {
                                    return (<img className={styles['ca-marker-img']} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${ca}`} />)
                                })
                            }
                        </div>
                    </Tooltip>
                </OverlayView>
            )
        }
        else {
            return (
                <Marker
                    key={index}
                    title={item.MarketName}
                    onClick={() => props.setOpenExitingMarketMarkerMenu(item, RELATED_EXITING_MARKET_DATA, true)}
                    position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                    icon={{
                        url: icon
                    }}>
                    {
                        item.showInfo &&
                        (
                            <InfoWindow
                                title={item.MarketName}
                                onDomReady={onDomReady}>
                                <Layout>
                                    <div className={styles['headers']}>
                                        <Icon
                                            className="trigger"
                                            type='pie-chart' />
                                        <span>
                                            {`(${item.MarketCode}) ${item.MarketName} (${item.BranchType})`}
                                        </span>
                                        <Icon
                                            onClick={() => props.setOpenExitingMarketMarker(item, RELATED_EXITING_MARKET_DATA, false)}
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
                                                            <span>{`Distance From `}{<span><a onClick={() => props.setOpenBranchMarker(item, props.RELATED_BRANCH_DATA, true)}>{item.BranchName}</a></span>}{` ${parseFloat(item.Radius).toFixed(1)}Km.`}</span>
                                                        </div>
                                                        <span>
                                                            {` ${'Market Category'} working hour 07:00 - 19:00 (${getFormatShortDay('1,3,4,5')}) `}
                                                        </span>
                                                        <div className={styles['note-icon']}>
                                                            <Tooltip title='Note' placement="bottom">
                                                                <FontAwesome name='comments' onClick={() => handleShowModal(item)} />
                                                            </Tooltip>
                                                        </div>
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
                                            {
                                                item.NOTE.length > 0 &&
                                                item.NOTE[0].IsDefault &&
                                                <div className={styles['note-container']}>
                                                    <span>Note *</span>
                                                    <span>{item.NOTE[0].Note}</span>
                                                </div>
                                            }
                                        </div>
                                    </Layout>
                                </Layout>
                            </InfoWindow>
                        )
                    }
                </Marker>
            )
        }
    })

}

const getMarketPictureMarker = props => {
    const { RELATED_EXITING_MARKET_DATA } = props

    if (RELATED_EXITING_MARKET_DATA.length > 0) {
        return [RELATED_EXITING_MARKET_DATA[0]].map((item, index) => {
            return (
                <Marker
                    key={index}
                    title={item.MarketName}
                    position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                    icon={{
                        url: ''
                    }}>
                    <InfoWindow
                        title={item.MarketName}
                        onDomReady={onDomReady}>
                        <Layout>
                            <div className={styles['headers']}>
                                <Icon
                                    className="trigger"
                                    type='pie-chart' />
                                <span>
                                    {`(${item.MarketCode}) ${item.MarketName} (${item.BranchType})`}
                                </span>
                                <Icon
                                    onClick={() => props.setOpenExitingMarketMarker(item, RELATED_EXITING_MARKET_DATA, false)}
                                    className="trigger"
                                    type='close' />
                            </div>
                            <Layout style={{ backgroundColor: '#FFF', padding: '10px' }}>
                                <div className={styles['detail-container-picture']}>
                                    <div>
                                        <h1>Hello</h1>
                                    </div>
                                    <div>
                                        <StreetViewMap
                                            key={index}
                                            item={item}
                                            containerElement={<div style={{ height: `100%` }} />}
                                            mapElement={<div style={{ height: `100%` }} />}
                                        />
                                    </div>
                                </div>
                            </Layout>
                        </Layout>
                    </InfoWindow>
                </Marker>
            )
        })
    }
}

const getComplititorMarker = props => {
    const { RELATED_COMPLITITOR_DATA } = props
    return RELATED_COMPLITITOR_DATA.map((item, index) => {
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

class Map extends Component {

    state = {
        showAddNoteModal: false,
        modalSelectData: null
    }

    handleShowModal = (item) => {
        this.setState({ showAddNoteModal: true, modalSelectData: item })
    }

    handleCancel = () => {
        this.setState({ showAddNoteModal: false, modalSelectData: null })
    }

    render() {
        const props = this.props
        const { modalSelectData } = this.state

        return (
            <div>
                {
                    modalSelectData &&
                    <Modal className={styles['modalComplititor']}
                        title={(<div className={styles['modal-note-header']}><Icon type="edit" /><span>{`Edit Note (${modalSelectData.MarketName || modalSelectData.BranchName})`}</span></div>)}
                        visible={this.state.showAddNoteModal}
                        onOk={false}
                        onCancel={this.handleCancel}
                        footer={null}
                    >
                        {
                            <InsertNote modalSelectData={modalSelectData} />
                        }
                    </Modal>
                }
                <GoogleMap
                    defaultZoom={8}
                    defaultCenter={options.center}
                    ref={(map) => (handleBounds(props, map))}>
                    {
                        getBranchMarkerMenu(props)
                    }
                    {
                        getBranchMarker(props, this.handleShowModal)
                    }
                    {
                        getBranchMarkerCircle(props)
                    }
                    {
                        getExitingMarkerMenu(props)
                    }
                    {
                        getExitingMarker(props, this.handleShowModal)
                    }
                    {
                        /*getCAExitingMarker(props)*/
                    }
                    {
                        getComplititorMarker(props)
                    }
                    {
                        //getMarketPictureMarker(props)
                    }
                    {
                        props.RELATED_TARGET_MARKET_DATA &&
                        props.RELATED_TARGET_MARKET_DATA.map((item, index) => {
                            return (
                                <Marker
                                    key={index}
                                    onClick={() => props.setOpenTargetMarketMarker(item, props.RELATED_TARGET_MARKET_DATA, true)}
                                    position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                                    title={item.MarketName}
                                    icon={{
                                        url: icon_Target
                                    }}>
                                    {
                                        item.showInfo &&
                                        (
                                            <InfoWindow onDomReady={onDomReady}>
                                                <Layout>
                                                    <div className={styles['headers']}>
                                                        <Icon
                                                            className="trigger"
                                                            type='pie-chart' />
                                                        <span>
                                                            {`${item.MarketName}`}
                                                        </span>
                                                        <Icon
                                                            onClick={() => props.setOpenTargetMarketMarker(item, props.RELATED_TARGET_MARKET_DATA, false)}
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
                </GoogleMap>
            </div>
        )
    }
}

const wrapMap = withGoogleMap(Map)

export default connect(
    (state) => ({
        NANO_FILTER_CRITERIA: state.NANO_FILTER_CRITERIA,
        SELECTED_CA_MAP: state.SELECTED_CA_MAP,
        DO_BOUNDS_MAP: state.DO_BOUNDS_MAP,
        RELATED_BRANCH_DATA: state.RELATED_BRANCH_DATA,
        RELATED_EXITING_MARKET_DATA: state.RELATED_EXITING_MARKET_DATA,
        RELATED_TARGET_MARKET_DATA: state.RELATED_TARGET_MARKET_DATA,
        RELATED_COMPLITITOR_DATA: state.RELATED_COMPLITITOR_DATA,
        RELATED_CA_IN_MARKET_DATA: state.RELATED_CA_IN_MARKET_DATA
    }), {
        setOpenBranchMarker: setOpenBranchMarker,
        setOpenBranchMarkerMenu: setOpenBranchMarkerMenu,
        setOpenExitingMarketMarker: setOpenExitingMarketMarker,
        setOpenExitingMarketMarkerMenu: setOpenExitingMarketMarkerMenu,
        setOpenTargetMarketMarker: setOpenTargetMarketMarker
    })(wrapMap)
