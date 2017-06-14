import React, { Component, PropTypes } from 'react'
import { Modal, Button } from 'antd'
import { TimelineLogger, TransferForm, ChangeOwner } from './moduler'

class RequestForm extends Component {

    PropTypes = {
        visible: PropTypes.bool.isRequired,
        viewTitle: PropTypes.string.isRequired,
        viewMode: PropTypes.string.isRequired,
        onCancel: PropTypes.func.isRequired,
        handleOk: PropTypes.func.isRequired
    }

    render() {

        const { visible, viewTitle, viewMode, onCancel, handleOk } = this.props

        let module_content = null
        switch (viewMode) {
            case 'CBR':
                module_content = <TransferForm />
                break;
            case 'CRM':
                module_content = <ChangeOwner />
                break;
            case 'HIST':
                module_content = <TimelineLogger /> 
                break;
        }

        return (
            <div>
                <Modal
                    title={<h4>{viewTitle}</h4>}
                    width={window.screen.availWidth / 2}
                    visible={visible}
                    onOk={handleOk}
                    onCancel={onCancel}
                    okText="OK"
                    cancelText="Cancel"
                    maskClosable={false}
                >
                    {module_content}
                </Modal>
            </div>
        );
    }

}

export default RequestForm