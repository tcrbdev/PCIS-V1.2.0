import React, { Component, PropTypes } from 'react'
import { Modal, Button } from 'antd'
import AssignmentRecommendContent from './assign_recommend'

const configFixed = {
    "title": (<p className="text_upper bold fg_gray" > Assignment</p>),
    "width": (window.screen.availWidth / 2),
    "okText": "OK",
    "cancelText": "CANCEL",
    "maskClosable": false
}

const AssignmentFormModal = ({ modalOpen, modalCommit, modalCancel }) => 
(   // onOk={modalCommit} onCancel={modalCancel}
    <Modal {...configFixed} visible={modalOpen} footer={<Button onClick={modalCancel}>CANCEL</Button>} onCancel={modalCancel}>
        <AssignmentRecommendContent />
    </Modal>
)

AssignmentFormModal.PropTypes = {
    modalOpen: PropTypes.bool.isRequired,
    modalCommit: PropTypes.func.isRequired,
    modalCancel: PropTypes.func.isRequired
}

export default AssignmentFormModal