import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Icon, Tooltip, Popover, Card, Timeline, Table } from 'antd';

import FontAwesome from 'react-fontawesome'
import moment from 'moment'

import styles from './index.scss'

const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

class StopApproval extends Component {

    state = {
        showSubPage: {},
        filteredInfo: null,
        sortedInfo: null,
    }

    getHeaderTitle = (props) => {
        const { item, ON_CLOSE_MARKER, custom_width } = props

        return (
            <div className={styles['headers'] + ' ' + 'drag-header'} style={{ background: '#FF9800' }}>
                <FontAwesome className="trigger" name='exclamation-triangle' />
                <span>{`Warning Stop Approval (Plan < 5%)`}</span>
                <Icon
                    onClick={() => ON_CLOSE_MARKER()}
                    className="trigger"
                    type='close' />
            </div>
        )

    }

    onRowClick = (record, index) => {
        const { NANO_VISIT_POPUP_INFO } = this.props

        const result = _.filter(NANO_VISIT_POPUP_INFO[2], { BranchCode: record.BranchCode })

        if (result.length >= 1)
            this.setState({ showSubPage: { branch: record, result: result } })
    }

    backToMainPage = () => {
        this.setState({ showSubPage: null })
    }

    getDataSource = () => {
        const { NANO_VISIT_POPUP_INFO } = this.props

        let result = []

        _.mapKeys(_.groupBy(NANO_VISIT_POPUP_INFO[1], "BranchName"), (item, key) => {

            const summary = _.sum(_.filter(NANO_VISIT_POPUP_INFO[2], { BranchCode: item[0].BranchCode }).map(item => item.MinAmt))

            result.push({
                "RegionID": item[0].RegionID,
                "AreaID": item[0].AreaID,
                "Zone": item[0].Zone,
                "BranchCode": item[0].BranchCode,
                "BranchName": item[0].BranchName,
                "OSFebUp": item[0].OSFebUp,
                "OSFebUp_Bk": item[0].OSFebUp_Bk,
                "CustM2NPLFebUp": item[0].CustM2NPLFebUp,
                "M2NPLFebUp": item[0].M2NPLFebUp,
                "M2NPLFebUp_Bk": item[0].M2NPLFebUp_Bk,
                "StopApproval": item[0].StopApproval,
                "CustFCFebUp": item[0].CustFCFebUp,
                "FCFebUp": item[0].FCFebUp,
                "FCFebUp_Bk": item[0].FCFebUp_Bk,
                "FCStopApproval": item[0].FCStopApproval,
                "TotalMinAmt": summary
            })
        })

        return result;
    }

