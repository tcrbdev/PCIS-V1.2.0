import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Icon, Button, Table, Tooltip, Modal, Form, Row, Col, Popover, Badge } from 'antd';
import Draggable from 'react-draggable'

const { Header } = Layout

import StopApproval from '../nano_visit_popup/stop_approval'

import _ from 'lodash'
import FontAwesome from 'react-fontawesome'

import styles from './index.scss'

class ModalNanoStopApproval extends Component {
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

        if (document.getElementById('modal-nano-stop-approval') === null || document.getElementById('modal-nano-stop-approval') === undefined) {
            var divModal = document.createElement("div")
            divModal.id = 'modal-nano-stop-approval'
            document.getElementById('nano-stop-approval').appendChild(divModal)
        }
    }

    render() {
        const { NANO_VISIT_POPUP_INFO } = this.props
        return (
            <div style={{ marginLeft: '0px' }}>
                <Modal
                    wrapClassName={`${styles['modalParentNanoStopApproval']}`}
                    className={styles['modalNanoStopApproval']}
                    visible={this.state.modalOpen}
                    onCancel={this.handleCancel}
                    footer={null}
                    closable={false}
                    maskClosable={false}
                    mask={false}
                    getContainer={() => document.getElementById('modal-nano-stop-approval')}>
                    <article className={styles['wrapper']}>
                        <StopApproval
                            custom_width="610px"
                            IS_MARGIN={true}
                            ON_CLOSE_MARKER={this.handleCancel} />
                    </article>
                </Modal>
                <Tooltip title="Warning Stop Approval" ><Badge count={!_.isEmpty(NANO_VISIT_POPUP_INFO) ? NANO_VISIT_POPUP_INFO[1].length : 0} style={{ backgroundColor: '#F44336' }}><FontAwesome style={{ color: '#FF9800', fontSize: '18px' }} name="exclamation-triangle" onClick={this.handleModal} /></Badge> </Tooltip>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        NANO_VISIT_POPUP_INFO: state.NANO_VISIT_POPUP_INFO
    }),
    {
    })(ModalNanoStopApproval)