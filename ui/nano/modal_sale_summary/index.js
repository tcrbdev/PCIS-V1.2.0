import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Icon, Button, Table, Tooltip, Modal, Form, Row, Col, Popover } from 'antd';

const { Header } = Layout

import _ from 'lodash'
import FontAwesome from 'react-fontawesome'
import { Doughnut } from 'react-chartjs-2'
import moment from 'moment'

import styles from './index.scss'

const color = [
    { status: 'OS', color: '#00BCD4' },
    { status: 'SETUP', color: '#8bc34a' },
    { status: 'REJECT', color: '#e91e63' },
    { status: 'CANCEL', color: '#ff5722' },
    { status: 'POTENTIAL', color: '#9e9e9e' }];

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
                return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(1)}%` : text}</span>
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


class ModalSaleSummary extends Component {

    state = {
        modalOpen: false
    }

    handleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen })
    }

    handleCancel = () => {
        this.setState({ modalOpen: !this.state.modalOpen })
    }

    render() {
        return (
            <div>
                <Modal className={styles['modalSaleSummary']}
                    title={'Sale Summary'}
                    visible={this.state.modalOpen}
                    onOk={false}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <Layout>
                        <Layout style={{ backgroundColor: '#FFF', padding: '10px' }}>
                            <div className={styles['detail-container']}>
                                <div className={styles['detail-chart']}>
                                    <div style={{ width: '160px', height: '160px' }}>
                                        <Doughnut  />
                                        <span></span>
                                    </div>
                                    <div>
                                        <div className={styles['text-descrition']}>
                                            <div>
                                                <span>{`${'current_branch.MarketShop'} Shop `}</span>
                                                <span>{`from ${'current_branch.Market'} Market (Open on )`}</span>
                                            </div>
                                            <span>
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
                                                    dataSource={[]}
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
                                            dataSource={[]}
                                            columns={getColumnCA}
                                            pagination={false}
                                            bordered />
                                    </Layout>
                                </div>
                            </div>
                        </Layout>
                    </Layout>
                </Modal>
                <FontAwesome name="line-chart" onClick={this.handleModal} />
            </div>
        )
    }
}

export default connect(
    (state) => ({
    }),
    {
    })(ModalSaleSummary)