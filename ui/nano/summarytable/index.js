import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './index.scss'
import { Table, Icon, Select, Button, Checkbox, Tooltip, Form } from 'antd';
import _ from 'lodash'
import FontAwesome from 'react-fontawesome'

import ModalSaleSummary from '../modal_sale_summary'
import ModalPortfolioChart from '../modal_portfolio_chart'
import ModalSaleSummaryChart from '../modal_sale_summary_chart'

import {
    setOpenExitingMarketMarker,
    selectMarkerByCA
} from '../actions/nanomaster'

import moment from 'moment'

const FormItem = Form.Item
const { Option, OptGroup } = Select;

class SummaryTable extends Component {

    state = {
        data: [],
        disabledCA: true,
        disableCAView: false,
    }

    select = () => {
        let branchItem = []
        _.mapKeys(_.groupBy(this.props.RELATED_BRANCH_DATA, "RegionID"), (value, key) => {
            branchItem.push({
                RegionID: key,
                BranchItem: _.orderBy(value, ['RegionID', 'AreaID'])
            })
        })

        return (
            <Select
                defaultValue={branchItem[0].BranchItem[0].BranchCode}
                onChange={this.onBranchChange}
                dropdownMatchSelectWidth={false}
                style={{ width: '100%' }}>
                {
                    branchItem.map((item, index) => {
                        return (
                            <OptGroup label={item.RegionID}>
                                {
                                    item.BranchItem.map((branch, i) => {
                                        return <Option value={branch.BranchCode}>{branch.BranchName}</Option>
                                    })
                                }
                            </OptGroup>
                        )

                    })
                }
            </Select>
        )
    }

    selectca = () => {
        let groupItem = []

        _.mapKeys(_.groupBy(this.props.RELATED_EXITING_MARKET_DATA_BACKUP, "OriginBranchCode"), (value, key) => {

            let marketCode = [];
            _.mapKeys(_.groupBy(value, "MarketCode"), (mValue, mKey) => {
                marketCode.push(mKey)
            })

            const caInMarket = _.filter(this.props.RELATED_CA_IN_MARKET_DATA, o => !_.isEmpty(_.find(marketCode, f => f == o.MarketCode)))

            let branch = {}
            if (_.filter(value, { BranchType: 'K' }).length == value.length && _.filter(value, o => o.BranchType != 'K').length <= 0) {
                branch.BranchName = !_.isEmpty(_.find(value, { BranchType: 'K' })) ? _.find(value, { BranchType: 'K' }).BranchName : 'N/A'
            }
            else {
                branch.BranchName = !_.isEmpty(_.find(value, o => o.BranchType != 'K')) ? _.find(value, o => o.BranchType != 'K').BranchName : 'N/A'
            }
            branch.CAItem = []
            _.mapKeys(_.groupBy(caInMarket, "CAHandle"), (caValue, caKey) => {
                branch.CAItem.push({
                    CACode: caKey.split(':')[0],
                    CAName: caKey.split(':')[1],
                })
            })

            groupItem.push(branch)
        })


        const { getFieldDecorator, getFieldValue } = this.props.form

        const ca_code = _.isArray(getFieldValue("select_ca")) ? getFieldValue("select_ca") : [getFieldValue("select_ca")]
        const find = _.find(this.props.RELATED_CA_IN_MARKET_DATA, o => !_.isEmpty(_.find(ca_code, f => f == o.CA_Code)))
        const start_work_date = !_.isEmpty(find) ? moment.duration(moment(new Date()).diff(moment(find.StartWork)))._data : ''
        const work_date_format = `Work Period : ${start_work_date.years}.${start_work_date.months}.${start_work_date.days}`
        const ca_name = !_.isEmpty(find) ? find.CA_Name : ''
        const ca_nickname = !_.isEmpty(find) ? find.CA_NickName : ''
        const type = {
            ca_code,
            ca_name,
            ca_nickname,
            work_date_format
        }


        return (
            <div id="ca_tools" className={`${styles['ca-icon-list']}`}>
                {
                    getFieldDecorator('select_ca', {
                        initialValue: [this.props.NANO_FILTER_CRITERIA.CAName.split(',')[0]]
                    })
                        (
                        <Select
                            mode="multiple"
                            disabled={this.state.disabledCA}
                            onChange={this.onCANameChange}
                            dropdownMatchSelectWidth={false}
                            style={{ width: '80%' }}>
                            {
                                groupItem.map((item, index) => {
                                    return (
                                        <OptGroup key={item.BranchName} label={item.BranchName}>
                                            {
                                                item.CAItem.map((ca, i) => {
                                                    return <Option key={ca.CACode} value={ca.CACode}>{ca.CAName}</Option>
                                                })
                                            }
                                        </OptGroup>
                                    )

                                })
                            }
                        </Select>
                        )

                }
                {
                    this.checkDisable() &&
                    <div>
                        <ModalSaleSummaryChart type={type} />
                        <ModalSaleSummary form={this.props.form} />
                        <ModalPortfolioChart type={type} />
                    </div>
                }
            </div >
        )
    }

