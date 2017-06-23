import React, { Component, PropTypes } from 'react'
import { Modal, Button } from 'antd'
import { TransferForm, ChangeRMForm, TimelineLogger } from './modals'

class RequestFormModal extends Component {

    PropTypes = {
        modalOpen: PropTypes.bool.isRequired,
        modalMode: PropTypes.string.isRequired,
        modalHandle: PropTypes.func.isRequired,
        modalCommit: PropTypes.func.isRequired,
        modalCancel: PropTypes.func.isRequired
    }

    render() {

        const { modalOpen, modalMode, modalCommit, modalCancel } = this.props

        let modal_load_title = null
        let modal_load_content = null
 
        switch (modalMode) {
            case 'REQ_CHANGE_BRN':
                modal_load_title = 'Request Form : Change Branch'
                modal_load_content = <TransferForm />
                break;
            case 'REQ_CHANGE_RM':
                modal_load_title = 'Request Form : Change Owner'
                modal_load_content = <ChangeRMForm />
                break;
            case 'REQ_TIMELINE':
                modal_load_title = 'Activity History'
                modal_load_content = <TimelineLogger />
                break;
        }   
      
        return (
            <Modal
                title={<span className="text_upper bold">{modal_load_title}</span>}
                width={window.screen.availWidth / 2}
                visible={modalOpen}
                onOk={modalCommit}
                onCancel={modalCancel}
                okText="OK"
                cancelText="CANCEL"
                maskClosable={false}>
                {modal_load_content}
            </Modal>
        )
    }
}

export default RequestFormModal