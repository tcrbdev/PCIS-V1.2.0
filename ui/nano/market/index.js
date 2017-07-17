import React, { Component } from 'react'

import Scrollbar from 'react-smooth-scrollbar';
import enUS from 'antd/lib/locale-provider/en_US';
import { Icon, Button, Timeline, Row, Col, Collapse, Layout, Checkbox, Input, AutoComplete, Select, Table } from 'antd';
import { LocaleProvider } from 'antd';
import SummaryTable from './summarytable'
import Filter from './filter'
import Perfomance from './performance'
import GMap from '../map'

import fetch from 'isomorphic-fetch'
import bluebird from 'bluebird'

import FontAwesome from 'react-fontawesome'

import styles from './index.scss'

const { Header, Sider, Content } = Layout
const { OptGroup } = Select;
const Panel = Collapse.Panel
const Option = AutoComplete.Option

let url = "";
if (process.env.NODE_ENV === 'dev')
    url = `http://localhost:60001`
else
    url = `http://TC001PCIS1P:60001`

const columnsBranchPerformance = [{
    title: (<div className={styles['div-center']}><span>Product</span></div>),
    dataIndex: "Product",
    className: `${styles['align-left']} ${styles['sm-padding']} ${styles['vertical-middle']} ${styles['column-hilight']}`,
    render: (text, record, index) => (text == 'Share' ? '%Micro' : text)
}, {
    title: (<div className={styles['div-center']}><span>OS Bal.</span></div>),
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']} `,
    children: [{
        title: (<div className={styles['div-center']}><span>Vol.</span></div>),
        dataIndex: 'OS_Vol',
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} `,
        render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(1)}%` : `${parseFloat(text).toFixed(1)}`)
    }, {
        title: (<div className={styles['div-center']}><span>Unit</span></div>),
        dataIndex: 'OS_Unit',
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} `,
        render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(1)}%` : parseInt(text))
    }]
}, {
    title: (<div className={styles['div-center']}><span>Financial Volume 2017</span></div>),
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
    children: [{
        title: (<div className={styles['div-center']}><span>Avg.</span></div>),
        dataIndex: 'TOTAL_Avg',
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']}`,
        render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(1)}%` : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>Vol.</span></div>),
        dataIndex: 'TOTAL_Vol',
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']}`,
        render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(1)}%` : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>Unit</span></div>),
        dataIndex: 'TOTAL_Unit',
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']}`,
        render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(1)}%` : parseInt(text))
    }, {
        title: (<div className={styles['div-center']}><span>Ticket</span></div>),
        dataIndex: 'AVG_Ticket',
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']}`,
        render: (text, record, index) => (`${parseInt(text)}K`)
    }, {
        title: (<div className={styles['div-center']}><span>Apv.</span></div>),
        dataIndex: 'TOTAL_Apv',
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']}`,
        render: (text, record, index) => (`${parseFloat(text).toFixed(1)}%`)
    }]
}, {
    title: (<div className={`${styles['div-center']} `}><span>Current Month</span></div>),
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']} current-month`,
    children: [{
        title: (<div className={styles['div-center']}><span>Vol.</span></div>),
        dataIndex: 'CUR_Vol',
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} current-month`,
        render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(1)}%` : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>Unit</span></div>),
        dataIndex: 'CUR_Unit',
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} current-month`,
        render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(1)}%` : parseInt(text))
    }, {
        title: (<div className={styles['div-center']}><span>Ticket</span></div>),
        dataIndex: 'CUR_Ticket',
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} current-month`,
        render: (text, record, index) => (`${parseInt(text)}K`)
    }, {
        title: (<div className={styles['div-center']}><span>Apv.</span></div>),
        dataIndex: 'CUR_Apv',
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} current-month`,
        render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(1)}%` : parseInt(text))
    }]
}]

const dataTotalSummary = [{
    kpi: "Target"
}, {
    kpi: "Actual"
}, {
    kpi: "%Ach."
}, {
    kpi: "Unit"
}]

const columnsTotalSummary = [{
    title: (<div className={styles['div-center']}><span>KPI</span></div>),
    dataIndex: "Kpi",
    width: '10%',
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
    render: (text, record, index) => (text == 'Ach' ? '%Ach.' : text)
}, {
    title: (<div className={styles['div-center']}><span>OS</span><span>Bal.</span></div>),
    dataIndex: "OS",
    width: '8%',
    className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']}`,
    render: (text, record, index) => (record.Kpi == 'Unit' ? text : parseFloat(text).toFixed(1))
}, {
    title: (<div className={styles['div-center']}><span>Financial Volume</span></div>),
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
    children: [{
        title: (<div className={styles['div-center']}><span>AVG</span></div>),
        dataIndex: "AVG",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']}`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? text : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>YTD</span></div>),
        dataIndex: "YTD",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']}`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? text : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>LM</span></div>),
        dataIndex: "LM",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']}`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? text : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>MTD</span></div>),
        dataIndex: "MTD",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']}`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? text : parseFloat(text).toFixed(1))
    }]
}, {
    title: (<div className={styles['div-center']}><span>Portfolio Quality</span></div>),
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']} portfolio-quality`,
    children: [{
        title: (<div className={styles['div-center']}><span>W0</span></div>),
        dataIndex: "MTD",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? text : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>W1-2</span></div>),
        dataIndex: "W1",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? text : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>W3-4</span></div>),
        dataIndex: "W2",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? text : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>XDay</span></div>),
        dataIndex: "X_Day",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? text : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>M1-2</span></div>),
        dataIndex: "M",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? text : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>NPL</span></div>),
        dataIndex: "NPL",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? text : parseFloat(text).toFixed(1))
    }]
}]

