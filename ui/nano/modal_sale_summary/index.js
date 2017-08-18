import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Icon, Button, Table, Tooltip, Modal, Form, Row, Col, Popover } from 'antd';

const { Header } = Layout

import _ from 'lodash'
import FontAwesome from 'react-fontawesome'
import { Doughnut } from 'react-chartjs-2'
import moment from 'moment'

import { getCASummaryOnlyData } from '../actions/nanomaster'

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
                return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) > 100 ? 0 : 1)}%` : text}</span>
            }
        }],
    }, {
        title: (
            <div className={`${styles['div-point']} `}>
                <span>Setup</span>
            </div>
        ),
        dataIndex: 'SETUP',
        key: 'SETUP',
        width: '16%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) > 100 ? 0 : 1)}%` : text}</span>
        }
    }, {
        title: (
            <div className={styles['div-point']}>
                <span>Reject</span>
            </div>
        ),
        dataIndex: 'REJECT',
        key: 'REJECT',
        width: '16%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) > 100 ? 0 : 1)}%` : text}</span>
        }
    }, {
        title: (
            <div className={styles['div-point']}>
                <span>Cancel</span>
            </div>
        ),
        dataIndex: 'CANCEL',
        key: 'CANCEL',
        width: '16%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) > 100 ? 0 : 1)}%` : text}</span>
        }
    }, {
        title: (
            <div className={styles['div-point']}>
                <span>Potential</span>
            </div>
        ),
        dataIndex: 'POTENTIAL',
        key: 'POTENTIAL',
        width: '16%',
        className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) > 100 ? 0 : 1)}%` : text}</span>
        }
    }]
}

const getColumnCA = [{
    title: (<div className={styles['div-center']}><span>Name</span></div>),
    dataIndex: 'MarketName',
    key: 'MarketName',
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

class ModalSaleSummary extends Component {

    state = {
        modalOpen: false
    }

    componentWillReceiveProps(nextsProps) {
        this.getCAContribution(nextsProps)
    }

    componentDidMount() {
        this.getCAContribution(this.props)
    }

    handleModal = () => {
        const { getFieldValue } = this.props.form
        this.props.getCASummaryOnlyData(getFieldValue("select_ca"))
        this.setState({ modalOpen: !this.state.modalOpen })
    }

    handleCancel = () => {
        this.setState({ modalOpen: !this.state.modalOpen })
    }

    chartData = () => {

        const { CA_SUMMARY_ONLY_MARKET_CONTRIBUTION } = this.props

        let data = [], labels = []
        _.mapKeys(_.groupBy(CA_SUMMARY_ONLY_MARKET_CONTRIBUTION, 'MarketCode'), (value, key) => {
            const os = _.find(value, { Status: 'OS' })
            data.push(os.Ach)
            labels.push(value[0].MarketName)
        })

        return {
            data: {
                datasets: [{
                    data: data,
                    backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"]
                }],
                labels: labels,
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

    getCAPenetation = () => {

        const { CA_SUMMARY_ONLY_MARKET_PENETRATION } = this.props

        if (!_.isEmpty(CA_SUMMARY_ONLY_MARKET_PENETRATION)) {
            const Amt = _.find(CA_SUMMARY_ONLY_MARKET_PENETRATION, { Status: 'OS' }) || { Total: 0, Ach: 0 }
            const os = _.find(CA_SUMMARY_ONLY_MARKET_PENETRATION, { Status: 'OS' }) || { Total: 0, Ach: 0 }
            const setup = _.find(CA_SUMMARY_ONLY_MARKET_PENETRATION, { Status: 'APPROVED' }) || { Total: 0, Ach: 0 }
            const reject = _.find(CA_SUMMARY_ONLY_MARKET_PENETRATION, { Status: 'REJECTED' }) || { Total: 0, Ach: 0 }
            const cancel = _.find(CA_SUMMARY_ONLY_MARKET_PENETRATION, { Status: 'CANCELLED' }) || { Total: 0, Ach: 0 }
            const potential = _.find(CA_SUMMARY_ONLY_MARKET_PENETRATION, { Status: 'POTENTIAL' }) || { Total: 0, Ach: 0 }
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

    getCAContribution = () => {
        const { CA_SUMMARY_ONLY_MARKET_CONTRIBUTION } = this.props

        let result = []
        _.mapKeys(_.groupBy(CA_SUMMARY_ONLY_MARKET_CONTRIBUTION, 'MarketCode'), (value, key) => {

            const os = _.find(value, { Status: 'OS' })
            const approved = _.find(value, { Status: 'APPROVED' })
            const reject = _.find(value, { Status: 'REJECTED' })
            const cancel = _.find(value, { Status: 'CANCELLED' })
            const total = _.find(value, { Status: 'TOTAL' })

            const obj = {
                MarketCode: key,
                MarketName: value[0].MarketName,
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
            }
            result.push(obj)
        })

        return _.orderBy(result, ['OS_Ach', 'Setup_Ach', 'CAID'], ['desc', 'desc', 'asc'])
    }

    render() {
        const { getFieldValue } = this.props.form
        const ca_code = getFieldValue("select_ca")
        const find = _.find(this.props.RELATED_CA_IN_MARKET_DATA, { CA_Code: ca_code })
        const start_work_date = !_.isEmpty(find) ? moment.duration(moment(new Date()).diff(moment(find.StartWork)))._data : ''
        const work_date_format = `Working period : ${start_work_date.years}.${start_work_date.months}.${start_work_date.days}`
        const ca_name = !_.isEmpty(find) ? find.CA_Name : ''
        const count_market = Object.keys(_.groupBy(this.props.CA_SUMMARY_ONLY_MARKET_CONTRIBUTION, 'MarketCode')).length
        const os = _.find(this.props.CA_SUMMARY_ONLY_MARKET_PENETRATION, { Status: 'OS' }) || { Total: 0, Ach: 0 }

        return (
            <div style={{ marginLeft: '0px' }}>
                <Modal className={styles['modalSaleSummary']}
                    title={
                        <div className={styles['header-container']}>
                            <img className={styles['ca-img']} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${ca_code}`} />
                            <div>
                                <span>{ca_name}</span>
                                <span>{work_date_format}</span>
                            </div>
                        </div>
                    }
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
                                        <Doughnut {...this.chartData() } />
                                        <span>{os.Ach}%</span>
                                    </div>
                                    <div>
                                        <div className={styles['text-descrition']}>
                                            <div>
                                                <span>{`${count_market} Market `}</span>
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
                                                    dataSource={this.getCAPenetation()}
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
                                            dataSource={this.getCAContribution()}
                                            columns={getColumnCA}
                                            pagination={false}
                                            bordered />
                                    </Layout>
                                </div>
                            </div>
                        </Layout>
                    </Layout>
                </Modal>
                <Tooltip title="Market Penatation"><FontAwesome style={{ color: '#E91E63' }} name="table" onClick={this.handleModal} /></Tooltip>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        RELATED_CA_IN_MARKET_DATA: state.RELATED_CA_IN_MARKET_DATA,
        CA_SUMMARY_ONLY_MARKET_PENETRATION: state.CA_SUMMARY_ONLY_MARKET_PENETRATION,
        CA_SUMMARY_ONLY_MARKET_CONTRIBUTION: state.CA_SUMMARY_ONLY_MARKET_CONTRIBUTION
    }),
    {
        getCASummaryOnlyData: getCASummaryOnlyData
    })(ModalSaleSummary)