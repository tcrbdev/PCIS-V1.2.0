import React, { Component, PropTypes } from 'react'
import { Button, Modal, Collapse, Row, Col } from 'antd'
import RequestFormModal from './app_owner_modal'

const Panel = Collapse.Panel

class AppOwnerFormTool extends Component {

    PropTypes = {
        modalOpen: PropTypes.bool.isRequired,
        modalHandle: PropTypes.func.isRequired,
        modalCommit: PropTypes.func.isRequired,
        modalCancel: PropTypes.func.isRequired
    }

    render() {

        const { modalOpen, modalMode, modalHandle, modalCommit, modalCancel } = this.props

        return (
            <div>
                <Collapse bordered={false} defaultActiveKey={[]}>
                    <Panel header={<p className="text_upper bold fg_gray">Request Form & History</p>} key="1">
                        <Button onClick={modalHandle.bind(this)} data-mode="REQ_CHANGE_BRN" type="primary" icon="exception" size="default" className="text_upper">Change Branch</Button>
                        <Button onClick={modalHandle.bind(this)} data-mode="REQ_CHANGE_RM" type="primary" icon="solution" size="default" className="text_upper marg_left5">Change RM</Button>
                        <Button onClick={modalHandle.bind(this)} data-mode="REQ_TIMELINE" type="dashed" icon="clock-circle-o" size="default" className="text_upper place-right">History</Button>
                    </Panel>
                </Collapse>
                <RequestFormModal modalOpen={modalOpen} modalMode={modalMode} modalCommit={modalCommit} modalCancel={modalCancel} />
            </div>            
        )
    }

}

export default AppOwnerFormTool