import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie';
import { constantQueryType } from '../../common/constants/constants'
import Scrollbar from 'react-smooth-scrollbar';

import { Icon, Collapse, Table, Tooltip, Popover, Menu, Dropdown } from 'antd';
import FontAwesome from 'react-fontawesome'
import _ from 'lodash'
import moment from 'moment'

import {
    searchNanoChangeViewByData
} from '../actions/nanomaster'

import ModalAreaSummary from '../modal_area_summary'

import styles from '../app/index.scss'

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
            render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(0)}%` : `${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}`)
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
            render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
        },
        {
            title: (<div className={styles['div-center']}><span>Vol.</span></div>),
            dataIndex: 'TOTAL_Vol',
            width: '8%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
            render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
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
            render: (text, record, index) => (record.Product == 'Share' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
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
    render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
}, {
    title: (<div className={styles['div-center']}><span>Financial Volume</span></div>),
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']} financial-volume`,
    children: [{
        title: (<div className={styles['div-center']}><span>AVG</span></div>),
        dataIndex: "AVG",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
    }, {
        title: (<div className={styles['div-center']}><span>YTD</span></div>),
        dataIndex: "YTD",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
    }, {
        title: (<div className={styles['div-center']}><span>LM</span></div>),
        dataIndex: "LM",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
    }, {
        title: (<div className={styles['div-center']}><span>MTD</span></div>),
        dataIndex: "MTD",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} financial-volume`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? `${parseFloat(text).toFixed(0)}%` : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
    }]
}, {
    title: (<div className={styles['div-center']}><span>Portfolio Quality</span></div>),
    className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']} portfolio-quality`,
    children: [{
        title: (<div className={styles['div-center']}><Tooltip title="> 87%"><span>W0</span></Tooltip></div>),
        dataIndex: "W0",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? <span style={{ color: parseFloat(text) < 87 ? 'red' : 'inherit' }}>{`${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%`}</span> : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
    }, {
        title: (<div className={styles['div-center']}><Tooltip title="< 2%"><span>W1-2</span></Tooltip></div>),
        dataIndex: "W1-2",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? <span style={{ color: parseFloat(text) > 2 ? 'red' : 'inherit' }}>{`${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%`}</span> : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
    }, {
        title: (<div className={styles['div-center']}><Tooltip title="< 1%"><span>W3-4</span></Tooltip></div>),
        dataIndex: "W3-4",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? <span style={{ color: parseFloat(text) > 1 ? 'red' : 'inherit' }}>{`${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%`}</span> : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
    }, {
        title: (<div className={styles['div-center']}><Tooltip title="< 3%"><span>XDay</span></Tooltip></div>),
        dataIndex: "XDay",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? <span style={{ color: parseFloat(text) > 3 ? 'red' : 'inherit' }}>{`${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%`}</span> : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
    }, {
        title: (<div className={styles['div-center']}><Tooltip title="< 2%"><span>M1-2</span></Tooltip></div>),
        dataIndex: "M1-2",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality`,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? <span style={{ color: parseFloat(text) > 2 ? 'red' : 'inherit' }}>{`${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%`}</span> : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
    }, {
        title: (<div className={styles['div-center']}><Tooltip title="< 4%"><span>NPL</span></Tooltip></div>),
        dataIndex: "NPL",
        width: '8%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-bottom']} portfolio-quality `,
        render: (text, record, index) => (record.Kpi == 'Unit' ? `${parseFloat(text).toFixed(0)}` : record.Kpi == 'Ach' ? <span style={{ color: parseFloat(text) > 4 ? 'red' : 'inherit' }}>{`${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%`}</span> : parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1))
    }]
}]

class BranchSummary extends Component {

    state = {
        collapsed: false,
        SEARCH_BRANCH_MARKER: [],
        collapsedSummary: false,
        openFilterCollapsed: "1"
    }

