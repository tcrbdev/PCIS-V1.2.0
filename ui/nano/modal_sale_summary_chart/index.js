import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Icon, Button, Table, Tooltip, Modal, Form, Row, Col, Popover } from 'antd';
import Draggable from 'react-draggable'

const { Header } = Layout

import _ from 'lodash'
import FontAwesome from 'react-fontawesome'

import SaleSummaryChart from '../map/sale_summary_chart'

import styles from './index.scss'

const item = { "RowID": 1023, "RegionID": "BKK", "AreaID": "Bkk2", "ZoneValue": "Bkk2-Zone5", "ZoneValue2": "Zone5", "ZoneText": "BKK-Zone5", "OriginBranchCode": "257", "BranchCode": "257", "KioskCode": null, "BranchType": "P", "BranchName": "นาโนเครดิตนนทบุรี", "BranchLatitude": 13.84331, "BranchLongitude": 100.49496, "MarketCode": "M025710", "MarketName": "ตลาดบางศรีเมือง", "MarketShop": 60, "MarketType": "ค่าปลีก ผัก,ผลไม้,เนื้อสัตว์,เสื้อผ้า,อาหารแปรรูป,สินค้าอุปโภค", "MarketAge": 20, "MarketOpenDate": "2016-08-24T00:00:00.000Z", "MarketBy": "Nano", "Latitude": 13.84, "Longitude": 100.478, "TelsCreateDate": "2016-08-24T00:00:00.000Z", "IsActive": "Y", "DeptType": "M", "Radius": 1.8697747729373129, "SuccessRate": 0, "RadiusToPure": 1.8697747729373129, "OS": 31, "SetupTotal": 30, "SetupAch": 50, "Potential": 35, "TopContributeName": "วันเพ็ญ ", "TopContributeValue": 100, "MarketOpenDay": "EveryDay", "OpenTime": "05.00-20.00", "showMenu": false, "showInfo": false, "showImage": false, "showShopLayout": false, "showSaleSummary": false, "showPortfolio": true, "MARKET_INFORMATION": [], "CA_INFORMATION": [], "NOTE": [], "MARKET_IMAGE": [[{ "RowNo": 1, "GroupName": "NPL", "TotalAct": 5, "TotalAmt": 202470.8, "TotalAch": 15.63, "TotalAmtAch": 18.6, "RankAch": 78.15, "MinRank": 0, "MaxRank": 20, "RankR": 73.3333333334, "RankY": 6.6666666666, "RankG": 20, "MaxR": 20, "MaxY": 4, "MaxG": 3 }, { "RowNo": 2, "GroupName": "M1-2", "TotalAct": 1, "TotalAmt": 28813.67, "TotalAch": 3.13, "TotalAmtAch": 2.65, "RankAch": 20.86666666666, "MinRank": 0, "MaxRank": 15, "RankR": 86.6666666667, "RankY": 6.6666666667, "RankG": 6.6666666666, "MaxR": 15, "MaxY": 2, "MaxG": 1 }, { "RowNo": 3, "GroupName": "X day", "TotalAct": 0, "TotalAmt": 0, "TotalAch": 0, "TotalAmtAch": 0, "RankAch": 0, "MinRank": 0, "MaxRank": 15, "RankR": 80, "RankY": 13.3333333334, "RankG": 6.6666666666, "MaxR": 15, "MaxY": 3, "MaxG": 1 }, { "RowNo": 4, "GroupName": "W3-4", "TotalAct": 2, "TotalAmt": 71917.06, "TotalAch": 6.25, "TotalAmtAch": 6.61, "RankAch": 41.66666666666, "MinRank": 0, "MaxRank": 15, "RankR": 93.3333333334, "RankY": 3.3333333333, "RankG": 3.3333333333, "MaxR": 15, "MaxY": 1, "MaxG": 0.5 }, { "RowNo": 5, "GroupName": "W1-2", "TotalAct": 8, "TotalAmt": 220204.37, "TotalAch": 25, "TotalAmtAch": 20.22, "RankAch": 83.33333333333, "MinRank": 0, "MaxRank": 30, "RankR": 80, "RankY": 13.3333333334, "RankG": 6.6666666666, "MaxR": 30, "MaxY": 3, "MaxG": 1 }], [{ "Current": "W0", "TotalAct": 16, "TotalAmt": 565418.8, "TotalAch": 50, "TotalAmtAch": 51.93, "AllAct": 32 }], [{ "GroupName": "TotalAct", "Mon": 0, "Tue": 0, "Wed": 32, "Thu": 0, "Fri": 0 }], [{ "GroupName": "Collection Success", "SuccessRate": 0, "TotalAct": "0 Acc", "TotalAmt": "0 Mb" }], [{ "GroupName": "0MDPD", "BaseTotalAct": 24, "BaseTotalAmt": 869546.57, "FlowTotalAct": 0, "FlowTotalAmt": 0, "ProblemTotalAct": 3, "ProblemTotalAmt": 88564.27, "FirstPin": 0, "SecondPin": 10.19, "FirstPinAch": 0, "SecondPinAch": 16.98333333333, "MinRank": 0, "MaxRank": 60, "RankR": 95.8333333334, "RankY": 1.6666666666, "RankG": 2.5, "MaxR": 100, "MaxY": 4.1666666666, "MaxG": 2.5 }, { "GroupName": "1-30MDPD", "BaseTotalAct": 1, "BaseTotalAmt": 20621.72, "FlowTotalAct": 0, "FlowTotalAmt": 0, "ProblemTotalAct": 0, "ProblemTotalAmt": 0, "FirstPin": 0, "SecondPin": 0, "FirstPinAch": 0, "SecondPinAch": 0, "MinRank": 0, "MaxRank": 100, "RankR": 65, "RankY": 10, "RankG": 25, "MaxR": 100, "MaxY": 35, "MaxG": 25 }, { "GroupName": "31-60MDPD", "BaseTotalAct": 1, "BaseTotalAmt": 28813.67, "FlowTotalAct": 1, "FlowTotalAmt": 28813.67, "ProblemTotalAct": 1, "ProblemTotalAmt": 28813.67, "FirstPin": 100, "SecondPin": 100, "FirstPinAch": 100, "SecondPinAch": 100, "MinRank": 0, "MaxRank": 100, "RankR": 20, "RankY": 10, "RankG": 70, "MaxR": 100, "MaxY": 80, "MaxG": 70 }], [{ "GroupName": "New Account", "TotalNewAct": 0, "TotalNewAmt": 0, "TotalAllAct": 0, "TotalAllAmt": 0, "RankAch": 0, "MinRank": 50, "MaxRank": 100 }]], "PORTFOLIO_QUALITY_CHART": [[{ "RowNo": 1, "GroupName": "NPL", "TotalAct": 5, "TotalAmt": 202470.8, "TotalAch": 15.63, "TotalAmtAch": 18.6, "RankAch": 78.15, "MinRank": 0, "MaxRank": 20, "RankR": 73.3333333334, "RankY": 6.6666666666, "RankG": 20, "MaxR": 20, "MaxY": 4, "MaxG": 3 }, { "RowNo": 2, "GroupName": "M1-2", "TotalAct": 1, "TotalAmt": 28813.67, "TotalAch": 3.13, "TotalAmtAch": 2.65, "RankAch": 20.86666666666, "MinRank": 0, "MaxRank": 15, "RankR": 86.6666666667, "RankY": 6.6666666667, "RankG": 6.6666666666, "MaxR": 15, "MaxY": 2, "MaxG": 1 }, { "RowNo": 3, "GroupName": "X day", "TotalAct": 0, "TotalAmt": 0, "TotalAch": 0, "TotalAmtAch": 0, "RankAch": 0, "MinRank": 0, "MaxRank": 15, "RankR": 80, "RankY": 13.3333333334, "RankG": 6.6666666666, "MaxR": 15, "MaxY": 3, "MaxG": 1 }, { "RowNo": 4, "GroupName": "W3-4", "TotalAct": 2, "TotalAmt": 71917.06, "TotalAch": 6.25, "TotalAmtAch": 6.61, "RankAch": 41.66666666666, "MinRank": 0, "MaxRank": 15, "RankR": 93.3333333334, "RankY": 3.3333333333, "RankG": 3.3333333333, "MaxR": 15, "MaxY": 1, "MaxG": 0.5 }, { "RowNo": 5, "GroupName": "W1-2", "TotalAct": 8, "TotalAmt": 220204.37, "TotalAch": 25, "TotalAmtAch": 20.22, "RankAch": 83.33333333333, "MinRank": 0, "MaxRank": 30, "RankR": 80, "RankY": 13.3333333334, "RankG": 6.6666666666, "MaxR": 30, "MaxY": 3, "MaxG": 1 }], [{ "Current": "W0", "TotalAct": 16, "TotalAmt": 565418.8, "TotalAch": 50, "TotalAmtAch": 51.93, "AllAct": 32 }], [{ "GroupName": "TotalAct", "Mon": 0, "Tue": 0, "Wed": 32, "Thu": 0, "Fri": 0 }], [{ "GroupName": "Collection Success", "SuccessRate": 0, "TotalAct": "0 Acc", "TotalAmt": "0 Mb" }], [{ "GroupName": "0MDPD", "BaseTotalAct": 24, "BaseTotalAmt": 869546.57, "FlowTotalAct": 0, "FlowTotalAmt": 0, "ProblemTotalAct": 3, "ProblemTotalAmt": 88564.27, "FirstPin": 0, "SecondPin": 10.19, "FirstPinAch": 0, "SecondPinAch": 16.98333333333, "MinRank": 0, "MaxRank": 60, "RankR": 95.8333333334, "RankY": 1.6666666666, "RankG": 2.5, "MaxR": 100, "MaxY": 4.1666666666, "MaxG": 2.5 }, { "GroupName": "1-30MDPD", "BaseTotalAct": 1, "BaseTotalAmt": 20621.72, "FlowTotalAct": 0, "FlowTotalAmt": 0, "ProblemTotalAct": 0, "ProblemTotalAmt": 0, "FirstPin": 0, "SecondPin": 0, "FirstPinAch": 0, "SecondPinAch": 0, "MinRank": 0, "MaxRank": 100, "RankR": 65, "RankY": 10, "RankG": 25, "MaxR": 100, "MaxY": 35, "MaxG": 25 }, { "GroupName": "31-60MDPD", "BaseTotalAct": 1, "BaseTotalAmt": 28813.67, "FlowTotalAct": 1, "FlowTotalAmt": 28813.67, "ProblemTotalAct": 1, "ProblemTotalAmt": 28813.67, "FirstPin": 100, "SecondPin": 100, "FirstPinAch": 100, "SecondPinAch": 100, "MinRank": 0, "MaxRank": 100, "RankR": 20, "RankY": 10, "RankG": 70, "MaxR": 100, "MaxY": 80, "MaxG": 70 }], [{ "GroupName": "New Account", "TotalNewAct": 0, "TotalNewAmt": 0, "TotalAllAct": 0, "TotalAllAmt": 0, "RankAch": 0, "MinRank": 50, "MaxRank": 100 }]] }

