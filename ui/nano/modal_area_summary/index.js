import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Icon, Button, Table, Tooltip, Modal, Form, Row, Col, Popover } from 'antd';
import Draggable from 'react-draggable'
import Scrollbar from 'react-smooth-scrollbar';

const { Header } = Layout

import _ from 'lodash'
import FontAwesome from 'react-fontawesome'
import { Doughnut } from 'react-chartjs-2'
import moment from 'moment'

import { getCASummaryOnlyData } from '../actions/nanomaster'
import { constantQueryType } from '../../common/constants/constants'

import styles from './index.scss'
import cls from './modal_hack.css'
// import antstyle from './modal_hack.css'

const color = ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA", "#EEE"]
// const color = [
//     { status: 'OS', color: '#00BCD4' },
//     { status: 'SETUP', color: '#8bc34a' },
//     { status: 'REJECT', color: '#e91e63' },
//     { status: 'CANCEL', color: '#ff5722' },
//     { status: 'POTENTIAL', color: '#9e9e9e' }];

const getMarketSummaryColumns = () => {
    return [{
        title: (<div className={styles['div-center']}><span>Detail</span></div>),
        dataIndex: 'Detail',
        key: 'Detail',
        width: '15%',
        className: `${styles['align-left']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return <span>{text == 'Total App' ? 'Total Cust' : text}</span>
        }
    }, {
        title: (<div className={styles['div-center']}><span>OS Bal.</span></div>),
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
            width: '8%',
            className: `${styles['header-hide']} ${styles['align-right-hightlight']} ${styles['align-center']} sm-padding`,
            render: (text, record, index) => {
                return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%` : text}</span>
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
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%` : text}</span>
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
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%` : text}</span>
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
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%` : text}</span>
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
            return <span className={text < 0 && styles['red-font']}>{record.Detail == "Achive" ? `${parseFloat(text).toFixed(parseInt(text) >= 100 ? 0 : 1)}%` : text}</span>
        }
    }]
}

const getColumnCA = (data) => {
    return [{
        title: (<div className={styles['div-center']}><span>Name</span></div>),
        dataIndex: 'Name',
        key: 'Name',
        width: '14%',
        className: `${styles['align-left']} ${styles['sm-padding']} ${styles['vertical-middle']} sub-title`,
        render: (text, record, index) => {
            if (!_.isEmpty(record.EmpCode)) {
                return (
                    <Popover placement="top" content={
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <img className={styles['ca-big-img']} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${record.EmpCode}`} />
                            <span>{text}</span>
                            <span>{`${record.NameTH}`} {`(${record.NickName})`}</span>
                            <span>{`อายุงาน ${record.YMD}`}</span>
                            <span>{`${record.Mobile}`}</span>
                        </div>
                    } >
                        <span className={styles['text-ellipsis']}>{text}</span>
                    </Popover>
                )
            }
            else {
                return (
                    <Tooltip title={text} placement="top" >
                        <span className={styles['text-ellipsis']}>{text}</span>
                    </Tooltip>
                )
            }
        }
    }, {
        title: (<div className={styles['div-center']}>Start<br />Month</div>),
        dataIndex: 'StartWork',
        key: 'StartWork',
        width: '6%',
        className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        render: (text, record, index) => {
            return !_.isEmpty(text) && text.split('T').length > 1 ? moment(text.split('T')[0]).format('MMM-YY') : ''
        }
    }, {
        title: (<div className={styles['div-center']}>Status</div>),
        dataIndex: 'CycleDueDate',
        key: 'CycleDueDate',
        width: '7%',
        className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`
    }, {
        title: (<span className={styles['align-center']}>OS Bal.</span>),
        className: `${styles['hight-light']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        children: [{
            title: (<div className={styles['div-center']}><span>Cust</span></div>),
            dataIndex: 'OS',
            key: 'OS',
            width: '4.5%',
            className: `${styles['align-right-hightlight']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
            render: (text, record, index) => {
                return <span className={text < 0 && styles['red-font']}>{text}</span>
            }
        }, {
            title: (<div className={styles['div-center']}><span>%</span></div>),
            dataIndex: 'OS_ACH',
            key: 'OS_ACH',
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
            dataIndex: 'APPROVED',
            key: 'APPROVED',
            width: '4.5%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
            render: (text, record, index) => {
                return <span className={text < 0 && styles['red-font']}>{text}</span>
            }
        }, {
            title: (<div className={styles['div-center']}><span>%</span></div>),
            dataIndex: 'APPROVED_ACH',
            key: 'APPROVED_ACH',
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
            dataIndex: 'REJECTED',
            key: 'REJECTED',
            width: '4.5%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
            render: (text, record, index) => {
                return <span className={text < 0 && styles['red-font']}>{text}</span>
            }
        }, {
            title: (<div className={styles['div-center']}><span>%</span></div>),
            dataIndex: 'REJECTED_ACH',
            key: 'REJECTED_ACH',
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
            dataIndex: 'CANCELLED',
            key: 'CANCELLED',
            width: '4.5%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
            render: (text, record, index) => {
                return <span className={text < 0 && styles['red-font']}>{text}</span>
            }
        }, {
            title: (<div className={styles['div-center']}><span>%</span></div>),
            dataIndex: 'CANCELLED_ACH',
            key: 'CANCELLED_ACH',
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
            dataIndex: 'TOTAL',
            key: 'TOTAL',
            width: '4.5%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
            render: (text, record, index) => {
                return <span className={text < 0 && styles['red-font']}>{text}</span>
            }
        }, {
            title: (<div className={styles['div-center']}><span>%</span></div>),
            dataIndex: 'TOTAL_ACH',
            key: 'TOTAL_ACH',
            width: '4.5%',
            className: `${styles['align-right']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
            render: (text, record, index) => {
                return <span className={text < 0 && styles['red-font']}>{parseFloat(text).toFixed(0)}%</span>
            }
        }]
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

class ModalSaleSummary extends Component {

    state = {
        modalOpen: false,
        showAddNoteModal: false,
        modalSelectData: null
    }

    componentWillReceiveProps(nextsProps) {
        this.getCAContribution(nextsProps)
    }

    componentDidMount() {
        if (document.getElementById('modal-area-summary') === null || document.getElementById('modal-area-summary') === undefined) {
            var divModal = document.createElement("div")
            divModal.id = 'modal-area-summary'

            document.getElementById('add-area').appendChild(divModal)
        }

        this.getCAContribution(this.props)
    }

    handleModal = () => {
        // const { getFieldValue } = this.props.form
        // this.props.getCASummaryOnlyData(getFieldValue("select_ca"))
        this.setState({ modalOpen: !this.state.modalOpen })
    }

    handleCancel = () => {
        this.setState({ modalOpen: !this.state.modalOpen })
    }

    chartData = () => {

        const { RELATED_GROUP_BY_MARKET_SUMMARY_DATA } = this.props
        const GroupTotal = RELATED_GROUP_BY_MARKET_SUMMARY_DATA[0]

        // const ca_con = this.getCAContribution()

        // let data = [], labels = [], bg = [], top = 5
        // ca_con.map((item, index) => {
        //     if (index < top) {
        //         data.push(item.OS_App)
        //         labels.push(item.label)
        //         bg.push(item.color)
        //     }
        //     else if (index == top) {
        //         data.push(_.sumBy(_.filter(ca_con, { label: 'Other' }), 'OS_App'))
        //         labels.push('Other')
        //         bg.push(item.color)
        //     }
        // })

        return {
            data: {
                datasets: [{
                    data: !_.isEmpty(GroupTotal) ? [parseFloat(GroupTotal[2].SETUP), parseFloat(GroupTotal[2].REJECTED), parseFloat(GroupTotal[2].CANCELLED), parseFloat(GroupTotal[2].TOTAL)] : [],
                    backgroundColor: ['#8bc34a', '#e91e63', '#ff5722', '#9e9e9e']
                }],
                labels: ['SETUP', 'REJECTED', 'CANCEL', 'POTENTIAL'],
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

        const { RELATED_GROUP_BY_MARKET_SUMMARY_DATA } = this.props
        const GroupTotal = RELATED_GROUP_BY_MARKET_SUMMARY_DATA[0]

        if (!_.isEmpty(GroupTotal)) {

            const sum_penatation = 100 - parseFloat(GroupTotal[2].TOTAL)

            return [
                {
                    Detail: GroupTotal[0].Detail,
                    Amt: GroupTotal[1].OS ? GroupTotal[1].OS : '',
                    OS: GroupTotal[0].OS,
                    SETUP: GroupTotal[0].SETUP,
                    REJECT: GroupTotal[0].REJECTED,
                    CANCEL: GroupTotal[0].CANCELLED,
                    POTENTIAL: GroupTotal[0].TOTAL,
                    sum_penatation: sum_penatation,
                    total_shop: GroupTotal[0].TotalShop,
                    total_market: GroupTotal[0].TotalMarket
                },
                {
                    Detail: GroupTotal[2].Detail,
                    OS: GroupTotal[2].OS,
                    SETUP: GroupTotal[2].SETUP,
                    REJECT: GroupTotal[2].REJECTED,
                    CANCEL: GroupTotal[2].CANCELLED,
                    POTENTIAL: GroupTotal[2].TOTAL,
                    sum_penatation: sum_penatation,
                    total_shop: GroupTotal[0].TotalShop,
                    total_market: GroupTotal[0].TotalMarket
                },
            ]
        }
        else {
            return []
        }
    }

    getCAContribution = () => {
        const { RELATED_GROUP_BY_MARKET_SUMMARY_DATA, NANO_FILTER_CRITERIA } = this.props

        const RegionSummary = RELATED_GROUP_BY_MARKET_SUMMARY_DATA[6]
        const AreaSummary = RELATED_GROUP_BY_MARKET_SUMMARY_DATA[5]
        const ZoneSummary = RELATED_GROUP_BY_MARKET_SUMMARY_DATA[4]
        const BranchSummary = RELATED_GROUP_BY_MARKET_SUMMARY_DATA[3]
        const MarketSummary = RELATED_GROUP_BY_MARKET_SUMMARY_DATA[2]
        const CASummary = RELATED_GROUP_BY_MARKET_SUMMARY_DATA[1]

        let data = []

        switch (NANO_FILTER_CRITERIA.QueryType) {
            case constantQueryType.region:
            case '':
                data = RegionSummary.map((region_item, region_index) => {
                    region_item.key = region_item.RegionID
                    region_item.Name = region_item.RegionID
                    region_item.children = _.filter(AreaSummary, { RegionID: region_item.RegionID }).map((area_item, area_index) => {
                        area_item.key = area_item.AreaID
                        area_item.Name = area_item.AreaID
                        area_item.children = _.filter(ZoneSummary, { AreaID: area_item.AreaID }).map((zone_item, zone_index) => {
                            zone_item.key = zone_item.ZoneValue
                            zone_item.Name = zone_item.ZoneValue
                            zone_item.children = _.filter(BranchSummary, { ZoneValue: zone_item.ZoneValue }).map((branch_item, branch_index) => {
                                branch_item.key = branch_item.BranchCode
                                branch_item.Name = branch_item.BranchName
                                branch_item.children = _.filter(MarketSummary, { BranchCode: branch_item.BranchCode }).map((market_item, market_index) => {
                                    market_item.key = market_item.MarketCode
                                    market_item.Name = market_item.MarketName
                                    market_item.children = _.filter(CASummary, { MarketCode: market_item.MarketCode }).map((ca_item, ca_index) => {
                                        ca_item.key = `${market_item.MarketCode}_${ca_item.CAID}`
                                        ca_item.Name = ca_item.CAName
                                        return ca_item
                                    })
                                    return market_item
                                })
                                return branch_item
                            })
                            return zone_item
                        })
                        return area_item
                    })
                    return region_item
                })
                break;
            case constantQueryType.area:
                data = AreaSummary.map((area_item, area_index) => {
                    area_item.key = area_item.AreaID
                    area_item.Name = area_item.AreaID
                    area_item.children = _.filter(ZoneSummary, { AreaID: area_item.AreaID }).map((zone_item, zone_index) => {
                        zone_item.key = zone_item.ZoneValue
                        zone_item.Name = zone_item.ZoneValue
                        zone_item.children = _.filter(BranchSummary, { ZoneValue: zone_item.ZoneValue }).map((branch_item, branch_index) => {
                            branch_item.key = branch_item.BranchCode
                            branch_item.Name = branch_item.BranchName
                            branch_item.children = _.filter(MarketSummary, { BranchCode: branch_item.BranchCode }).map((market_item, market_index) => {
                                market_item.key = market_item.MarketCode
                                market_item.Name = market_item.MarketName
                                market_item.children = _.filter(CASummary, { MarketCode: market_item.MarketCode }).map((ca_item, ca_index) => {
                                    ca_item.key = `${market_item.MarketCode}_${ca_item.CAID}`
                                    ca_item.Name = ca_item.CAName
                                    return ca_item
                                })
                                return market_item
                            })
                            return branch_item
                        })
                        return zone_item
                    })
                    return area_item
                })
                break;
            case constantQueryType.zone:
                data = ZoneSummary.map((zone_item, zone_index) => {
                    zone_item.key = zone_item.ZoneValue
                    zone_item.Name = zone_item.ZoneValue
                    zone_item.children = _.filter(BranchSummary, { ZoneValue: zone_item.ZoneValue }).map((branch_item, branch_index) => {
                        branch_item.key = branch_item.BranchCode
                        branch_item.Name = branch_item.BranchName
                        branch_item.children = _.filter(MarketSummary, { BranchCode: branch_item.BranchCode }).map((market_item, market_index) => {
                            market_item.key = market_item.MarketCode
                            market_item.Name = market_item.MarketName
                            market_item.children = _.filter(CASummary, { MarketCode: market_item.MarketCode }).map((ca_item, ca_index) => {
                                ca_item.key = `${market_item.MarketCode}_${ca_item.CAID}`
                                ca_item.Name = ca_item.CAName
                                return ca_item
                            })
                            return market_item
                        })
                        return branch_item
                    })
                    return zone_item
                })
                break;
            case constantQueryType.branch:
            case constantQueryType.branch_kiosk:
                data = BranchSummary.map((item, index) => {
                    item.key = item.BranchCode
                    item.Name = item.BranchName
                    item.children = _.filter(MarketSummary, { BranchCode: item.BranchCode }).map((market_item, market_index) => {
                        market_item.key = market_item.MarketCode
                        market_item.Name = market_item.MarketName
                        market_item.children = _.filter(CASummary, { MarketCode: market_item.MarketCode }).map((ca_item, ca_index) => {
                            ca_item.key = `${market_item.MarketCode}_${ca_item.CAID}`
                            ca_item.Name = ca_item.CAName
                            return ca_item
                        })
                        return market_item
                    })
                    return item
                })
                break;
            case constantQueryType.ca:
                data = MarketSummary.map((market_item, market_index) => {
                    market_item.key = market_item.MarketCode
                    market_item.Name = market_item.MarketName
                    market_item.children = _.filter(CASummary, { MarketCode: market_item.MarketCode }).map((ca_item, ca_index) => {
                        ca_item.key = `${market_item.MarketCode}_${ca_item.CAID}`
                        ca_item.Name = ca_item.CAName
                        return ca_item
                    })
                    return market_item
                })
                break;
        }

        // if (!_.isEmpty(BranchSummary)) {
        //     data = BranchSummary.map((item, index) => {
        //         item.key = item.BranchCode
        //         item.Name = item.BranchName
        //         item.children = _.filter(CASummary, { BranchCode: item.BranchCode }).map((ca_item, ca_index) => {
        //             ca_item.key = ca_item.CAID
        //             ca_item.Name = ca_item.CAName
        //             return ca_item
        //         })
        //         return item
        //     })
        // }

        return data
    }

    handleShowModal = () => {
        this.setState({ showAddNoteModal: true })
    }

    handleCancelNote = () => {
        this.setState({ showAddNoteModal: false })
    }

    onRowClassName = (record, index) => {
        if (!_.isEmpty(record.CAName))
            return styles['last-row-hilight']
    }

    render() {

        const { modalSelectData } = this.state
        const ca_name = 'TESTER'
        const TotalData = this.getCAPenetation()

        return (
            <div style={{ marginLeft: '0px' }}>
                <Modal
                    wrapClassName={`parent_salesummary ${styles['modalParentSaleSummary']}`}
                    className={styles['modalSaleSummary']}
                    visible={this.state.modalOpen}
                    onOk={false}
                    onCancel={this.handleCancel}
                    footer={null}
                    closable={false}
                    maskClosable={false}
                    mask={false}
                    getContainer={() => document.getElementById('modal-area-summary')}
                >

                    <article className={styles['wrapper']}>
                        <div className={styles['header-container']}>
                            <FontAwesome style={{ marginLeft: '10px', fontSize: '14px' }} name="table" />
                            <div className={styles['title-img']}>
                                <span style={{ marginLeft: '5px' }}>
                                    Market Penatation
                                </span>
                            </div>
                            <Icon
                                onClick={this.handleCancel}
                                className={styles["trigger-close"]}
                                type='close' />
                        </div>
                        <Layout>
                            <Layout style={{ backgroundColor: '#FFF', 'padding': '10px' }}>
                                <div className={styles['detail-container']}>
                                    <div className={styles['detail-chart']}>
                                        <div style={{ width: '160px', height: '160px' }}>
                                            <Doughnut {...this.chartData() } style={{ position: 'absolute' }} />
                                            <span>{TotalData.length > 0 ? parseFloat(TotalData[0].sum_penatation).toFixed(0) : 0}%</span>
                                        </div>
                                        <div>
                                            <div className={styles['text-descrition']}>
                                                <div>
                                                    <span>{`${TotalData.length > 0 ? TotalData[0].total_shop : 0} Shop`}</span>
                                                    <span>{` From ${TotalData.length > 0 ? TotalData[0].total_market : 0} Markets`}</span>
                                                </div>
                                                <span>
                                                    {``}
                                                </span>
                                            </div>
                                            <div className={styles['box-shadow']}>
                                                <div className={`${styles['header']} ${styles['header-border']}`}>
                                                    <Icon
                                                        className="trigger"
                                                        type='bars' />
                                                    <span>Market Penetation</span>
                                                </div>
                                                <Layout style={{ backgroundColor: '#FFF' }}>
                                                    <Table
                                                        className={styles['summary-table-not-odd']}
                                                        dataSource={TotalData}
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
                                            <span style={{ textTransform: 'capitalize' }}>{`${this.props.NANO_FILTER_CRITERIA.QueryType} Lists`}</span>
                                        </div>
                                        <Layout style={{ backgroundColor: '#FFF' }}>
                                            <Scrollbar overscrollEffect="bounce" style={{ minHeight: '150px', maxHeight: '300px' }}>
                                                <Table
                                                    className={styles['summary-table-bb']}
                                                    dataSource={this.getCAContribution()}
                                                    columns={getColumnCA(this.chartData())}
                                                    rowClassName={this.onRowClassName}
                                                    pagination={{
                                                        size: "small",
                                                        style: { marginRight: '10px' },
                                                        pageSize: 10,
                                                        showTotal: (total) => (`Total ${total} items`)
                                                    }}
                                                    bordered />
                                            </Scrollbar>
                                        </Layout>
                                    </div>
                                </div>
                            </Layout>
                        </Layout>
                    </article>

                </Modal>
                <Tooltip title="Market Penatation" placement="topRight"><FontAwesome style={{ color: '#E91E63' }} name="table" onClick={this.handleModal} /></Tooltip>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        CA_SUMMARY_ONLY_MARKET_PENETRATION: state.CA_SUMMARY_ONLY_MARKET_PENETRATION,
        CA_SUMMARY_ONLY_MARKET_CONTRIBUTION: state.CA_SUMMARY_ONLY_MARKET_CONTRIBUTION,
        NANO_FILTER_CRITERIA: state.NANO_FILTER_CRITERIA,
        RELATED_GROUP_BY_MARKET_SUMMARY_DATA: state.RELATED_GROUP_BY_MARKET_SUMMARY_DATA
    }),
    {})(ModalSaleSummary)