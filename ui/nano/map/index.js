import React, { Component } from 'react'
import { connect } from 'react-redux'
import { renderToString } from 'react-dom/server'

import { withGoogleMap, GoogleMap, Marker, Circle, InfoWindow, OverlayView, Polyline, StreetViewPanorama, DirectionsRenderer, TrafficLayer, InfoBox } from "react-google-maps"

import DrawingManager from 'react-google-maps/lib/drawing/DrawingManager'

import { MAP } from 'react-google-maps/lib/constants';

import { Layout, Icon, Button, Table, Tooltip, Modal, Form, Row, Col, Popover, Carousel, Tabs, Pagination, Card } from 'antd';
import FontAwesome from 'react-fontawesome'
import {
    Sector,
    Cell,
    PieChart,
    Pie as Pies,
    Tooltip as Tooltips,
    BarChart,
    Bar as Bars,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    Area,
    Line as Lines,
    Scatter,
    ComposedChart,
    ReferenceDot
} from 'recharts'
import { Doughnut, HorizontalBar, Bar, Pie, Line } from 'react-chartjs-2'
import moment from 'moment'
import Scrollbar from 'react-smooth-scrollbar';

import InsertNote from './insertnote'
import StreetViewMap from './streetview'
import PortfolioChart from './portfolio_chart'
import SaleSummaryChart from './sale_summary_chart'
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
import icon_Plan_Branch_Nano from '../../../image/i_Nano.png'
import resize_radius from '../../../image/resize-radius.png'
import icon_destination_a from '../../../image/icon_destination_a.png'
import icon_destination_b from '../../../image/icon_destination_b.png'
import icon_destination_a2 from '../../../image/icon_destination_a2.png'
import icon_destination_b2 from '../../../image/icon_destination_b2.png'

import {
    setOpenBranchMarker,
    setOpenBranchMarkerMenu,
    setOpenBranchImageMarker,
    setOpenBranchPortfolioMarker,
    setOpenBranchSaleSummaryMarker,
    setOpenExitingMarketMarker,
    setOpenExitingMarketMarkerMenu,
    setOpenTargetMarketMarker,
    setOpenExitingMarketImageMarker,
    setOpenExitingMarketShopLayoutMarker,
    setOpenExitingMarketSaleSummaryMarker,
    setOpenExitingMarketPortfolioMarker,
    setOpenPlanOpenBranch,
    insertUpdateMarkerNote,
    setLocationDirectionMarker
} from '../actions/nanomaster'

import styles from './index.scss'

const { Header } = Layout
const TabPane = Tabs.TabPane;