    checkDisable = () => {
        let result = true
        if (this.state.disabledCA) {
            result = false
        }
        else {
            if (this.state.disableCAView) {
                result = false
            }
        }
        return result
    }

    onBranchChange = (value) => {
        this.setState({ data: this.filterData(value), })
    }

    onCANameChange = (value) => {
        this.setState({ data: this.filterDataByCa(value), disableCAView: value.length > 1 ? true : false })
    }

    columnsSelect = () => {
        const { getFieldDecorator } = this.props.form
        const CA_Count = [this.props.NANO_FILTER_CRITERIA.CAName].length

        if (this.props.NANO_FILTER_CRITERIA.CAName)
            return [{
                title: (
                    <div className={styles['ca-icon-list']}>
                        {
                            this.props.NANO_FILTER_CRITERIA.CAName.split(',').length > 1 &&
                            getFieldDecorator('checked_all', {
                                valuePropName: 'checked',
                                initialValue: this.props.NANO_FILTER_CRITERIA.CAName.split(',').length > 1
                            })(<Checkbox className={styles['ca-checkbox-all']} onChange={this.checkboxSelectAllCAChange}>All</Checkbox>)
                        }
                        <span className={`${styles['fullWidth']} ${(CA_Count <= 1) && styles['align-right']}`}>CA Market List</span>
                    </div>
                ),
                className: `${styles['header-select']} ${styles['header-vertical-middle']}`,
                children: null
            }, {
                title: this.selectca(),
                className: styles['header-select'],
                children: null
            }]
        else
            return [{
                title: (<span className={`${styles['fullWidth']}`}>Branch Market List</span>),
                className: styles['header-select'],
                children: null
            }, {
                title: (<span className={`${styles['fullWidth']}`}>{this.select()}</span>),
                className: styles['header-select'],
                children: null
            }]
    }