class ModalSaleSummary extends Component {
    state = {
        modalOpen: false,
    }

    handleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen })
    }

    handleCancel = () => {
        this.setState({ modalOpen: !this.state.modalOpen })
    }

    componentDidMount() {
        if (this.props.type) {
            if (document.getElementById('modal-sale-summary-chart2') === null || document.getElementById('modal-sale-summary-chart2') === undefined) {
                var divModal = document.createElement("div")
                divModal.id = 'modal-sale-summary-chart2'

                document.getElementById('add-sale-summary-chart2').appendChild(divModal)
            }
        }
        else {
            if (document.getElementById('modal-sale-summary-chart') === null || document.getElementById('modal-sale-summary-chart') === undefined) {
                var divModal = document.createElement("div")
                divModal.id = 'modal-sale-summary-chart'

                document.getElementById('add-sale-summary-chart').appendChild(divModal)
            }
        }
    }

    render() {
        return (
            <div style={{ marginLeft: '0px' }}>
                <Modal
                    wrapClassName={`parent_salesummary ${styles['modalParentSaleSummaryChart']}`}
                    className={styles['modalSaleSummaryChart']}
                    visible={this.state.modalOpen}
                    onCancel={this.handleCancel}
                    footer={null}
                    closable={false}
                    maskClosable={false}
                    mask={false}
                    getContainer={() => this.props.type ? document.getElementById('modal-sale-summary-chart2') : document.getElementById('modal-sale-summary-chart')}
                >
                    <article className={styles['wrapper']}>
                        <SaleSummaryChart
                            item={{ SALE_SUMMARY_CHART: this.props.type ? this.props.CHART_SALE_SUMMARY_BY_CA : this.props.RELATED_CHART_SALE_SUMMARY }}
                            custom_width="610px"
                            ON_CLOSE_MARKER={this.handleCancel}
                            type={this.props.type}/>
                    </article>
                </Modal>

                <Tooltip title="Sale Summary"><FontAwesome style={{ color: '#03A9F4' }} name="line-chart" onClick={this.handleModal} /></Tooltip>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        RELATED_CHART_SALE_SUMMARY: state.RELATED_CHART_SALE_SUMMARY,
        CHART_SALE_SUMMARY_BY_CA: state.CHART_SALE_SUMMARY_BY_CA
    }),
    {
    })(ModalSaleSummary)