const onDomReady = (isImage) => {
    let iwOuter = $('.gm-style-iw');
    let iwBackground = iwOuter.prev();
    iwBackground.children(':nth-child(2)').css({ 'display': 'none' });
    iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
    iwBackground.children(':nth-child(3)').find('div').children().css({ 'box-shadow': '0 1px 6px rgba(72, 181, 233, 0.6)', 'z-index': '1' });

    if (isImage) {
        iwOuter.addClass(styles['info-image'])
    }

    if (isImage == 'chart') {
        iwOuter.addClass(styles['info-chart'])
    }
    else if (isImage == 'sale') {
        iwOuter.addClass(styles['sale-chart'])
    }

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
                RELATED_COMPLITITOR_DATA,
                RELATED_PLAN_OPEN_BRANCH_DATA
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

            RELATED_PLAN_OPEN_BRANCH_DATA.map((item, index) => {
                let marker = new google.maps.Marker({
                    position: { lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }
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
                Detail: 'Total Cust',
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
            width: '9%',
            className: `${styles['header-hide']} ${styles['align-right-hightlight']} ${styles['align-center']} sm-padding`,
            render: (text, record, index) => {
                return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `` : `${text}`}</span>
            }
        }, {
            dataIndex: 'OS',
            width: '9%',
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
        width: '15%',
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
        width: '15%',
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
                EmpCode: value[0].CAID,
                StartWork: value[0].StartWork,
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
    },
    render: (text, record, index) => {
        if (record.CAID != 99999 && !_.isEmpty(record.EmpCode)) {
            const start_work_date = !_.isEmpty(record.StartWork) ? moment.duration(moment(new Date()).diff(moment(record.StartWork)))._data : ''
            const work_date_format = `Work Period : ${start_work_date.years}.${start_work_date.months}.${start_work_date.days}`
            return (
                <Popover placement="top" content={
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <img className={styles['ca-big-img']} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${record.EmpCode}`} />
                        <span>{`${record.Name}`} {`(${'NickName'})`}</span>
                        <span>{`อายุงาน ${work_date_format}`}</span>
                        <span>{`${'Mobile'}`}</span>
                    </div>
                } >
                    <span className={styles['text-ellipsis-map']}>{text}</span>
                </Popover>
            )
        }
        else {
            return (
                <Tooltip title={text} placement="top" >
                    <span className={styles['text-ellipsis-map']}>{text}</span>
                </Tooltip>
            )
        }
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
        title: (<div className={styles['div-center']}><span>Cust</span></div>),
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
        title: (<div className={styles['div-center']}><span>Cust</span></div>),
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
        title: (<div className={styles['div-center']}><span>Cust</span></div>),
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
        title: (<div className={styles['div-center']}><span>Cust</span></div>),
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
        title: (<div className={styles['div-center']}><span>Cust</span></div>),
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

const getLinkDetail = (obj, props, branch_radius, current, handleDirection) => {
    return obj.map((m, i) => {
        const item = _.find(props.RELATED_BRANCH_DATA, { BranchCode: m.BranchCode })
        const radius = parseFloat(_.find(branch_radius, { BranchCode: m.BranchCode }).Radius).toFixed(1)
        if (item) {
            return (
                <span>
                    <a onClick={() => props.setOpenBranchMarker(item, props.RELATED_BRANCH_DATA, true)}>{m.BranchName}</a>{
                        <Tooltip title={`Direction To ${item.BranchName ? item.BranchName : ''}`} placement="top">
                            <FontAwesome className={styles['icon-direction']}
                                name="road"
                                onClick={() => handleDirection(
                                    { name: current.BranchName, Latitude: current.BranchLatitude, Longitude: current.BranchLongitude },
                                    { name: item.BranchName, Latitude: item.BranchLatitude, Longitude: item.BranchLongitude })} />
                        </Tooltip>
                    } {radius}Km. {(i + 1) < obj.length && ' / '}
                </span>)
        }
        else {
            return null
        }
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
                let branchCodeCriteria = item.BranchCode

                switch (item.BranchType) {
                    case 'K':
                        icon = icon_Keyos
                        break;
                    case 'P':
                        icon = icon_Nano
                        branchCodeCriteria = _.filter(RELATED_BRANCH_DATA, { OriginBranchCode: item.BranchCode }).map(i => i.BranchCode).join(',')
                        break;
                }

                const criteria = {
                    BranchCode: branchCodeCriteria,
                    MktCode: null,
                    CAID: null,
                    EmpCode: null
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
                                        <li onClick={() => props.setOpenBranchImageMarker(item, props.RELATED_BRANCH_DATA, true)}><Tooltip title="Market Picture"><label htmlFor={`cn-button_${index}`}><span><FontAwesome name="picture-o" /></span></label></Tooltip></li>
                                        <li><Tooltip title="Shop Layout"><label htmlFor={`cn-button_${index}`}><span><FontAwesome name="map-marker" /></span></label></Tooltip></li>
                                        <li onClick={() => props.setOpenBranchSaleSummaryMarker(item, props.RELATED_BRANCH_DATA, true, criteria)}><Tooltip title="Sale Summary"><label htmlFor={`cn-button_${index}`}><span><FontAwesome name="line-chart" /></span></label></Tooltip></li>
                                        <li onClick={() => props.setOpenBranchMarker(item, props.RELATED_BRANCH_DATA, true)}><Tooltip title="Market Penatation"><label htmlFor={`cn-button_${index}`}><span><FontAwesome name="table" /></span></label></Tooltip></li>
                                        <li onClick={() => props.setOpenBranchPortfolioMarker(item, props.RELATED_BRANCH_DATA, true, criteria)}><Tooltip title="Portfolio Quality"><label htmlFor={`cn-button_${index}`}><span><FontAwesome name="dollar" /></span></label></Tooltip></li>
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

const getBranchMarker = (props, handleShowModal, handleDirection) => {

    const { NANO_FILTER_CRITERIA, RELATED_BRANCH_DATA } = props

    // return _.filter(RELATED_BRANCH_DATA, {showInfo: true }).map((item, index) => {
    if (_.filter(NANO_FILTER_CRITERIA.MarkerOptions, o => o == 'MR').length > 0) {
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
            item.work_date_format = work_date_format

            return (
                <div>
                    {
                        _.filter(NANO_FILTER_CRITERIA.MarkerOptions, o => o == 'SBVOL').length > 0 &&
                        item.Branch &&
                        <OverlayView
                            position={{ lat: parseFloat(item.BranchLatitude), lng: parseFloat(item.BranchLongitude) }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                            getPixelPositionOffset={getPixelPositionOffset}>
                            <div className={styles['sb-vol-info']}>
                                <span>{item.Branch}</span>
                                <span>{parseFloat(item.Actual).toFixed(0)} Mb ({parseFloat(item.Achieve).toFixed(0)}%)</span>
                                <span>{item.Opening}</span>
                            </div>
                        </OverlayView>
                    }
                    <Marker
                        key={index}
                        title={item.BranchName}
                        onClick={() => props.setOpenBranchMarkerMenu(item, props.RELATED_BRANCH_DATA, true)}
                        position={{ lat: parseFloat(item.BranchLatitude), lng: parseFloat(item.BranchLongitude) }}
                        icon={{
                            url: icon
                        }}>
                        {
                            item.showImage &&
                            (<BranchImage item={item} index={index} ownProps={props} />)
                        }
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
                                                            <span>{`${item.TM_Name}`} {`(${item.TM_NickName})`}</span>
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
                                                                <span style={{ position: 'relative' }}>{`${current_branch.MarketShop} Shop `}<span style={{ position: 'absolute', color: '#000', left: '0', textAlign: 'right', width: '100%', fontSize: '8px' }}></span></span>
                                                                <span>{`From ${current_branch.Market} Markets (Branch Open : ${current_branch.OpenDate ? moment(current_branch.OpenDate).format("MMM-YY") : 'unknow'})`}</span>
                                                            </div>
                                                            <span>
                                                                {/* <Icon type="phone" style={{ marginRight: '5px' }} /> */}
                                                                <i className={`flaticon flaticon-phone21 ${styles['marg_left_none']}`} />
                                                                <span>{`${item.BranchTel}`} </span>
                                                                {
                                                                    current_branch.BranchType == 'K' ?
                                                                        `Distances From `
                                                                        : ``
                                                                    //`${related_branch.length > 0 ? `${related_branch.length} kiosk` : ''} `
                                                                }
                                                                {
                                                                    getLinkDetail(related_branch, props, item.BRANCH_RADIUS, item, handleDirection)
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
                        {
                            item.showPortfolio &&
                            <InfoWindow
                                title={item.BranchName}
                                onDomReady={() => onDomReady('chart')}>
                                <PortfolioChart item={item} ON_CLOSE_MARKER={() => props.setOpenBranchMarker(item, props.RELATED_BRANCH_DATA, false)} />
                            </InfoWindow>
                        }
                        {
                            item.showSaleSummary &&
                            <InfoWindow
                                title={item.MarketName}
                                onDomReady={() => onDomReady('sale')}>
                                <SaleSummaryChart item={item} ON_CLOSE_MARKER={() => props.setOpenBranchMarker(item, RELATED_BRANCH_DATA, false)} />
                            </InfoWindow>
                        }
                    </Marker>
                </div >
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

const getCAPicture = (props, marketCode) => {
    let ca = []
    const filter = _.filter(props.RELATED_CA_IN_MARKET_DATA, f => parseInt(f.OS) > 0)
    if (_.isEmpty(props.SELECTED_CA_MAP)) {
        _.mapKeys(_.groupBy(_.filter(filter, { MarketCode: marketCode }), 'CA_Code'), (value, key) => {
            ca.push(key)
        })
    }
    else {
        if (props.SELECTED_CA_MAP.length > 1) {
            _.mapKeys(_.groupBy(_.filter(filter, o => o.MarketCode == marketCode && !_.isEmpty(_.find(props.SELECTED_CA_MAP, f => f == o.CA_Code))), 'CA_Code'), (value, key) => {
                ca.push(key)
            })
        }
        else {
            ca.push(props.SELECTED_CA_MAP)
        }
    }

    return ca
}

const in_array = (needle, haystack, argStrict) => {
    var key = '', strict = !!argStrict;
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true
            }
        }
    }

    return false

}

const getExitingMarkerMenu = props => {
    const { NANO_FILTER_CRITERIA } = props
    if (_.filter(NANO_FILTER_CRITERIA.MarkerOptions, o => o == 'MR').length > 0) {
        return props.RELATED_EXITING_MARKET_DATA.map((item, index) => {
            if (item.showMenu) {

                const criteria = {
                    BranchCode: null,
                    MktCode: item.MarketCode,
                    CAID: null,
                    EmpCode: null
                }

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
                                        <li onClick={() => props.setOpenExitingMarketImageMarker(item, props.RELATED_EXITING_MARKET_DATA, true)}><Tooltip title="Market Picture"><label htmlFor={`cn-button-exiting_${index}`}><span><FontAwesome name="picture-o" /></span></label></Tooltip></li>
                                        <li onClick={() => props.setOpenExitingMarketShopLayoutMarker(item, props.RELATED_EXITING_MARKET_DATA, true)}><Tooltip title="Shop Layout"><label htmlFor={`cn-button-exiting_${index}`}><span><FontAwesome name="map-marker" /></span></label></Tooltip></li>
                                        <li onClick={() => props.setOpenExitingMarketSaleSummaryMarker(item, props.RELATED_EXITING_MARKET_DATA, true, criteria)}><Tooltip title="Sale Summary"><label htmlFor={`cn-button-exiting_${index}`}><span><FontAwesome name="line-chart" /></span></label></Tooltip></li>
                                        <li onClick={() => props.setOpenExitingMarketMarker(item, props.RELATED_EXITING_MARKET_DATA, true)}><Tooltip title="Market Penatation"><label htmlFor={`cn-button-exiting_${index}`}><span><FontAwesome name="table" /></span></label></Tooltip></li>
                                        <li onClick={() => props.setOpenExitingMarketPortfolioMarker(item, props.RELATED_EXITING_MARKET_DATA, true, criteria)}><Tooltip title="Portfolio Quality"><label htmlFor={`cn-button-exiting_${index}`}><span><FontAwesome name="dollar" /></span></label></Tooltip></li>
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

const getExitingMarker = (props, handleShowModal, handleDirection) => {
    const { NANO_FILTER_CRITERIA, RELATED_EXITING_MARKET_DATA } = props
    let icon = icon_Market
    const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) => new Date(`${new Date().getFullYear()}-${item}-1`))
    const date = new Date()
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    let workingDay = []

    for (let i = 1; i <= lastDay.getDate(); i++) {
        let day = new Date(date.getFullYear(), date.getMonth(), i)
        if (day.getDay() != 0 && day.getDay() != 6) {
            workingDay.push(day)
        }
    }

    if (_.filter(NANO_FILTER_CRITERIA.MarkerOptions, o => o == 'MR').length > 0) {
        return RELATED_EXITING_MARKET_DATA.map((item, index) => {
            if (item.showMenu) {
                icon = '_blanks'
            }
            if (NANO_FILTER_CRITERIA.CAName && !item.showMenu && !item.showInfo && !item.showImage && !item.showPortfolio && !item.showSaleSummary) {
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
                        onClick={() => {
                            if (!item.showInfo && !item.showImage)
                                props.setOpenExitingMarketMarkerMenu(item, RELATED_EXITING_MARKET_DATA, true)
                        }}
                        position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                        icon={{
                            url: icon
                        }}>
                        {
                            item.showImage &&
                            (
                                <MarketImage item={item} index={index} ownProps={props} />
                            )
                        }
                        {
                            item.showShopLayout &&
                            <InfoWindow
                                title={item.MarketName}
                                onDomReady={onDomReady}>
                                <Layout>
                                    <div className={styles['headers']}>
                                        <FontAwesome className="trigger" name="map-marker" />
                                        <span>
                                            {`(${item.MarketCode}) ${item.MarketName} (${item.BranchType})`}
                                        </span>
                                        <Icon
                                            onClick={() => props.setOpenExitingMarketMarker(item, RELATED_EXITING_MARKET_DATA, false)}
                                            className="trigger"
                                            type='close' />
                                    </div>
                                    <Layout style={{ backgroundColor: '#FFF', padding: '10px' }}>
                                    </Layout>
                                </Layout>
                            </InfoWindow>
                        }
                        {
                            item.showSaleSummary &&
                            <InfoWindow
                                title={item.MarketName}
                                onDomReady={() => onDomReady('sale')}>
                                <SaleSummaryChart item={item} ON_CLOSE_MARKER={() => props.setOpenExitingMarketMarker(item, RELATED_EXITING_MARKET_DATA, false)} />
                            </InfoWindow>
                        }
                        {
                            item.showPortfolio &&
                            <InfoWindow
                                title={item.MarketName}
                                onDomReady={() => onDomReady('chart')}>
                                <PortfolioChart item={item} ON_CLOSE_MARKER={() => props.setOpenExitingMarketMarker(item, RELATED_EXITING_MARKET_DATA, false)} />
                            </InfoWindow>
                        }
                        {
                            item.showInfo &&
                            (
                                <InfoWindow
                                    title={item.MarketName}
                                    onDomReady={onDomReady}>
                                    <Layout>
                                        <div className={styles['headers']}>
                                            <FontAwesome className="trigger" name='table' />
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
                                                                <span style={{ position: 'relative' }}>{`${item.MarketShop} Shop `}<span style={{ position: 'absolute', color: '#000', left: '0', textAlign: 'right', width: '100%', fontSize: '8px' }}></span></span>
                                                                <span>
                                                                    {`Distance `}
                                                                    {<span><a onClick={() => props.setOpenBranchMarker(item, props.RELATED_BRANCH_DATA, true)}>{item.BranchName}</a></span>}
                                                                    {
                                                                        <Tooltip title={`Direction To ${item.BranchName}`} placement="top">
                                                                            <FontAwesome className={styles['icon-direction']}
                                                                                name="road"
                                                                                onClick={() => handleDirection(
                                                                                    { name: item.BranchName, Latitude: item.BranchLatitude, Longitude: item.BranchLongitude },
                                                                                    { name: item.MarketName, Latitude: item.Latitude, Longitude: item.Longitude }
                                                                                )} />
                                                                        </Tooltip>
                                                                    }
                                                                    {` ${parseFloat(item.Radius).toFixed(1)}Km.`}
                                                                    {
                                                                        (!in_array(item.BranchType, ['P', 'L'])) && ` (Br ${parseFloat(item.RadiusToPure).toFixed(1)}Km)`
                                                                    }
                                                                    {
                                                                        <span>
                                                                            {` / Open ${item.TelsCreateDate ? moment(item.TelsCreateDate).format("MMM-YY") : 'unknow'}`}
                                                                        </span>
                                                                    }
                                                                </span>
                                                            </div>
                                                            <Tooltip title={` ${item.MarketType} Work Hour ${item.OpenTime} (${item.MarketOpenDay}) `} placement="top">
                                                                <span className={styles['text-ellipsis-detail']}>
                                                                    {` ${item.MarketType} Work Hour ${item.OpenTime} (${item.MarketOpenDay}) `}
                                                                </span>
                                                            </Tooltip>
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
}

const distanceBetweenPoints = (p1, p2) => {
    if (!p1 || !p2) {
        return 0;
    }

    var R = 6371; // Radius of the Earth in km
    var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
    var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

const getBranchDrableCircle = (props) => {

    const { NANO_FILTER_CRITERIA, RELATED_BRANCH_DATA } = props

    return RELATED_BRANCH_DATA.map((item, index) => {

        const circle = <DragRadius
            item={item}
            index={index}
            NANO_FILTER_CRITERIA={NANO_FILTER_CRITERIA} />

        if (item.BranchType == "K") {
            if (_.isEmpty(_.find(props.RELATED_BRANCH_DATA, { BranchCode: item.OriginBranchCode }))) {
                return circle
            }
        }
        else {
            return circle
        }
    })
}

class DragRadius extends Component {
    state = {
        const_radius: 15000,
        defalt_lng: null,
        default_radius: 15000,
        ref_circle: null,
        on_drag: false,
        drag_location: null
    }

    onDrag = (e) => {
        const radius = distanceBetweenPoints(this.state.ref_circle.getCenter(), e.latLng) * 1000

        this.setState({ default_radius: radius, on_drag: true, drag_location: e.latLng })
    }

    onDragEnd = (e) => {
        const radius = distanceBetweenPoints(this.state.ref_circle.getCenter(), e.latLng) * 1000

        this.setState({ default_radius: radius, on_drag: false, drag_location: e.latLng })
    }

    restoreToDefault = () => {
        this.setState({ default_radius: this.state.const_radius, on_drag: false })
    }

    componentDidMount() {
        if (!_.isEmpty(this.refs.circle))
            this.setState({ ref_circle: this.refs.circle, defalt_lng: parseFloat(this.refs.circle.getBounds().getNorthEast().lng()) })
    }

    render() {
        const { item, index, NANO_FILTER_CRITERIA } = this.props
        let icon = icon_Plan_Branch_Nano

        let bgColor = 'rgba(0, 153, 255, 0.63)'
        switch (item.BranchType) {
            case "K":
                bgColor = 'rgba(255, 101, 0, 0.6)'
                break;
        }

        return (
            <div>
                {
                    _.filter(NANO_FILTER_CRITERIA.MarkerOptions, o => o == 'RA').length > 0 &&
                    <Circle
                        center={{ lat: parseFloat(item.BranchLatitude), lng: parseFloat(item.BranchLongitude) }}
                        radius={this.state.default_radius}
                        ref='circle'
                        options={{
                            strokeColor: this.state.on_drag ? '#656565' : '#F33A00',
                            strokeOpacity: 1,
                            strokeWeight: 2,
                            fillColor: '#656565',
                            fillOpacity: this.state.on_drag ? 0.1 : 0
                        }}>
                    </Circle>
                }
                {
                    _.filter(NANO_FILTER_CRITERIA.MarkerOptions, o => o == 'RA').length > 0 &&
                    this.refs.circle &&
                    <Marker
                        draggable={true}
                        onDrag={this.onDrag}
                        icon={{
                            url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png",
                            size: new google.maps.Size(7, 7),
                            anchor: new google.maps.Point(4, 4)
                        }}
                        title='Resize'
                        position={{
                            lat: this.state.on_drag ? parseFloat(this.state.drag_location.lat()) : parseFloat(item.BranchLatitude),
                            lng: this.state.on_drag ? parseFloat(this.state.drag_location.lng()) : this.state.defalt_lng
                        }}
                        key={`C_${index}`}
                    />
                }
                {
                    this.state.on_drag &&
                    <OverlayView
                        position={{
                            lat: this.state.on_drag ? parseFloat(this.state.drag_location.lat()) : parseFloat(item.BranchLatitude),
                            lng: this.state.on_drag ? parseFloat(this.state.drag_location.lng()) : this.state.defalt_lng
                        }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={getPixelPositionOffset}>
                        <div className={styles['radius-info']} style={{ color: '#5f5f5f' }} >
                            <span>{parseFloat(this.state.default_radius / 1000).toFixed(1)}Km.
                                <Tooltip title="Reset">
                                    <FontAwesome name="refresh" style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={this.restoreToDefault} />
                                </Tooltip>
                            </span>
                        </div>
                    </OverlayView>
                }
            </div>
        )
    }
}

class PlanOpenBranchMarker extends Component {

    state = {
        default_radius: 5000,
        ref_circle: null,
        on_drag: false,
        drag_location: null
    }

    onDrag = (e) => {
        const radius = distanceBetweenPoints(this.state.ref_circle.getCenter(), e.latLng) * 1000

        this.setState({ default_radius: radius, on_drag: true, drag_location: e.latLng })
    }

    onDragEnd = (e) => {
        const radius = distanceBetweenPoints(this.state.ref_circle.getCenter(), e.latLng) * 1000

        this.setState({ default_radius: radius, on_drag: false, drag_location: e.latLng })
    }

    componentDidMount() {
        this.setState({ ref_circle: this.refs.circle })
    }

    render() {
        const { item, index, setOpenPlanOpenBranch, RELATED_PLAN_OPEN_BRANCH_DATA, NANO_FILTER_CRITERIA } = this.props
        let icon = icon_Plan_Branch_Nano

        let bgColor = 'rgba(0, 153, 255, 0.63)'
        switch (item.BranchType) {
            case "K":
                bgColor = 'rgba(255, 101, 0, 0.6)'
                break;
        }

        return (
            <div>
                {
                    <Marker
                        key={index}
                        title={item.BranchName}
                        onClick={() => setOpenPlanOpenBranch(item, RELATED_PLAN_OPEN_BRANCH_DATA, true)}
                        position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                        icon={{
                            url: '_'
                        }}>
                    </Marker>
                }
                {
                    _.filter(NANO_FILTER_CRITERIA.MarkerOptions, o => o == 'RA').length > 0 &&
                    <Circle
                        center={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                        radius={5000}
                        ref='circle'
                        options={{
                            strokeColor: '#656565',
                            strokeOpacity: 1,
                            strokeWeight: 2,
                            fillColor: '#656565',
                            fillOpacity: 0.2
                        }}>
                    </Circle>
                }
                {
                    _.filter(NANO_FILTER_CRITERIA.MarkerOptions, o => o == 'RA').length > 0 &&
                    <Circle
                        center={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                        radius={this.state.default_radius}
                        options={{
                            strokeColor: '#656565',
                            strokeOpacity: 1,
                            strokeWeight: 2,
                            fillColor: '#656565',
                            fillOpacity: 0.2
                        }}>
                    </Circle>
                }
                {
                    _.filter(NANO_FILTER_CRITERIA.MarkerOptions, o => o == 'RA').length > 0 &&
                    this.state.ref_circle &&
                    <Marker
                        draggable={true}
                        onDrag={this.onDrag}
                        icon={{
                            url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png",
                            size: new google.maps.Size(7, 7),
                            anchor: new google.maps.Point(4, 4)
                        }}
                        title='Resize'
                        position={{
                            lat: this.state.on_drag ? parseFloat(this.state.drag_location.lat()) : parseFloat(item.Latitude),
                            lng: this.state.on_drag ? parseFloat(this.state.drag_location.lng()) : parseFloat(this.state.ref_circle.getBounds().getNorthEast().lng())
                        }}
                        key={`C_${index}`}
                    />
                }
                <OverlayView
                    position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    getPixelPositionOffset={getPixelPositionOffset}>
                    <div className={styles['radius-info']} style={{ backgroundColor: bgColor }}>
                        <span>{item.BranchName}</span>
                        <span>{parseFloat(this.state.default_radius / 1000).toFixed(1)}Km.</span>
                    </div>
                </OverlayView>
                {
                    item.showInfo &&
                    <InfoWindow
                        title={item.MarketName}
                        onDomReady={onDomReady}>
                        <Layout>
                            <div className={styles['headers']}>
                                <FontAwesome className="trigger" name="map-marker" />
                                <span>
                                    {`(${item.BranchName})`}
                                </span>
                                <Icon
                                    onClick={() => setOpenPlanOpenBranch(item, RELATED_PLAN_OPEN_BRANCH_DATA, false)}
                                    className="trigger"
                                    type='close' />
                            </div>
                            <Layout style={{ backgroundColor: '#FFF', padding: '10px' }}>
                            </Layout>
                        </Layout>
                    </InfoWindow>
                }
            </div>
        )
    }
}

const getPlanOpenBranchMarker = (props, handleDirection, test) => {

    const { NANO_FILTER_CRITERIA, RELATED_PLAN_OPEN_BRANCH_DATA, setOpenPlanOpenBranch } = props

    return RELATED_PLAN_OPEN_BRANCH_DATA.map((item, index) => {
        return (
            <PlanOpenBranchMarker
                item={item}
                index={index}
                setOpenPlanOpenBranch={setOpenPlanOpenBranch}
                RELATED_PLAN_OPEN_BRANCH_DATA={RELATED_PLAN_OPEN_BRANCH_DATA}
                NANO_FILTER_CRITERIA={NANO_FILTER_CRITERIA} />
        )
    })
}

class BranchImage extends Component {

    state = {
        branchPage: 1,
        showBranchFullImage: false,
        branchImageIndex: 0
    }

    openImageNewTab = (url) => (window.open(url))

    openBranchFullImage = (index) => {
        this.setState({ showBranchFullImage: !this.state.showBranchFullImage, branchImageIndex: index })
    }

    pageChange = (page, pageSize) => {
        this.setState({ branchPage: page })
    }

    onPrevImage = () => {
        this.setState({ branchImageIndex: this.state.branchImageIndex - 1 })
    }

    onNextImage = () => {
        this.setState({ branchImageIndex: this.state.branchImageIndex + 1 })
    }

    render() {
        const item = this.props.item
        const { BRANCH_IMAGE } = item
        const index = this.props.index
        const { RELATED_BRANCH_DATA, setOpenBranchImageMarker } = this.props.ownProps
        const defaultPageSize = 3

        const start_work_date = !_.isEmpty(item.TM_WorkPeriod) ? moment.duration(moment(new Date()).diff(moment(item.TM_WorkPeriod)))._data : ''
        const work_date_format = `Work Period : ${start_work_date.years}.${start_work_date.months}.${start_work_date.days}`

        return (
            <InfoWindow
                title={item.MarketName}
                onDomReady={() => onDomReady(true)}>
                <Layout style={{ width: '715px' }}>
                    <div className={styles['headers']}>
                        {
                            <div className={styles['ca-imgs']}>
                                <Popover placement="left" content={
                                    <div className={styles['marker-tm-picture']}>
                                        <img className={styles['ca-big-img']} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${item.TM_Code}`} />
                                        <span>{`${item.TM_Name}`} {`(${item.TM_NickName})`}</span>
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
                            onClick={() => setOpenBranchImageMarker(item, RELATED_BRANCH_DATA, false)}
                            className="trigger"
                            type='close' />
                    </div>
                    <Layout className={styles['layout-body-overlay']}>
                        {
                            this.state.showBranchFullImage &&
                            <div className={styles['modal-full-image']}>
                                <Tooltip
                                    title='Close Image'
                                    placement="left">
                                    <Icon type="close"
                                        className={styles['close-full-image']}
                                        onClick={this.openBranchFullImage} />
                                </Tooltip>
                                <div className={styles['full-image']} >
                                    <img
                                        src={BRANCH_IMAGE[this.state.branchImageIndex].Url}
                                        style={{ width: '100%', height: '100%' }} />
                                    <div className={styles['tool-full-image']}>
                                        <div>
                                            <Tooltip
                                                title='Previous'
                                                placement="top">
                                                <Button shape="circle" icon="caret-left" onClick={this.onPrevImage} disabled={this.state.branchImageIndex == 0}></Button>
                                            </Tooltip>
                                            <div>
                                                <span>{`${this.state.branchImageIndex + 1} / ${BRANCH_IMAGE.length}`}</span>
                                                <Tooltip
                                                    title='Full Image'
                                                    placement="top">
                                                    <Icon type="search"
                                                        className={styles['zoom-image']}
                                                        onClick={() => this.openImageNewTab(BRANCH_IMAGE[this.state.branchImageIndex].Url)} />
                                                </Tooltip>
                                            </div>
                                            <Tooltip
                                                title='Next'
                                                placement="top">
                                                <Button shape="circle" icon="caret-right" onClick={this.onNextImage} disabled={this.state.branchImageIndex + 1 == BRANCH_IMAGE.length}>
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div>
                            {
                                BRANCH_IMAGE.length > 0 &&
                                <div>
                                    <div className={styles['layout-pagination']}>
                                        <Pagination
                                            size="small"
                                            style={{ marginTop: '10px' }}
                                            defaultCurrent={this.state.branchPage}
                                            pageSize={defaultPageSize}
                                            total={BRANCH_IMAGE.length}
                                            onChange={this.pageChange}
                                            showTotal={(total) => (`Total ${total} items`)} />
                                    </div>
                                    <div className={styles['detail-container-picture']}>
                                        {
                                            BRANCH_IMAGE
                                                .slice((defaultPageSize * this.state.branchPage) - defaultPageSize, defaultPageSize * this.state.branchPage)
                                                .map((file, i) => {
                                                    let indexOfImage = ((defaultPageSize * this.state.branchPage) - defaultPageSize) + i
                                                    return (
                                                        <div className={styles['layout-child']} onClick={() => this.openBranchFullImage(indexOfImage)}>
                                                            <img src={file.Url} style={{ width: '100%', height: '100%' }} />
                                                        </div>
                                                    )
                                                })
                                        }
                                        <div className={styles['layout-child']}>
                                            <StreetViewMap
                                                key={index}
                                                item={{ Latitude: parseFloat(item.BranchLatitude), Longitude: parseFloat(item.BranchLongitude) }}
                                                containerElement={<div style={{ height: `100%` }} />}
                                                mapElement={<div style={{ height: `100%` }} />}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                BRANCH_IMAGE.length <= 0 &&
                                <div className={styles['image-not-found']}><span><Icon type="frown-o" /> Image not avaliable.</span></div>
                            }
                        </div>
                    </Layout>
                </Layout>
            </InfoWindow>
        )
    }
}


class MarketImage extends Component {

    state = {
        marketPage: 1,
        showMarketFullImage: false,
        marketImageIndex: 0
    }

    openImageNewTab = (url) => (window.open(url))

    openMarketFullImage = (index) => {
        this.setState({ showMarketFullImage: !this.state.showMarketFullImage, marketImageIndex: index })
    }

    pageChange = (page, pageSize) => {
        this.setState({ marketPage: page })
    }

    onPrevImage = () => {
        this.setState({ marketImageIndex: this.state.marketImageIndex - 1 })
    }

    onNextImage = () => {
        this.setState({ marketImageIndex: this.state.marketImageIndex + 1 })
    }

    render() {
        const item = this.props.item
        const { MARKET_IMAGE } = item
        const index = this.props.index
        const { RELATED_EXITING_MARKET_DATA, setOpenExitingMarketImageMarker } = this.props.ownProps
        const defaultPageSize = 3

        return (
            <InfoWindow
                title={item.MarketName}
                onDomReady={() => onDomReady(true)}>
                <Layout style={{ width: '715px' }}>
                    <div className={styles['headers']}>
                        <FontAwesome className="trigger" name="picture-o" />
                        <span>
                            {`(${item.MarketCode}) ${item.MarketName} (${item.BranchType})`}
                        </span>
                        <Icon
                            onClick={() => setOpenExitingMarketImageMarker(item, RELATED_EXITING_MARKET_DATA, false)}
                            className="trigger"
                            type='close' />
                    </div>
                    <Layout className={styles['layout-body-overlay']}>
                        {
                            this.state.showMarketFullImage &&
                            <div className={styles['modal-full-image']}>
                                <Tooltip
                                    title='Close Image'
                                    placement="left">
                                    <Icon type="close"
                                        className={styles['close-full-image']}
                                        onClick={this.openMarketFullImage} />
                                </Tooltip>
                                <div className={styles['full-image']} >
                                    <img
                                        src={MARKET_IMAGE[this.state.marketImageIndex].Url}
                                        style={{ width: '100%', height: '100%' }} />
                                    <div className={styles['tool-full-image']}>
                                        <div>
                                            <Tooltip
                                                title='Previous'
                                                placement="top">
                                                <Button shape="circle" icon="caret-left" onClick={this.onPrevImage} disabled={this.state.marketImageIndex == 0}></Button>
                                            </Tooltip>
                                            <div>
                                                <span>{`${this.state.marketImageIndex + 1} / ${MARKET_IMAGE.length}`}</span>
                                                <Tooltip
                                                    title='Full Image'
                                                    placement="top">
                                                    <Icon type="search"
                                                        className={styles['zoom-image']}
                                                        onClick={() => this.openImageNewTab(MARKET_IMAGE[this.state.marketImageIndex].Url)} />
                                                </Tooltip>
                                            </div>
                                            <Tooltip
                                                title='Next'
                                                placement="top">
                                                <Button shape="circle" icon="caret-right" onClick={this.onNextImage} disabled={this.state.marketImageIndex + 1 == MARKET_IMAGE.length}>
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div>
                            {
                                MARKET_IMAGE.length > 0 &&
                                <div>
                                    <div className={styles['layout-pagination']}>
                                        <Pagination
                                            size="small"
                                            style={{ marginTop: '10px' }}
                                            defaultCurrent={this.state.marketPage}
                                            pageSize={defaultPageSize}
                                            total={MARKET_IMAGE.length}
                                            onChange={this.pageChange}
                                            showTotal={(total) => (`Total ${total} items`)} />
                                    </div>
                                    <div className={styles['detail-container-picture']}>
                                        {
                                            MARKET_IMAGE
                                                .slice((defaultPageSize * this.state.marketPage) - defaultPageSize, defaultPageSize * this.state.marketPage)
                                                .map((file, i) => {
                                                    let indexOfImage = ((defaultPageSize * this.state.marketPage) - defaultPageSize) + i
                                                    return (
                                                        <div className={styles['layout-child']} onClick={() => this.openMarketFullImage(indexOfImage)}>
                                                            <img src={file.Url} style={{ width: '100%', height: '100%' }} />
                                                        </div>
                                                    )
                                                })
                                        }
                                        <div className={styles['layout-child']}>
                                            <StreetViewMap
                                                key={index}
                                                item={item}
                                                containerElement={<div style={{ height: `100%` }} />}
                                                mapElement={<div style={{ height: `100%` }} />}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                MARKET_IMAGE.length <= 0 &&
                                <div className={styles["image-not-found"]}><span><Icon type="frown-o" /> Image not avaliable.</span></div>
                            }
                        </div>
                    </Layout>
                </Layout>
            </InfoWindow>
        )
    }
}

// const getBranchPictureMarker = props => {
//     const { RELATED_BRANCH_DATA } = props

//     if (RELATED_BRANCH_DATA.length > 0) {
//         return RELATED_BRANCH_DATA.map((item, index) => {
//             if (item.showImage) {
//                 return <BranchImage item={item} index={index} ownProps={props} />
//             }
//         })
//     }
// }

// const getMarketPictureMarker = props => {
//     const { RELATED_EXITING_MARKET_DATA } = props

//     if (RELATED_EXITING_MARKET_DATA.length > 0) {
//         return RELATED_EXITING_MARKET_DATA.map((item, index) => {
//             if (item.showImage) {
//                 return <MarketImage item={item} index={index} ownProps={props} />
//             }
//         })
//     }
// }

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

class ModalDirectionInfo extends Component {

    componentDidMount() {
        if (document.getElementById('modal-direction-info') === null || document.getElementById('modal-direction-info') === undefined) {
            var divModal = document.createElement("div")
            divModal.id = 'modal-direction-info'

            document.getElementById('direction-info').appendChild(divModal)
        }
    }

    reverseRoute = () => {
        const { handleDirection, directions } = this.props
        handleDirection(directions.to, directions.from)
    }

    render() {
        const { directions } = this.props

        return (
            <Modal
                wrapClassName={`parent_salesummary ${styles['modalParentDirectionInfo']}`}
                className={styles['modalDirectionInfo']}
                visible={this.props.directions}
                onOk={false}
                onCancel={this.props.close}
                footer={null}
                closable={false}
                maskClosable={false}
                mask={false}
                getContainer={() => document.getElementById('modal-direction-info')}
            >
                <article className={styles['wrapper']}>
                    <div className={styles['header-container']}>
                        <div className={styles['title-img-direction']}>
                            <span>
                                <FontAwesome name="road" style={{ marginRight: '5px' }} />
                                Direction Route
                            </span>
                        </div>
                        <Tooltip title='Close Direction route'>
                            <Icon
                                onClick={this.props.close}
                                className={styles["trigger-close"]}
                                type='close' />
                        </Tooltip>
                    </div>
                    <Layout>
                        <Layout style={{ backgroundColor: '#FFF', 'padding': '10px' }}>
                            <div className={styles['detail-container']}>
                                <span>
                                    <FontAwesome style={{ marginRight: '5px' }} name="road" />
                                    {
                                        directions &&
                                        <span>
                                            {directions.from.name}
                                            <Tooltip title='Reverse starting point and destination'><Icon className={styles['reverse-route']} onClick={this.reverseRoute} type="swap" /></Tooltip>
                                            {directions.to.name}
                                        </span>
                                    }
                                </span>
                                <span><Icon style={{ marginRight: '5px' }} type="car" /> {directions && directions.routes[0].legs[0].distance.text}</span>
                                <span><FontAwesome style={{ marginRight: '5px' }} name="clock-o" /> {directions && directions.routes[0].legs[0].duration.text}</span>
                            </div>
                        </Layout>
                    </Layout>
                </article>
            </Modal>
        )
    }

}

class Map extends Component {

    state = {
        showAddNoteModal: false,
        modalSelectData: null,
        directions: null,
        notRenderDirection: false,
        location_direction: {
            a: null,
            b: null
        }
    }

    handleShowModal = (item) => {
        this.setState({ showAddNoteModal: true, modalSelectData: item })
    }

    handleCancel = () => {
        this.setState({ showAddNoteModal: false, modalSelectData: null })
    }

    closeDirection = () => {
        this.setState({ directions: null, location_direction: { a: null, b: null }, notRenderDirection: false })
    }

    getDirection = (origin, destination) => {
        const DirectionsService = new google.maps.DirectionsService();

        DirectionsService.route({
            origin: new google.maps.LatLng(origin.Latitude, origin.Longitude),
            destination: new google.maps.LatLng(destination.Latitude, destination.Longitude),
            travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                result.from = origin
                result.to = destination
                this.setState({ directions: result, notRenderDirection: true })
            } else {
                console.error(`error fetching directions ${result}`);
            }
        })
    }

    componentDidMount() {
        //this.getDirection()
    }

    componentWillUpdate(nextProps, nextState) {
        const { location_direction, notRenderDirection } = nextState
        if (location_direction.a && location_direction.b && !notRenderDirection) {
            this.getDirection(location_direction.a, location_direction.b)
        }
    }

    onPolylineComplete = (a, b, c, d) => {
        console.log(a, b, c, d, this)
    }

    setLocationDirection(event) {
        let location_direction = this.state.location_direction

        if (this.props.DO_BOUNDS_MAP) {
            this.props.setLocationDirectionMarker()
        }

        if (!this.state.location_direction.a || !this.state.location_direction.b) {
            if (this.state.location_direction.a) {
                location_direction.b = { name: 'point b', Latitude: event.latLng.lat(), Longitude: event.latLng.lng() }
            }
            else {
                location_direction.a = { name: 'point a', Latitude: event.latLng.lat(), Longitude: event.latLng.lng() }
            }

            this.setState({ location_direction })
        }
    }

    changeLocationDirection(event, point) {
        let location_direction = this.state.location_direction

        if (point == "a") {
            location_direction.a.Latitude = event.latLng.lat()
            location_direction.a.Longitude = event.latLng.lng()
        }
        else {
            location_direction.b.Latitude = event.latLng.lat()
            location_direction.b.Longitude = event.latLng.lng()
        }

        this.setState({ location_direction, notRenderDirection: false })
    }

    getLocationDirectionMarker() {
        return Object.keys(this.state.location_direction).map((key, index) => {
            if (!_.isEmpty(this.state.location_direction[key])) {
                let icon = icon_destination_a2
                if (key == "b") {
                    icon = icon_destination_b2
                }
                return <Marker
                    key={`location_${index}`}
                    title={this.state.location_direction[key].name}
                    position={{ lat: parseFloat(this.state.location_direction[key].Latitude), lng: parseFloat(this.state.location_direction[key].Longitude) }}
                    icon={{
                        url: icon
                    }}
                    draggable={true}
                    onDragEnd={(event) => this.changeLocationDirection(event, key)}>
                </Marker>
            }
        })

    }

    render() {
        const props = this.props
        const { NANO_FILTER_CRITERIA } = props
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
                        footer={null}>
                        {
                            <InsertNote modalSelectData={modalSelectData} />
                        }
                    </Modal>
                }
                {
                    <ModalDirectionInfo handleDirection={this.getDirection} directions={this.state.directions} close={this.closeDirection} />
                }
                <GoogleMap
                    defaultZoom={8}
                    defaultCenter={options.center}
                    disableDoubleClickZoom={true}
                    ref={(map) => (handleBounds(props, map))}
                    onRightClick={(event) => this.setLocationDirection(event)}>
                    {
                        getBranchMarkerMenu(props)
                    }
                    {
                        getBranchMarker(props, this.handleShowModal, this.getDirection)
                    }
                    {
                        getBranchMarkerCircle(props)
                    }
                    {
                        getBranchDrableCircle(props)
                    }
                    {
                        getExitingMarkerMenu(props)
                    }
                    {
                        getExitingMarker(props, this.handleShowModal, this.getDirection)
                    }
                    {
                        getComplititorMarker(props)
                    }
                    {
                        getPlanOpenBranchMarker(props, this.getDirection)
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
                                    }}
                                >
                                    {
                                        item.showInfo &&
                                        (
                                            <InfoWindow onDomReady={onDomReady}>
                                                <Layout>
                                                    <div className={styles['headers']}>
                                                        <Icon
                                                            className="trigger"
                                                            type='pie-chart' />
                                                        <span style={{ fontSize: '.9em' }}>
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
                    {
                        this.state.directions &&
                        <DirectionsRenderer
                            directions={this.state.directions}
                            options={{
                                suppressMarkers: true,
                                polylineOptions: {
                                    strokeColor: '#2196F3'
                                }
                            }} />
                    }
                    {
                        this.state.directions &&
                        <TrafficLayer autoUpdate />
                    }
                    {
                        /*<DrawingManager
                            defaultDrawingMode={google.maps.drawing.OverlayType.CIRCLE}
                            onPolylineComplete={this.onPolylineComplete}
                            defaultOptions={{
                                drawingControl: true,
                                drawingControlOptions: {
                                    position: google.maps.ControlPosition.TOP_CENTER,
                                    drawingModes: [
                                        google.maps.drawing.OverlayType.CIRCLE,
                                        google.maps.drawing.OverlayType.POLYGON,
                                        google.maps.drawing.OverlayType.POLYLINE,
                                        google.maps.drawing.OverlayType.RECTANGLE,
                                    ],
                                },
                                polylineOptions: {
                                    editable: true
                                },
                                circleOptions: {
                                    fillColor: `#ffff00`,
                                    fillOpacity: 1,
                                    strokeWeight: 5,
                                    clickable: false,
                                    editable: true,
                                    zIndex: 1,
                                },
                            }}
                        />*/
                    }
                    {
                        this.getLocationDirectionMarker()
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
        RELATED_CA_IN_MARKET_DATA: state.RELATED_CA_IN_MARKET_DATA,
        RELATED_PLAN_OPEN_BRANCH_DATA: state.RELATED_PLAN_OPEN_BRANCH_DATA
    }), {
        setOpenBranchMarker: setOpenBranchMarker,
        setOpenBranchMarkerMenu: setOpenBranchMarkerMenu,
        setOpenExitingMarketMarker: setOpenExitingMarketMarker,
        setOpenExitingMarketMarkerMenu: setOpenExitingMarketMarkerMenu,
        setOpenTargetMarketMarker: setOpenTargetMarketMarker,
        setOpenExitingMarketImageMarker: setOpenExitingMarketImageMarker,
        setOpenBranchImageMarker: setOpenBranchImageMarker,
        setOpenBranchPortfolioMarker: setOpenBranchPortfolioMarker,
        setOpenBranchSaleSummaryMarker: setOpenBranchSaleSummaryMarker,
        setOpenExitingMarketShopLayoutMarker: setOpenExitingMarketShopLayoutMarker,
        setOpenExitingMarketSaleSummaryMarker: setOpenExitingMarketSaleSummaryMarker,
        setOpenExitingMarketPortfolioMarker: setOpenExitingMarketPortfolioMarker,
        setOpenPlanOpenBranch: setOpenPlanOpenBranch,
        setLocationDirectionMarker: setLocationDirectionMarker
    })(wrapMap)