    columnsBodyLeft = () => [{
        className: styles['align-left'],
        width: '4%',
        className: `${styles['align-right']} ${styles['sm-paddings']}`,
        render: (text, record, index) => {
            if (record.BranchType != 'K')
                return index + 1
            else {
                return <div className={styles['kiosk-index']}><span>{index + 1}</span></div>
            }
        }
    }, {
        title: (<div className={styles['div-center']}><span>MarketName</span></div>),
        dataIndex: 'MarketName',
        key: 'MarketName',
        width: '24%',
        className: `${styles['align-left']} ${styles['sm-paddings']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={text} placement="left" >
                        <span className={styles['text-ellipsis']}>{text}</span>
                    </Tooltip>
                </div>
            )
        }
    }]

    columnsBodyRight = () => [{
        title: (<Tooltip title={'Radius to Branch'} placement="left" ><div className={styles['div-center']}><Icon type="environment" style={{ marginBottom: '5px' }} /><span>Km</span></div></Tooltip>),
        dataIndex: 'RadiusToPure',
        key: 'RadiusToPure',
        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
        width: '5%',
        render: (text, record, index) => {
            if (this.props.NANO_FILTER_CRITERIA.CAName) {
                return parseFloat(record.RadiusToPure).toFixed(parseInt(text) >= 100 ? 0 : 1)
            }
            else {
                return parseFloat(record.Radius).toFixed(parseInt(text) >= 100 ? 0 : 1)
            }
        }
    }, {
        title: (<div className={styles['div-center']}><span>#</span><span>Shop</span></div>),
        dataIndex: 'MarketShop',
        key: 'MarketShop',
        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
        width: '6%',
    }, {
        title: (<div className={styles['div-center']}><span>PMT</span><span>Succ.</span></div>),
        dataIndex: 'SuccessRate',
        key: 'SuccessRate',
        width: '7%',
        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{Math.round(parseFloat(text ? text : 0))}%</span>
        }
    }, {
        title: (<div className={styles['div-center']}><span>#</span><span>OS</span></div>),
        dataIndex: 'OS',
        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
        width: '6%',
        render: (text, record, index) => {
            return <span style={{ padding: '3px' }} className={text < 0 && styles['red-font']}>{Math.round(parseFloat(text ? text : 0))}</span>
        }
    }, {
        title: (<div className={styles['div-center']}><span>Market Penetration</span></div>),
        children: [
            {
                title: (<div className={styles['div-center']}><span>Pot.</span></div>),
                width: '5%',
                dataIndex: 'Potential',
                className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
                render: (text, record, index) => {
                    return <span className={text < 0 && styles['red-font']}>{Math.round(parseFloat(text ? text : 0))}%</span>
                }
            },
            {
                title: (<div className={styles['div-center']}><span>Setup</span></div>),
                className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
                children: [
                    {
                        dataIndex: 'SetupTotal',
                        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
                        //className: `${styles['header-hide']} ${styles['align-right']} ${styles['vertical-bottom']}`,
                        width: '5%',
                        render: (text, record, index) => {
                            return <span style={{ padding: '3px' }} className={text < 0 && styles['red-font']}>{Math.round(parseFloat(text ? text : 0))}</span>
                        }
                    },
                    {
                        dataIndex: 'SetupAch',
                        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
                        //className: `${styles['header-hide']} ${styles['align-right']} ${styles['vertical-bottom']}`,
                        width: '5%',
                        render: (text, record, index) => {
                            return <span style={{ padding: '3px' }} className={text < 0 && styles['red-font']}>{Math.round(parseFloat(text ? text : 0))}%</span>
                        }
                    }
                ]
            },
            {
                title: (<div className={styles['div-center']}><span>Top OS Contribute</span></div>),
                className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
                children: [
                    {
                        dataIndex: 'TopContributeName',
                        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
                        //className: `${styles['header-hide']} ${styles['align-left']} ${styles['vertical-bottom']}`,
                        width: '10%',
                        render: (text, record, index) => {
                            return <span style={{ padding: '3px' }}>{text}</span>
                        }
                    },
                    {
                        dataIndex: 'TopContributeValue',
                        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
                        //className: `${styles['header-hide']} ${styles['align-right']} ${styles['vertical-bottom']}`,
                        width: '7%',
                        render: (text, record, index) => {
                            return <span style={{ padding: '3px 5px' }} className={text < 0 && styles['red-font']}>{parseFloat(text ? text : 0).toFixed(0)}%</span>
                        }
                    }
                ]
            }
        ]
    }]

    getTableColumns() {
        if (this.props.RELATED_BRANCH_DATA.length > 0) {
            let columns = this.columnsSelect()
            columns[0].children = this.columnsBodyLeft()
            columns[1].children = this.columnsBodyRight()
            return columns;
        }
        // else {
        //     let columns = []
        //     columns.push(...this.columnsBodyLeft(), ...this.columnsBodyRight())
        //     return columns;
        // }
    }

    filterData(value) {
        if (this.props.NANO_FILTER_CRITERIA.CAName) {
            return _.orderBy(_.filter(this.props.RELATED_EXITING_MARKET_DATA, { BranchCode: value }), ['RadiusToPure', 'Radius'], ['asc', 'asc'])
        }
        else {
            return _.orderBy(_.filter(this.props.RELATED_EXITING_MARKET_DATA, (o => o.BranchCode == value || o.OriginBranchCode == value)), ['Radius'], ['asc'])
        }
    }

    filterDataByCa(value) {
        let value_find;

        if (!_.isArray(value) && !_.isEmpty(value)) {
            value_find = [value]
        }
        else {
            value_find = value
        }

        const marketCACode = _.map(_.filter(this.props.RELATED_CA_IN_MARKET_DATA, o => !_.isEmpty(_.find(value_find, f => f == o.CA_Code))), item => item.MarketCode)

        let filter
        if (value) {
            filter = _.filter(this.props.RELATED_EXITING_MARKET_DATA_BACKUP, o => !_.isEmpty(_.find(marketCACode, f => o.MarketCode == f)))
        }
        else {
            filter = this.props.RELATED_EXITING_MARKET_DATA_BACKUP
        }

        this.props.selectMarkerByCA(filter, value_find, this.props.NANO_FILTER_CRITERIA)

        return _.orderBy(filter, ['RadiusToPure', 'Radius'], ['asc', 'asc'])
    }

    checkboxSelectAllCAChange = (e) => {
        const { setFieldsValue } = this.props.form

        if (e.target.checked) {
            this.setState({ data: this.filterDataByCa(null), disabledCA: true })
        }
        else {
            setFieldsValue({ select_ca: this.props.NANO_FILTER_CRITERIA.CAName.split(',')[0] })
            this.setState({
                data: this.filterDataByCa(this.props.NANO_FILTER_CRITERIA.CAName.split(',')[0]),
                disabledCA: false
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !nextState.isRowClick
    }

    componentWillMount() {
        const { RELATED_BRANCH_DATA, RELATED_EXITING_MARKET_DATA } = this.props
        if (RELATED_BRANCH_DATA.length > 0)
            if (this.props.NANO_FILTER_CRITERIA.CAName) {
                if (this.props.NANO_FILTER_CRITERIA.CAName.split(',').length > 1)
                    this.setState({ data: this.filterDataByCa(null), disabledCA: true })
                else
                    this.setState({ data: this.filterDataByCa(this.props.NANO_FILTER_CRITERIA.CAName.split(',')[0]), disabledCA: false })
            }
            else {
                this.setState({ data: this.filterData(RELATED_BRANCH_DATA[0].BranchCode) })
            }
    }

    onRowClick = (record, index, event) => {
        const { setOpenExitingMarketMarker, RELATED_EXITING_MARKET_DATA } = this.props

        setOpenExitingMarketMarker(record, RELATED_EXITING_MARKET_DATA, !_.find(RELATED_EXITING_MARKET_DATA, { MarketCode: record.MarketCode }).showInfo)
    }

    render() {
        return (
            <Table
                style={{ marginBottom: '20px' }}
                className={styles['summary-table-a']}
                dataSource={this.state.data}
                columns={this.getTableColumns()}
                pagination={false}
                bordered
                onRowClick={this.onRowClick}
            />
        )
    }
}

const SummaryTableForm = Form.create()(SummaryTable)

export default connect(
    (state) => ({
        NANO_FILTER_CRITERIA: state.NANO_FILTER_CRITERIA,
        RELATED_BRANCH_DATA: state.RELATED_BRANCH_DATA,
        RELATED_EXITING_MARKET_DATA: state.RELATED_EXITING_MARKET_DATA,
        RELATED_EXITING_MARKET_DATA_BACKUP: state.RELATED_EXITING_MARKET_DATA_BACKUP,
        RELATED_CA_IN_MARKET_DATA: state.RELATED_CA_IN_MARKET_DATA
    }), {
        setOpenExitingMarketMarker: setOpenExitingMarketMarker,
        selectMarkerByCA: selectMarkerByCA
    })(SummaryTableForm)