export default class Index extends Component {

    state = {
        initData: true,
        collapsed: false,
        MASTER_REGION_DATA: [],
        MASTER_AREA_DATA: [],
        MASTER_BRANCH_DATA: [],
        MASTER_TARGET_MARKET_PROVINCE_DATA: [],
        SEARCH_DATA: [],
        SEARCH_TARGET_MARKET: [],
        SEARCH_EXITING_MARKET: [],
        SEARCH_BRANCH_MARKER: [],
        SEARCH_KIOSK_BRANCH: [],
        MARKET_INFORMATION: [],
        REPORT_BRANCH_PRODUCT_SUMMARY: [],
        REPORT_TOTAL_KPI_SUMMARY: [],
        onSearching: false,
        isRowClick: false,
        isBounds: true,
        collapsedSummary: false,
        criteria: {
            MarkerOptions: []
        }
    }

    componentWillMount() {
        this.initData();
    }

    initData() {
        const MASTER_REGION = `${url}/master/region`
        const MASTER_AREA = `${url}/master/area`
        const MASTER_BRANCH = `${url}/master/branch`
        const MASTER_TARGET_MARKET_PROVINCE = `${url}/master/target/market/province`

        let api = [
            fetch(MASTER_REGION).then(res => (res.json())),
            fetch(MASTER_AREA).then(res => (res.json())),
            fetch(MASTER_BRANCH).then(res => (res.json())),
            fetch(MASTER_TARGET_MARKET_PROVINCE).then(res => (res.json())),
        ]

        bluebird.all(api).spread((
            MASTER_REGION_DATA,
            MASTER_AREA_DATA,
            MASTER_BRANCH_DATA,
            MASTER_TARGET_MARKET_PROVINCE_DATA) => {
            this.setState({
                initData: false,
                MASTER_REGION_DATA,
                MASTER_AREA_DATA,
                MASTER_BRANCH_DATA,
                MASTER_TARGET_MARKET_PROVINCE_DATA
            })
        }).catch(err => {
            console.error(`Error : ${err}`)
        })
    }

    handlePanel = () => {
        this.setState({ collapsed: !this.state.collapsed })
    }

    renderInitData() {
        return (
            <div className={styles['loading-container']}>
                <FontAwesome name="circle-o-notch" size='5x' spin />
                <span className={styles['loading-text']}>Loading...</span>
            </div>
        )
    }