    render() {
        const { item, ON_CLOSE_MARKER, custom_width, NANO_VISIT_POPUP_INFO, NANO_VISIT_POPUP_STATUS, NO_HEADER } = this.props

        let caFilter = []

        if (!_.isEmpty(this.state.showSubPage)) {
            _.mapKeys(_.groupBy(this.state.showSubPage.result, "CAName"), (item, key) => {
                caFilter.push({ text: key, value: key })
            })
        }

        return (
            <Layout style={{ width: custom_width ? custom_width : '610px', overflow: 'hidden', background: '#FFF' }}>
                {
                    !NO_HEADER &&
                    this.getHeaderTitle(this.props)
                }
                <Layout style={{ backgroundColor: '#FFF', margin: '0px 10px 5px 10px', background: '#FFF' }}>
                    <div>
                        <div style={{ textAlign: 'right', marginBottom: '-10px' }}>
                            <div className={styles['stop-approval-info']}>
                                <Popover
                                    trigger='hover'
                                    placement="bottomRight"
                                    content={
                                        <div className={styles['stop-approval-info-popover']}>
                                            <span>ลูกค้าที่มียอดค้างชำระตั้งแต่ 61 วันขึ้นไป(M2,NPL) มากกว่า 5% ของยอด O/S Balance ในสาขา จะถูกระงับการปล่อยสินเชื่อในเดือนถัดไป</span>
                                            <span>*เฉพาะลูกค้าที่ตั้งวันเงินตั้งแต่ ก.พ.60 เป็นต้นไป (กรณีสาขาที่ถูกระงับและอนุมัติให้ปล่อยสินเชื่อใหม่ จะเริ่มนับเฉพาะลูกค้าตั้งแต่เดือนที่ปล่อยสินเชื่อใหม่ เป็นต้นไป)</span>
                                        </div>
                                    }>
                                    <Icon type="info-circle-o" />
                                </Popover>
                            </div>
                        </div>
                        <div style={{ marginLeft: '-5px', marginRight: '-5px', background: '#FFF', position: 'relative', width: '1200px', display: 'inline-flex' }}>
                            <div className={styles['animation-slide']} style={{ width: '605px', marginLeft: `${!_.isEmpty(this.state.showSubPage) ? '-610px' : '0'}`, marginRight: '5px' }}>
                                <Table
                                    className={styles['summary-table-visit']}
                                    dataSource={this.getDataSource()}
                                    columns={[{
                                        title: 'Br. Name',
                                        className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                        dataIndex: 'BranchName',
                                        key: 'BranchName',
                                        width: '30%',
                                        render: (text, record, index) => {
                                            return (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Tooltip title={`${text}`} placement="left" >
                                                        <span className={styles['text-ellipsis-visit']}>{text}</span>
                                                    </Tooltip>
                                                </div>
                                            )
                                        }
                                    }, {
                                        title: 'Region',
                                        className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                        dataIndex: 'RegionID',
                                        key: 'RegionID',
                                        width: '10%'
                                    }, {
                                        title: 'Warning / Stop',
                                        className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                        width: '20%',
                                        children: [
                                            {
                                                title: 'Cust',
                                                className: `${styles['align-center']} ${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                dataIndex: 'CustM2NPLFebUp',
                                                key: 'CustM2NPLFebUp',
                                                width: '10%'
                                            }, {
                                                title: 'DPD (Mb)',
                                                className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                dataIndex: 'M2NPLFebUp',
                                                key: 'M2NPLFebUp',
                                                width: '10%',
                                                render: (text, record, index) => {
                                                    return <span className={`${styles['align-right']} ${styles['span-text']}`}>{text}</span>
                                                }
                                            }, {
                                                title: '%',
                                                className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                dataIndex: 'StopApproval',
                                                key: 'StopApproval',
                                                width: '10%',
                                                render: (text, record, index) => {
                                                    return <span className={`${styles['align-right']} ${styles['span-text']}`} style={{ color: (parseFloat(text).toFixed(2) >= 5 ? 'red' : '#000') }}>{parseFloat(text).toFixed(2)}%</span>
                                                }
                                            }
                                        ]
                                    }, {
                                        title: 'Forecast',
                                        className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                        width: '20%',
                                        children: [{
                                            title: 'Cust',
                                            className: `${styles['align-center']} ${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                            dataIndex: 'CustFCFebUp',
                                            key: 'CustFCFebUp',
                                            width: '10%'
                                        }, {
                                            title: 'DPD (Mb)',
                                            className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                            dataIndex: 'FCFebUp',
                                            key: 'FCFebUp',
                                            width: '10%',
                                            render: (text, record, index) => {
                                                return <span className={`${styles['align-right']} ${styles['span-text']}`}>{text}</span>
                                            }
                                        }, {
                                            title: 'Total',
                                            className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                            dataIndex: 'TotalMinAmt',
                                            key: 'TotalMinAmt',
                                            width: '10%',
                                            render: (text, record, index) => {
                                                return <span className={`${styles['align-right']} ${styles['span-text']}`} style={{ color: (parseFloat(text).toFixed(2) >= 5 ? 'red' : '#000') }}>{parseFloat(text).toFixed(2)}%</span>
                                            }
                                        }]
                                    }]}
                                    pagination={{
                                        pageSize: 15,
                                        size: 'small'
                                    }}
                                    loading={!NANO_VISIT_POPUP_STATUS}
                                    onRowClick={this.onRowClick}
                                    bordered />
                            </div>
                            <div className={styles['animation-slide']}>
                                <div onClick={this.backToMainPage}><a>{`<< Back`}</a></div>
                                <div>
                                    {
                                        !_.isEmpty(this.state.showSubPage) &&
                                        <Table
                                            className={styles['summary-table-visit']}
                                            dataSource={this.state.showSubPage.result}
                                            columns={
                                                [{
                                                    title: `${this.state.showSubPage.branch.RegionID} / ${this.state.showSubPage.branch.BranchName} (Total Customer ${this.state.showSubPage.result.length} Forecast ${this.state.showSubPage.branch.FCStopApproval}% OS ${this.state.showSubPage.branch.OSFebUp} )`,
                                                    className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                    children: [{
                                                        title: 'MarketName',
                                                        className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                        dataIndex: 'MarketName',
                                                        key: 'MarketName',
                                                        width: '22%',
                                                        render: (text, record, index) => {
                                                            return (
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Tooltip title={`${text}`} placement="left" >
                                                                        <span className={styles['text-ellipsis-visit-b']}>{text}</span>
                                                                    </Tooltip>
                                                                </div>
                                                            )
                                                        },
                                                        sorter: (a, b) => a.MarketName.length - b.MarketName.length
                                                    }, {
                                                        title: 'CA Name',
                                                        className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                        dataIndex: 'CAName',
                                                        key: 'CAName',
                                                        render: (text, record, index) => {
                                                            return (
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Tooltip title={`${text}`} placement="left" >
                                                                        <span className={styles['text-ellipsis-visit-b']}>{text}</span>
                                                                    </Tooltip>
                                                                </div>
                                                            )
                                                        },
                                                        filters: caFilter,
                                                        onFilter: (value, record) => record.CAName.includes(value),
                                                        sorter: (a, b) => a.CAName.length - b.CAName.length
                                                    }, {
                                                        title: 'Cust. Name',
                                                        className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                        dataIndex: 'AccountName',
                                                        key: 'AccountName',
                                                        width: '15%',
                                                        render: (text, record, index) => {
                                                            return (
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Tooltip title={`${text}`} placement="left" >
                                                                        <span className={styles['text-ellipsis-visit-b']}>{text}</span>
                                                                    </Tooltip>
                                                                </div>
                                                            )
                                                        }
                                                    }, {
                                                        title: (<div className={styles['div-center']}><span>DPD</span><br /><span>Bucket</span></div>),
                                                        className: `${styles['xsm-padding']} ${styles['vertical-middle']} ${styles['align-sort-item']}`,
                                                        dataIndex: 'DPDBucket',
                                                        key: 'DPDBucket',
                                                        width: '12%',
                                                        render: (text, record, index) => {
                                                            return <span className={`${styles['align-right']} ${styles['span-text']}`}>{text}</span>
                                                        },
                                                        sorter: (a, b) => a.BucketSeq - b.BucketSeq
                                                    }, {
                                                        title: (<div className={styles['div-center']}><span>OS</span><br /><span>(Mb)</span></div>),
                                                        className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                        dataIndex: 'Principle',
                                                        key: 'Principle',
                                                        render: (text, record, index) => {
                                                            return <span className={`${styles['align-right']} ${styles['span-text']}`}>{text}</span>
                                                        }
                                                    }, {
                                                        title: (<div className={styles['div-center']}><span>DPD</span><br /><span>(Mb)</span></div>),
                                                        className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                        dataIndex: 'Amount To Collect',
                                                        key: 'Amount To Collect',
                                                        render: (text, record, index) => {
                                                            return <span className={`${styles['align-right']} ${styles['span-text']}`}>{text}</span>
                                                        }
                                                    }, {
                                                        title: (<div className={styles['div-center']}><span>MIN</span><br /><span>(BHT)</span></div>),
                                                        className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                        dataIndex: 'MinAmt',
                                                        key: 'MinAmt',
                                                        render: (text, record, index) => {
                                                            return <span className={`${styles['align-right']} ${styles['span-text']}`}>{numberWithCommas(text)}</span>
                                                        }
                                                    }, {
                                                        title: 'Note',
                                                        className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                        dataIndex: 'Cause_Detail',
                                                        key: 'Cause_Detail',
                                                        render: (text, record, index) => {
                                                            return (
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Tooltip title={`${text}`} placement="left" >
                                                                        <span className={styles['text-ellipsis-visit-b']}>{text}</span>
                                                                    </Tooltip>
                                                                </div>
                                                            )
                                                        }
                                                    }]
                                                }]
                                            }
                                            pagination={{
                                                pageSize: 15,
                                                size: 'small'
                                            }}
                                            bordered />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            </Layout >
        )
    }
}

export default connect(
    (state) => ({
        NANO_VISIT_POPUP_INFO: state.NANO_VISIT_POPUP_INFO,
        NANO_VISIT_POPUP_STATUS: state.NANO_VISIT_POPUP_STATUS
    }), {
    })(StopApproval)