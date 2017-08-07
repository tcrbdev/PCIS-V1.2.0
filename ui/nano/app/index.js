import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie';

import { Icon, Button, Collapse, Layout, Table, Tooltip, Menu, Dropdown } from 'antd';
import Scrollbar from 'react-smooth-scrollbar';

import SummaryTable from '../summarytable'
import Filter from '../filter'
import GMap from '../map'
import FontAwesome from 'react-fontawesome'

import {
    getNanoMasterData,
    searchNanoData,
    searchNanoChangeViewByData
} from '../actions/nanomaster'

import { constantQueryType } from '../../common/constants/constants'
import styles from './index.scss'

const { Header, Sider, Content } = Layout
const Panel = Collapse.Panel

const columnsBranchPerformance = [
    {
        title: (<div className={styles['div-center']}><span>Product</span></div>),
        dataIndex: "Product",
        className: `${styles['align-left']} ${styles['sm-padding']} ${styles['vertical-middle']} ${styles['column-hilight']}`,
        render: (text, record, index) => (text == 'Share' ? '%Micro' : text)
    },
    {
        title: (<div className={styles['div-center']}><span>OS Bal.</span></div>),
        className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']} ${styles['column-hilight']}`,
        children: [{
            title: (<div className={styles['div-center']}><span>Vol.</span></div>),
            dataIndex: 'OS_Vol',
            width: '8%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} os-balance`,
            render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(0)}%` : `${parseFloat(text).toFixed(1)}`)
        }, {
            title: (<div className={styles['div-center']}><span>Unit</span></div>),
            dataIndex: 'OS_Unit',
            width: '8%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} os-balance`,
            render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(0)}%` : parseInt(text))
        }
        ]
    },
    {
        title: (<div className={styles['div-center']}><span>Financial Volume 2017</span></div>),
        className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']} financial-volume`,
        children: [{
            title: (<div className={styles['div-center']}><span>Avg.</span></div>),
            dataIndex: 'TOTAL_Avg',
            width: '8%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
            render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(1))
        },
        {
            title: (<div className={styles['div-center']}><span>Vol.</span></div>),
            dataIndex: 'TOTAL_Vol',
            width: '8%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
            render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(1))
        },
        {
            title: (<div className={styles['div-center']}><span>Unit</span></div>),
            dataIndex: 'TOTAL_Unit',
            width: '8%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
            render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(0)}%` : parseInt(text))
        },
        {
            title: (<div className={styles['div-center']}><span>Ticket</span></div>),
            dataIndex: 'AVG_Ticket',
            width: '8%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
            render: (text, record, index) => (`${parseInt(text)}K`)
        },
        {
            title: (<div className={styles['div-center']}><span>Apv.</span></div>),
            dataIndex: 'TOTAL_Apv',
            width: '8%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
            render: (text, record, index) => (`${parseFloat(text).toFixed(0)}%`)
        }]
    }, {
        title: (<div className={`${styles['div-center']} `}><span>Current Month</span></div>),
        className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']} current-month`,
        children: [{
            title: (<div className={styles['div-center']}><span>Vol.</span></div>),
            dataIndex: 'CUR_Vol',
            width: '8%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} current-month`,
            render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(1))
        }, {
            title: (<div className={styles['div-center']}><span>Unit</span></div>),
            dataIndex: 'CUR_Unit',
            width: '8%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} current-month`,
            render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(0)}%` : parseInt(text))
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
            render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(0)}%` : `${parseInt(text)}%`)
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
    width: '9%',
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']} os-balance`,
    render: (text, record, index) => (text == 'Ach' ? '%Ach.' : text)
}, {
    title: (<div className={styles['div-center']}><span>OS</span><span>Bal.</span></div>),
    dataIndex: "OS",
    width: '8%',
    className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} os-balance`,
    render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(1))
}, {
    title: (<div className={styles['div-center']}><span>Financial Volume</span></div>),
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']} financial-volume`,
    children: [{
        title: (<div className={styles['div-center']}><span>AVG</span></div>),
        dataIndex: "AVG",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>YTD</span></div>),
        dataIndex: "YTD",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>LM</span></div>),
        dataIndex: "LM",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>MTD</span></div>),
        dataIndex: "MTD",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(1))
    }]
}, {
    title: (<div className={styles['div-center']}><span>Portfolio Quality</span></div>),
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']} portfolio-quality`,
    children: [{
        title: (<div className={styles['div-center']}><Tooltip title="> 87%"><span>W0</span></Tooltip></div>),
        dataIndex: "W0",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(1)}%` : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><Tooltip title="< 2%"><span>W1-2</span></Tooltip></div>),
        dataIndex: "W1-2",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(1)}%` : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><Tooltip title="< 1%"><span>W3-4</span></Tooltip></div>),
        dataIndex: "W3-4",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(1)}%` : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><Tooltip title="< 3%"><span>XDay</span></Tooltip></div>),
        dataIndex: "XDay",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(1)}%` : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><Tooltip title="< 2%"><span>M1-2</span></Tooltip></div>),
        dataIndex: "M1-2",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(1)}%` : parseFloat(text).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><Tooltip title="< 4%"><span>NPL</span></Tooltip></div>),
        dataIndex: "NPL",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality `,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(1)}%` : parseFloat(text).toFixed(1))
    }]
}]

class Index extends Component {

    state = {
        collapsed: false,
        SEARCH_BRANCH_MARKER: [],
        collapsedSummary: false,
        openFilterCollapsed: "1"
    }

    componentWillMount() {
        this.initData();
    }

    initData() {
        const { getNanoMasterData } = this.props
        getNanoMasterData();
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

    getViewMap() {
        if (this.props.ON_NANO_SEARCHING_DATA) {
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
        this.setState({ collapsedSummary: false, openFilterCollapsed: key[0] })
    }

    getGroupBySummary() {
        let obj = []
        _.mapKeys(_.groupBy(this.props.RELATED_GROUP_BY_SUMMARY_DATA, "Group"), (value, key) => {
            obj.push({
                GroupName: key,
                Data: value
            })
        })

        if (obj.length > 0) {
            return obj.map((item, index) => {
                return (
                    <div className="rotate-total">
                        <div style={{ backgroundColor: (item.GroupName.indexOf('osk') <= 0 ? '#0099ff' : '#ff6500') }}>
                            <Tooltip placement="topLeft" title={`${item.GroupName}`}>
                                <div>{`${this.props.NANO_FILTER_CRITERIA.QueryType == constantQueryType.ca ? `${item.GroupName.split(' ')[0]}` : item.GroupName}`}</div>
                            </Tooltip>
                        </div>
                        <div>
                            <Table
                                className={styles['summary-table-hilight']}
                                dataSource={item.Data}
                                columns={columnsTotalSummary}
                                pagination={false}
                                bordered />
                        </div>
                    </div>
                )
            })
        }
    }

    changeViewSummary(view) {
        const { searchNanoChangeViewByData, NANO_FILTER_CRITERIA } = this.props

        if (!_.isEmpty(NANO_FILTER_CRITERIA)) {
            const criteria = _.cloneDeep(NANO_FILTER_CRITERIA)
            criteria.QueryType = view
            searchNanoChangeViewByData(criteria)
        }
    }

    getMenuGroupBy() {
        const MenuItem = Menu.Item
        return (
            <Menu>
                <MenuItem key={constantQueryType.area} >
                    <span onClick={() => this.changeViewSummary(constantQueryType.area)}>
                        <Icon type="global" className={styles['icon-groupby']} />
                        <span>View By Area</span>
                    </span>
                </MenuItem>
                <MenuItem key={constantQueryType.zone}>
                    <span onClick={() => this.changeViewSummary(constantQueryType.zone)}>
                        <FontAwesome name="share-alt" className={styles['icon-groupby']} />
                        <span>View By Zone</span>
                    </span>
                </MenuItem>
                <MenuItem key={constantQueryType.branch}>
                    <span onClick={() => this.changeViewSummary(constantQueryType.branch)}>
                        <Icon type="home" className={styles['icon-groupby']} />
                        <span>View By Branch</span>
                    </span>
                </MenuItem>
                <MenuItem key={constantQueryType.branch_kiosk}>
                    <span onClick={() => this.changeViewSummary(constantQueryType.branch_kiosk)}>
                        <FontAwesome name="street-view" className={styles['icon-groupby']} />
                        <span>{`View By Branch & Kiosk`}</span>
                    </span>
                </MenuItem>
                <MenuItem key={constantQueryType.ca}>
                    <span onClick={() => this.changeViewSummary(constantQueryType.ca)}>
                        <Icon type="user" className={styles['icon-groupby']} />
                        <span>View By CA</span>
                    </span>
                </MenuItem>
            </Menu>
        )
    }

    getViewItem() {
        if (this.props.ON_NANO_SEARCHING_DATA) {
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
                                dataSource={this.props.RELATED_PERFORMANCE_SUMMARY_DATA}
                                columns={columnsBranchPerformance}
                                pagination={false}
                                bordered />
                        </div>
                        <Collapse bordered={false} onChange={this.onCollapsedChange} className={styles['no-padding-lef-right']} activeKey={this.state.openFilterCollapsed}>
                            <Panel
                                key={"1"}
                                header={
                                    <div className={styles['panel-header']}>
                                        <Icon type="area-chart" />
                                        Branch Summary
                                        <div className={styles['icon-header-container']}>
                                            <div>
                                                <Tooltip title="View">
                                                    <Dropdown overlay={this.getMenuGroupBy()} placement="bottomCenter">
                                                        <div className={styles['icon-split']} onClick={() => this.setState({ openFilterCollapsed: null })}>
                                                            <Icon type="caret-up" />
                                                            <Icon type="caret-down" />
                                                        </div>
                                                    </Dropdown>
                                                </Tooltip>
                                                <div className={styles['ca-icon-lists']}>
                                                    <Tooltip title="Sale Summary"><FontAwesome name="line-chart" /></Tooltip>
                                                    <Tooltip title="Market Penatation"><FontAwesome name="table" /></Tooltip>
                                                    <Tooltip title="Portfolio Quality" placement="topRight"><FontAwesome name="dollar" /></Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            >
                                <Scrollbar overscrollEffect="bounce">
                                    <div>
                                        {
                                            (_.sumBy(this.props.RELATED_OVERALL_SUMMARY_DATA, "YTD") > 0 && _.sumBy(this.props.RELATED_OVERALL_SUMMARY_DATA, "OS") > 0) ?
                                                <div className="rotate-total">
                                                    <div>
                                                        <div>TOTAL</div>
                                                    </div>
                                                    <div>
                                                        <Table
                                                            className={styles['summary-table-hilight']}
                                                            dataSource={this.props.RELATED_OVERALL_SUMMARY_DATA}
                                                            columns={columnsTotalSummary}
                                                            pagination={false}
                                                            bordered />
                                                    </div>
                                                </div>
                                                :
                                                <div className="rotate-total">
                                                    <div>
                                                        <div>TOTAL</div>
                                                    </div>
                                                    <div>
                                                        <Table
                                                            className={styles['summary-table-hilight']}
                                                            dataSource={[]}
                                                            columns={columnsTotalSummary}
                                                            pagination={false}
                                                            bordered />
                                                    </div>
                                                </div>
                                        }
                                        {
                                            this.getGroupBySummary()
                                        }
                                        {
                                            this.props.ON_NANO_CHANGE_VIEW_SEARCHING_DATA &&
                                            (
                                                <div className={styles['view-change']}>
                                                    <div className={styles['loading-containers']} >
                                                        <FontAwesome name="circle-o-notch" size='5x' spin />
                                                        <span className={styles['loading-text']}>Loading...</span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
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
                            <SummaryTable />
                        }
                    </Scrollbar>
                </div>
            )
        }
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
                    collapsed={this.state.collapsed}>

                    <Filter
                        searchHandle={this.searchHandle}
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
            <div className={styles['container']}>
                {
                    this.props.NANO_INIT_PAGE ? this.renderInitData() : this.renderForm()
                }
            </div>
        )
    }
}

const CookiesHomeForm = withCookies(Index)

export default connect(
    (state) => ({
        NANO_INIT_PAGE: state.NANO_INIT_PAGE,
        ON_NANO_SEARCHING_DATA: state.ON_NANO_SEARCHING_DATA,
        ON_NANO_CHANGE_VIEW_SEARCHING_DATA: state.ON_NANO_CHANGE_VIEW_SEARCHING_DATA,
        NANO_FILTER_CRITERIA: state.NANO_FILTER_CRITERIA,
        RELATED_PERFORMANCE_SUMMARY_DATA: state.RELATED_PERFORMANCE_SUMMARY_DATA,
        RELATED_OVERALL_SUMMARY_DATA: state.RELATED_OVERALL_SUMMARY_DATA,
        RELATED_GROUP_BY_SUMMARY_DATA: state.RELATED_GROUP_BY_SUMMARY_DATA,
        RELATED_KIOSK_SUMMARY_DATA: state.RELATED_KIOSK_SUMMARY_DATA
    }),
    {
        getNanoMasterData: getNanoMasterData,
        searchNanoData: searchNanoData,
        searchNanoChangeViewByData: searchNanoChangeViewByData
    })(CookiesHomeForm)