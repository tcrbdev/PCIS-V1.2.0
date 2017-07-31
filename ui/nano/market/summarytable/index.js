import React, { Component } from 'react'
import styles from './index.scss'
import { Table, Icon, Select, Button, Checkbox, Tooltip } from 'antd';
import _ from 'lodash'
import FontAwesome from 'react-fontawesome'

const { Option, OptGroup } = Select;

export default class SummaryTable extends Component {

    state = {
        data: [],
        isRowClick: false
    }

    select = () => {
        let branchItem = []
        _.mapKeys(_.groupBy(this.props.branch, "RegionID"), (value, key) => {
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
        _.mapKeys(_.groupBy(this.props.data, "BranchName"), (value, key) => {
            let branch = {}
            branch.BranchName = key

            const cacode = _.filter(_.filter(_.uniq(_.uniq(value.map(o => o.CAHandleMarket).join(',').split(',')).map(o => {
                if (!_.isEmpty(o))
                    return o.substring(o.indexOf('T'), o.length)
                else
                    return null
            })), f => !_.isEmpty(f)), f => !_.isEmpty(_.find(this.props.criteria.CAName.split(','), o => f.indexOf(o) >= 0)))

            branch.CAItem = cacode
            groupItem.push(branch)

        })

        return (
            <div className={styles['ca-icon-list']}>
                <Select
                    defaultValue={this.props.criteria.CAName.split(',')[0]}
                    onChange={this.onCANameChange}
                    dropdownMatchSelectWidth={false}
                    style={{ width: '80%' }}>
                    {
                        groupItem.map((item, index) => {
                            return (
                                <OptGroup label={item.BranchName}>
                                    {
                                        item.CAItem.map((ca, i) => {
                                            return <Option value={ca.split(':')[0]}>{ca.split(':')[1]}</Option>
                                        })
                                    }
                                </OptGroup>
                            )

                        })
                    }
                </Select>
                <div>
                    <Tooltip title="Sale Summary"><FontAwesome name="line-chart" /></Tooltip>
                    <Tooltip title="Market Penatation"><FontAwesome name="table" /></Tooltip>
                    <Tooltip title="Portfolio Quality" placement="topRight"><FontAwesome name="dollar" /></Tooltip>
                </div>
            </div>
        )
    }

    onBranchChange = (value) => {
        this.setState({ data: this.filterData(value), isRowClick: false })
    }

    onCANameChange = (value) => {
        this.setState({ data: this.filterDataByCa(value), isRowClick: false })
    }

    columnsSelect = () => {
        if (this.props.criteria.CAName)
            return [{
                title: (<div className={styles['ca-icon-list']}><Checkbox className={styles['ca-checkbox-all']}>All</Checkbox><span>CA Market List</span></div>),
                className: `${styles['header-select']} ${styles['header-vertical-middle']}`,
                children: null
            }, {
                title: this.selectca(),
                className: styles['header-select'],
                children: null
            }]
        else
            return [{
                title: 'Branch Market List :',
                className: styles['header-select'],
                children: null
            }, {
                title: this.select(),
                className: styles['header-select'],
                children: null
            }]
    }

    columnsBodyLeft = () => [{
        className: styles['align-left'],
        width: '4%',
        className: `${styles['align-right']} ${styles['sm-paddings']}`,
        render: (text, record, index) => (index + 1)
    }, {
        title: (<div className={styles['div-center']}><span>MarketName</span></div>),
        dataIndex: 'MarketName',
        key: 'MarketName',
        width: '25%',
        className: `${styles['align-left']} ${styles['sm-paddings']} ${styles['vertical-middle']}`,
    }]

    columnsBodyRight = () => [{
        title: (<div className={styles['div-center']}><Icon type="environment" style={{ marginBottom: '5px' }} /><span>Km</span></div>),
        dataIndex: 'Radius',
        key: 'Radius',
        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
        width: '5%',
        render: (text, record, index) => (parseFloat(record.Radius).toFixed(1))
    }, {
        title: (<div className={styles['div-center']}><span>#</span><span>Shop</span></div>),
        dataIndex: 'MarketShop',
        key: 'MarketShop',
        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
        width: '7%',
    }, {
        title: (<div className={styles['div-center']}><span>PMT</span><span>Succ.</span></div>),
        width: '7%',
        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{0}%</span>
        }
    }, {
        title: (<div className={styles['div-center']}><span>#</span><span>OS</span></div>),
        dataIndex: 'OS',
        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
        width: '5%',
        render: (text, record, index) => {
            return <span style={{ padding: '3px' }} className={text < 0 && styles['red-font']}>{Math.round(parseFloat(text ? text : 0))}</span>
        }
    }, {
        title: (<div className={styles['div-center']}><span>Market Penetation</span></div>),
        children: [{
            title: (<div className={styles['div-center']}><span>Pot.</span></div>),
            width: '5%',
            dataIndex: 'Potential',
            className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
            render: (text, record, index) => {
                return <span className={text < 0 && styles['red-font']}>{Math.round(parseFloat(text ? text : 0))}%</span>
            }
        }, {
            title: (<div className={styles['div-center']}><span>Setup</span></div>),
            className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
            children: [{
                dataIndex: 'SetupTotal',
                className: `${styles['header-hide']} ${styles['align-right']} ${styles['vertical-bottom']}`,
                width: '5%',
                render: (text, record, index) => {
                    return <span style={{ padding: '3px' }} className={text < 0 && styles['red-font']}>{Math.round(parseFloat(text ? text : 0))}</span>
                }
            }, {
                dataIndex: 'SetupAch',
                className: `${styles['header-hide']} ${styles['align-right']} ${styles['vertical-bottom']}`,
                width: '5%',
                render: (text, record, index) => {
                    return <span style={{ padding: '3px' }} className={text < 0 && styles['red-font']}>{Math.round(parseFloat(text ? text : 0))}%</span>
                }
            }]
        }, {
            title: (<div className={styles['div-center']}><span>Top OS Contribute</span></div>),
            className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
            children: [{
                dataIndex: 'TopContributeName',
                className: `${styles['header-hide']} ${styles['align-left']} ${styles['vertical-bottom']}`,
                width: '10%',
                render: (text, record, index) => {
                    return <span style={{ padding: '3px' }}>{text}</span>
                }
            }, {
                dataIndex: 'TopContributeValue',
                className: `${styles['header-hide']} ${styles['align-right']} ${styles['vertical-bottom']}`,
                width: '6%',
                render: (text, record, index) => {
                    return <span style={{ padding: '3px 5px' }} className={text < 0 && styles['red-font']}>{parseFloat(text ? text : 0).toFixed(0)}%</span>
                }
            }]
        }]
    }]

    getTableColumns() {
        if (this.props.branch.length > 0) {
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
        return _.orderBy(_.filter(this.props.data, { BranchCode: value }), ['Radius'], ['asc'])
    }

    filterDataByCa(value) {
        return _.orderBy(_.filter(this.props.data, o => o.CAHandleMarket.indexOf(value) >= 0), ['Radius'], ['asc'])
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !nextState.isRowClick
    }

    componentWillMount() {
        const { branch, data } = this.props
        branch.length > 0 &&
            this.setState({ data: this.filterData(branch[0].BranchCode) })
    }

    render() {
        return (
            <Table
                className={styles['summary-table']}
                dataSource={this.state.data}
                columns={this.getTableColumns()}
                pagination={false}
                bordered
                onRowClick={this.props.onRowClick}
            />
        )
    }
}