    searchHandle = (criteria) => {
        this.setState({ onSearching: true })

        const SEARCH_REPORTS = `${url}/nano/marker`

        fetch(SEARCH_REPORTS, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(criteria)
        })
            .then(res => (res.json()))
            .then(res => {
                this.setState({
                    SEARCH_BRANCH_MARKER: res[0].map((item, index) => ({ showInfo: false, ...item })),
                    SEARCH_EXITING_MARKET: res[1].map((item, index) => ({ showInfo: false, ...item })),
                    SEARCH_TARGET_MARKET: res[2].map((item, index) => ({ showInfo: false, ...item })),
                    REPORT_BRANCH_PRODUCT_SUMMARY: res[3],
                    REPORT_TOTAL_KPI_SUMMARY: res[4],
                    onSearching: false,
                    isBounds: true,
                    BranchCode: criteria.BranchCode,
                    criteria: criteria
                })
            })
    }

    onTargetMarketClick = (targetMarker) => {
        let tempState = this.state.SEARCH_TARGET_MARKET;
        let indexChange = this.state.SEARCH_TARGET_MARKET.indexOf(_.find(this.state.SEARCH_TARGET_MARKET, {
            MarketName: targetMarker.MarketName
        }))
        tempState[indexChange].showInfo = !tempState[indexChange].showInfo

        this.setState({
            SEARCH_TARGET_MARKET: tempState,
            isRowClick: true,
            isBounds: false
        })
    }

    onMarkerClick = (targetMarker) => {
        let tempState = this.state.SEARCH_EXITING_MARKET;
        let indexChange = this.state.SEARCH_EXITING_MARKET.indexOf(_.find(this.state.SEARCH_EXITING_MARKET, {
            MarketCode: targetMarker.MarketCode
        }))

        if (!targetMarker.showInfo) {
            const SEARCH_MARKET_INFO = `${url}/nano/market/${targetMarker.MarketCode}`
            fetch(SEARCH_MARKET_INFO)
                .then(res => (res.json()))
                .then(res => {
                    tempState[indexChange].showInfo = !tempState[indexChange].showInfo
                    tempState[indexChange].MARKET_INFORMATION = res[0]
                    tempState[indexChange].CA_INFORMATION = res[1]

                    this.setState({
                        SEARCH_EXITING_MARKET: tempState,
                        isRowClick: true,
                        isBounds: false
                    })
                })
        }
        else {
            tempState[indexChange].showInfo = !tempState[indexChange].showInfo

            this.setState({
                SEARCH_EXITING_MARKET: tempState,
                isRowClick: true,
                isBounds: false
            })
        }
    }

    onBranchMarkerClick = (targetMarker, flag) => {
        let tempState = this.state.SEARCH_BRANCH_MARKER;
        let indexChange = this.state.SEARCH_BRANCH_MARKER.indexOf(_.find(this.state.SEARCH_BRANCH_MARKER, {
            BranchCode: targetMarker.BranchCode
        }))

        if (!targetMarker.showInfo) {
            const SEARCH_MARKET_INFO = `${url}/nano/branch/${targetMarker.BranchCode}`
            fetch(SEARCH_MARKET_INFO)
                .then(res => (res.json()))
                .then(res => {
                    if (flag) {
                        tempState[indexChange].showInfo = flag
                    }
                    else {
                        tempState[indexChange].showInfo = !tempState[indexChange].showInfo
                    }
                    tempState[indexChange].BRANCH_INFORMATION = res[0]
                    tempState[indexChange].CA_BRANCH_INFORMATION = res[1]
                    tempState[indexChange].BRANCH_DESCRIPTION = res[2]

                    this.setState({
                        SEARCH_BRANCH_MARKER: tempState,
                        isBounds: false
                    })
                })
        }
        else {
            tempState[indexChange].showInfo = !tempState[indexChange].showInfo

            this.setState({
                SEARCH_BRANCH_MARKER: tempState,
                isBounds: false
            })
        }
    }

    getViewMap() {
        if (this.state.onSearching) {
            return (
                <div className={styles['loading-container']}>
                    <FontAwesome name="circle-o-notch" size='5x' spin />
                    <span className={styles['loading-text']}>Loading...</span>
                </div>
            )
        }
        else {
            return (
                <div className={styles['map-container']}>
                    <GMap
                        containerElement={<div style={{ height: `100%` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        isBounds={this.state.isBounds}
                        onMarkerClick={this.onMarkerClick}
                        onBranchMarkerClick={this.onBranchMarkerClick}
                        onTargetMarketClick={this.onTargetMarketClick}
                        targetMarket={this.state.SEARCH_TARGET_MARKET}
                        exitingMarket={this.state.SEARCH_EXITING_MARKET}
                        branch={this.state.SEARCH_BRANCH_MARKER}
                        MARKET_INFORMATION={this.state.MARKET_INFORMATION}
                        criteria={this.state.criteria}
                    />
                    <div className={styles['float-button']}>
                        <Button
                            shape="circle"
                            icon="arrow-right"
                            className={this.state.collapsed && styles['rotate']}
                            onClick={this.handlePanel} />
                    </div>
                </div>
            )
        }
    }

    collapsedSummaryClick = () => {
        this.setState({ collapsedSummary: !this.state.collapsedSummary })
    }

    onCollapsedChange = (key) => {
        this.setState({ collapsedSummary: false })
    }

    getViewItem() {
        if (this.state.onSearching) {
            return (
                <div className={styles['loading-container']}>
                    <FontAwesome name="circle-o-notch" size='5x' spin />
                    <span className={styles['loading-text']}>Loading...</span>
                </div>
            )
        }
        else {
            const collapsedSummary = this.state.collapsedSummary ? styles['coll-show'] : styles['coll-hide']
            return (
                <div className='info-container'>
                    <div className={`${styles['show-sm']} ${collapsedSummary}`}>
                        <div>
                            <Table
                                className={styles['summary-table-not-odd']}
                                dataSource={this.state.REPORT_BRANCH_PRODUCT_SUMMARY}
                                columns={columnsBranchPerformance}
                                pagination={false}
                                bordered />
                        </div>
                        <Collapse bordered={false} onChange={this.onCollapsedChange} className={styles['no-padding-lef-right']} defaultActiveKey={["1"]}>
                            <Panel
                                key={"1"}
                                header={<div className={styles['panel-header']}><Icon type="area-chart" />Branch Summary</div>}
                            >
                                <Scrollbar overscrollEffect="bounce">
                                    {
                                        <div className="rotate-total">
                                            <div>
                                                <span>TOTAL</span>
                                            </div>
                                            <div>
                                                <Table
                                                    className={styles['summary-table-hilight']}
                                                    dataSource={this.state.REPORT_TOTAL_KPI_SUMMARY}
                                                    columns={columnsTotalSummary}
                                                    pagination={false}
                                                    bordered />
                                            </div>
                                        </div>
                                    }
                                </Scrollbar>
                                <span onClick={this.collapsedSummaryClick} style={{ marginTop: '5px' }}>
                                    <Icon type="double-right" style={{ transition: '.4s all', transform: `rotate(${this.state.collapsedSummary ? '-' : ''}90deg)`, marginRight: '5px' }} />
                                    <a>Show all</a>
                                </span>
                            </Panel>
                        </Collapse>

                    </div>
                    <Scrollbar overscrollEffect="bounce" style={{ padding: '10px' }}>
                        {
                            <SummaryTable
                                branch={this.state.SEARCH_BRANCH_MARKER}
                                data={this.state.SEARCH_EXITING_MARKET}
                                onRowClick={this.onRowClick}
                                isRowClick={this.state.isRowClick} />
                        }
                    </Scrollbar>
                </div>
            )
        }
    }

    onRowClick = (record, index, event) => {
        this.onMarkerClick(record, 'exit')
    }

    renderForm() {
        const side_menu = this.state.collapsed ? styles['side-menu-close'] : styles['side-menu']

        return (
            <Layout style={{ overflow: 'hidden' }}>
                <Layout>
                    <Content className={styles['map-container']}>
                        {
                            this.getViewMap()
                        }
                    </Content>
                </Layout>
                <Sider
                    className={side_menu}
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                >
                    <Filter searchHandle={this.searchHandle}
                        MASTER_REGION_DATA={this.state.MASTER_REGION_DATA}
                        MASTER_AREA_DATA={this.state.MASTER_AREA_DATA}
                        MASTER_BRANCH_DATA={this.state.MASTER_BRANCH_DATA}
                        MASTER_TARGET_MARKET_PROVINCE_DATA={this.state.MASTER_TARGET_MARKET_PROVINCE_DATA}
                        onBranchSelect={this.onBranchSelect}
                        countExitingMarket={this.state.SEARCH_EXITING_MARKET.length}
                        countKioskMarket={_.filter(this.state.SEARCH_EXITING_MARKET, { BranchType: 'K' }).length}
                        countPotentialMarket={this.state.SEARCH_TARGET_MARKET.length}
                    />
                    {
                        this.getViewItem()
                    }
                </Sider>
            </Layout>
        )
    }

    render() {

        return (
            <LocaleProvider locale={enUS}>
                <div className={styles['container']}>
                    {
                        this.state.initData ? this.renderInitData() : this.renderForm()
                    }
                </div>
            </LocaleProvider>
        )
    }
}