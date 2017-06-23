import React, { Component, PropTypes } from 'react'
import { Table, Button, Icon, Row, Col } from 'antd';
import AssignmentFormModal from './modules/assign_modal'
import Style from './style/assign_component.css'
import { CampaignActivity, CampaignBMSuccess, CampaignRMSuccess, CampaignAging } from './modules/chart'

class AssignComponent extends Component {

    PropTypes = {
        columns: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        loadGrid: PropTypes.bool.isRequired,
        modalOpen: PropTypes.bool.isRequired,
        modalCommit: PropTypes.func.isRequired,
        modalCancel: PropTypes.func.isRequired,
        reportOpen: PropTypes.bool.isRequired,
        reportHandle: PropTypes.func.isRequired
    }

    render() {

        const {
            columns, data, loadGrid,
            modalProps, modalOpen, modalCommit, modalCancel,
            reportOpen, reportHandle
        } = this.props

        return (
            <article>

                <article className={(reportOpen) ? 'assign_report_component open' : 'assign_report_component close'}>
                    <h2 className="text_upper">Management Report</h2>
                    <Row type="flex" justify="start">
                        <Col span={6} className="text-center pad20">
                            <CampaignActivity modalOpen={modalOpen} />
                            <p className="text_upper bold">Campaign Activity</p>
                        </Col>
                        <Col span={6} className="text-center pad20">
                            <CampaignBMSuccess modalOpen={modalOpen} />
                            <p className="text_upper bold">BM Success</p>
                        </Col>
                        <Col span={6} className="text-center pad20">
                            <CampaignRMSuccess modalOpen={modalOpen} />
                            <p className="text_upper bold">RM Success</p>
                        </Col>
                        <Col span={6} className="text-center pad20">
                            <CampaignAging modalOpen={modalOpen} />
                            <p className="text_upper bold">App Onhand Aging</p>
                        </Col>
                    </Row>
                </article>

                <header className="pad_tb10">
                    <h2 className="text_upper inline">Assignment Management</h2>
                    <Button id="toggle" type="primary" shape="circle" icon="line-chart" className="inline place-right" onClick={reportHandle} />
                </header>

                <Table rowKey="uid" columns={columns} dataSource={data} loading={loadGrid} size="middle" bordered />

                <AssignmentFormModal modalOpen={modalOpen} modalCommit={modalCommit} modalCancel={modalCancel} />
                
            </article>

        )
    }

}

export default AssignComponent