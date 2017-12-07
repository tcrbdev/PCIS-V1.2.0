import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Icon, Tooltip, Popover, Card, Timeline, Table } from 'antd';

import FontAwesome from 'react-fontawesome'
import moment from 'moment'

import styles from './index.scss'


class StopApproval extends Component {

    state = {
        showSubPage: {},
        filteredInfo: null,
        sortedInfo: null,
    }

    getHeaderTitle = (props) => {
        const { item, ON_CLOSE_MARKER, custom_width } = props

        return (
            <div className={styles['headers']} style={{ background: '#FF9800' }}>
                <FontAwesome className="trigger" name='exclamation-triangle' />
                <span>Warning Stop Approval</span>
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

    render() {
        const { item, ON_CLOSE_MARKER, custom_width, NANO_VISIT_POPUP_INFO, NANO_VISIT_POPUP_STATUS, NO_HEADER } = this.props

        return (
            <Layout style={{ width: custom_width ? custom_width : '610px', overflow: 'hidden', background: '#FFF' }}>
                {
                    !NO_HEADER &&
                    this.getHeaderTitle(this.props)
                }
                <Layout style={{ backgroundColor: '#FFF', margin: '10px 10px 5px 10px', background: '#FFF' }}>
                    <div style={{ marginLeft: '-5px', marginRight: '-5px', background: '#FFF', position: 'relative', width: '1200px', display: 'inline-flex' }}>
                        <div className={styles['animation-slide']} style={{ width: '605px', marginLeft: `${!_.isEmpty(this.state.showSubPage) ? '-610px' : '0'}`, marginRight: '5px' }}>
                            <Table
                                className={styles['summary-table-visit']}
                                dataSource={NANO_VISIT_POPUP_INFO[1]}
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
                                        title: '%',
                                        className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                        dataIndex: 'FCStopApproval',
                                        key: 'FCStopApproval',
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
                                                title: `${this.state.showSubPage.branch.RegionID} / ${this.state.showSubPage.branch.BranchName} (Total Customer ${this.state.showSubPage.result.length} Forecast ${this.state.showSubPage.branch.FCStopApproval}%)`,
                                                className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                children: [{
                                                    title: 'MarketName',
                                                    className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                    dataIndex: 'MarketName',
                                                    key: 'MarketName',
                                                    width: '25%',
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
                                                    filters: this.state.showSubPage.result.map(item => ({ text: item.CAName, value: item.CAName })),
                                                    onFilter: (value, record) => record.CAName.includes(value),
                                                    sorter: (a, b) => a.CAName.length - b.CAName.length
                                                }, {
                                                    title: 'Cust. Name',
                                                    className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                    dataIndex: 'AccountName',
                                                    key: 'AccountName',
                                                    width: '20%',
                                                    render: (text, record, index) => {
                                                        return (
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Tooltip title={`${text}`} placement="left" >
                                                                    <span className={styles['text-ellipsis-visit-b']}>{text}</span>
                                                                </Tooltip>
                                                            </div>
                                                        )
                                                    },
                                                    sorter: (a, b) => a.AccountName.length - b.AccountName.length
                                                }, {
                                                    title: (<div className={styles['div-center']}><span>DPD</span><br /><span>Bucket</span></div>),
                                                    className: `${styles['xsm-padding']} ${styles['vertical-middle']}`,
                                                    dataIndex: 'DPDBucket',
                                                    key: 'DPDBucket',
                                                    render: (text, record, index) => {
                                                        return <span className={`${styles['align-right']} ${styles['span-text']}`}>{text}</span>
                                                    }
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