    getGroupBySummary() {
        let obj = []
        _.mapKeys(_.groupBy(_.orderBy(this.props.RELATED_GROUP_BY_SUMMARY_DATA, 'BranchCode', 'asc'), "Group"), (value, key) => {
            let temp = {}
            if (this.props.NANO_FILTER_CRITERIA.QueryType == constantQueryType.ca) {

                const find = _.find(this.props.RELATED_CA_IN_MARKET_DATA, { CA_Code: `${value[0].CAID}` })
                const start_work_date = !_.isEmpty(find) ? moment.duration(moment(new Date()).diff(moment(find.StartWork)))._data : ''
                const work_date_format = `Work period : ${start_work_date.years}.${start_work_date.months}.${start_work_date.days}`

                temp = {
                    CAID: value[0].CAID,
                    Period: work_date_format,
                    GroupName: key,
                    Data: value,
                    OrderByOS: _.find(value, { Kpi: 'Unit' }).OS
                }
            }
            else {
                temp = {
                    GroupName: key,
                    Data: value,
                    Period: null,
                    OrderByOS: _.find(value, { Kpi: 'Unit' }).OS,
                    BranchCode: value[0].BranchCode
                }
            }

            obj.push(temp)
        })

        // if (this.props.NANO_FILTER_CRITERIA.QueryType == constantQueryType.ca) {
        //     obj = _.orderBy(obj, ['GroupName', 'OrderByOS'], ['asc', 'desc'])
        // }
        // else {
        obj = _.orderBy(obj, ['BranchCode', 'GroupName', 'OrderByOS'], ['asc', 'asc', 'desc'])
        // }

        if (obj.length > 0) {
            return obj.map((item, index) => {

                return (
                    <div className="rotate-total">
                        <div style={{ backgroundColor: (item.GroupName.indexOf('osk') <= 0 ? '#0099ff' : '#ff6500'), cursor: 'pointer' }}>
                            {
                                this.props.NANO_FILTER_CRITERIA.QueryType == constantQueryType.ca ?
                                    <Popover
                                        placement="topLeft"
                                        content={
                                            <div className={styles['ca-img-container']}>
                                                <img className={styles['ca-img']} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${item.CAID}`} />
                                                <div>
                                                    <span>{item.GroupName}</span>
                                                    <span>{item.Period}</span>
                                                </div>
                                            </div>
                                        }
                                        trigger="hover"
                                    >
                                        <div>{item.GroupName.indexOf('osk') <= 0 ? item.GroupName.split(' ')[0] : item.GroupName.split(' ')[1]}</div>
                                    </Popover>
                                    :
                                    <Tooltip
                                        placement="topLeft"
                                        title={<div>{item.GroupName} <br /> Br. Open: Coming soon..</div>}>
                                        <div>{item.GroupName.indexOf('osk') <= 0 ? item.GroupName.split(' ')[0] : item.GroupName.split(' ')[1]}</div>
                                    </Tooltip>
                            }
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

    collapsedSummaryClick = () => {
        this.setState({ collapsedSummary: !this.state.collapsedSummary })
    }

    onCollapsedChange = (key) => {
        this.setState({ collapsedSummary: false, openFilterCollapsed: key[0] })
    }

    changeViewSummary(view) {
        const { searchNanoChangeViewByData, NANO_FILTER_CRITERIA } = this.props

        if (!_.isEmpty(NANO_FILTER_CRITERIA)) {
            const criteria = _.cloneDeep(NANO_FILTER_CRITERIA)
            criteria.QueryType = view
            searchNanoChangeViewByData(criteria)

            this.setState({ collapsedSummary: true, openFilterCollapsed: "1" })
        }
    }

    getMenuGroupBy() {
        const MenuItem = Menu.Item
        return (
            <Menu>
                <MenuItem key={constantQueryType.region} disabled={!_.isEmpty(this.props.NANO_FILTER_CRITERIA) ? this.props.NANO_FILTER_CRITERIA.RegionID.split(',').length <= 1 ? true : false : true}>
                    <span onClick={() => this.changeViewSummary(constantQueryType.region)}>
                        <Icon type="global" className={styles['icon-groupby']} />
                        <span>View By Region</span>
                    </span>
                </MenuItem>
                <MenuItem key={constantQueryType.area} disabled={
                    !_.isEmpty(this.props.NANO_FILTER_CRITERIA) ?
                        _.isEmpty(this.props.NANO_FILTER_CRITERIA.Zone) || this.props.NANO_FILTER_CRITERIA.Zone.split(',').length > 1 ?
                            false
                            :
                            true
                        :
                        true
                }>
                    <span onClick={() => this.changeViewSummary(constantQueryType.area)}>
                        <FontAwesome name="share-alt" className={styles['icon-groupby']} />
                        <span>View By Area</span>
                    </span>
                </MenuItem>
                <MenuItem key={constantQueryType.zone} disabled={
                    !_.isEmpty(this.props.NANO_FILTER_CRITERIA) ?
                        _.isEmpty(this.props.NANO_FILTER_CRITERIA.Zone)
                            || _.filter(this.props.NANO_FILTER_CRITERIA.Zone.split(','), o => o.indexOf('Zone') <= 0).length >= 1
                            || _.filter(this.props.NANO_FILTER_CRITERIA.Zone.split(','), o => o.indexOf('Zone') > 0).length > 1 ?
                            false
                            :
                            true
                        :
                        true
                }>
                    <span onClick={() => this.changeViewSummary(constantQueryType.zone)}>
                        <Icon type="fork" className={styles['icon-groupby']} style={{ transform: 'rotate(180deg)' }} />
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
                        <Icon type="shop" className={styles['icon-groupby']} />
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

    render() {
        const { cookies, AUTH_NANO_USER } = this.props
        const collapsedSummary = this.state.collapsedSummary ? styles['coll-show'] : styles['coll-hide']
        const authen_info = cookies.get('authen_info')
        const AuthList = ['57251', '56225', '58141', '56679', '58106', '58385', '59016', '57568', '59440', '57160', '57249', '59151']

        let auth_pass = false
        if (process.env.NODE_ENV === 'production') {
            if (!_.isEmpty(AUTH_NANO_USER)) {
                if (!_.isEmpty(_.find(AuthList, o => o == AUTH_NANO_USER.Session.sess_empcode))) {
                    auth_pass = true
                }
            }
        }
        else {
            auth_pass = true
        }

        return (
            <div className={`${styles['show-sm']} ${collapsedSummary}`}>
                <div>
                    <Table
                        className={styles['summary-table-not-odd']}
                        dataSource={this.props.RELATED_PERFORMANCE_SUMMARY_DATA}
                        columns={columnsBranchPerformance}
                        pagination={false}
                        bordered />
                </div>
                <div>
                    <div className={styles['icon-header-container']}>
                        <div className={`${this.state.collapsed && styles['hide']} ${(!auth_pass) && styles['hide']}`}>
                            <Tooltip title="View">
                                <Dropdown overlay={this.getMenuGroupBy()} placement="bottomCenter">
                                    <div className={styles['icon-split']}>
                                        <Icon type="caret-up" />
                                        <Icon type="caret-down" />
                                    </div>
                                </Dropdown>
                            </Tooltip>
                            <div className={styles['ca-icon-lists']}>
                                <Tooltip title="Sale Summary"><FontAwesome name="line-chart" /></Tooltip>
                                <ModalAreaSummary />
                                <Tooltip title="Portfolio Quality" placement="topRight"><FontAwesome name="dollar" /></Tooltip>
                            </div>
                        </div>
                    </div>
                    <Collapse bordered={false} onChange={this.onCollapsedChange} className={styles['no-padding-lef-right']} activeKey={this.state.openFilterCollapsed}>
                        <Panel
                            key={"1"}
                            header={
                                <div className={styles['panel-header']}>
                                    <Icon type="area-chart" />
                                    <span>Branch Summary</span>
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
            </div>
        )
    }

    /*render() {
        return
                (
            <div>
                    <div className={styles['icon-header-container']}>
                        <div className={`${this.state.collapsed && styles['hide']} ${(!auth_pass) && styles['hide']}`}>
                            <Tooltip title="View">
                                <Dropdown overlay={this.getMenuGroupBy()} placement="bottomCenter">
                                    <div className={styles['icon-split']}>
                                        <Icon type="caret-up" />
                                        <Icon type="caret-down" />
                                    </div>
                                </Dropdown>
                            </Tooltip>

                            <div className={styles['ca-icon-lists']}>
                                <Tooltip title="Sale Summary"><FontAwesome name="line-chart" /></Tooltip>
                                <ModalAreaSummary />
                                <Tooltip title="Portfolio Quality" placement="topRight"><FontAwesome name="dollar" /></Tooltip>
                            </div>
                        </div>
                    </div>
                    <Collapse bordered={false} onChange={this.onCollapsedChange} className={styles['no-padding-lef-right']} activeKey={this.state.openFilterCollapsed}>
                        <Panel
                            key={"1"}
                            header={
                                <div className={styles['panel-header']}>
                                    <Icon type="area-chart" />
                                    <span>Branch Summary</span>
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
                )
    }*/
}

const CookiesBranchSummary = withCookies(BranchSummary)

export default connect(
    (state) => ({
        AUTH_NANO_USER: state.AUTH_NANO_USER,
        NANO_FILTER_CRITERIA: state.NANO_FILTER_CRITERIA,
        RELATED_PERFORMANCE_SUMMARY_DATA: state.RELATED_PERFORMANCE_SUMMARY_DATA,
        RELATED_OVERALL_SUMMARY_DATA: state.RELATED_OVERALL_SUMMARY_DATA,
        RELATED_GROUP_BY_SUMMARY_DATA: state.RELATED_GROUP_BY_SUMMARY_DATA,
        ON_NANO_CHANGE_VIEW_SEARCHING_DATA: state.ON_NANO_CHANGE_VIEW_SEARCHING_DATA,
        RELATED_CA_IN_MARKET_DATA: state.RELATED_CA_IN_MARKET_DATA
    }),
    {
        searchNanoChangeViewByData: searchNanoChangeViewByData
    })(CookiesBranchSummary)