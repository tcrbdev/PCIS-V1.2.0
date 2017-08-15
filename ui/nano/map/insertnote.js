import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Icon, Button, Table, Tooltip, Modal, Form, Row, Col, Input, Popover, Popconfirm, Checkbox, message } from 'antd';

import FontAwesome from 'react-fontawesome'

import moment from 'moment'

import {
    insertUpdateMarkerNote
} from '../actions/nanomaster'

import styles from './index.scss'

const FormItem = Form.Item
const { TextArea } = Input

class InsertNote extends Component {

    state = {
        IsSubmit: false
    }

    ClearField = () => {
        const { resetFields } = this.props.form
        resetFields()
    }

    onSaveNote = (e) => {
        e.preventDefault()

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = {
                    BranchCode: this.props.modalSelectData.BranchCode,
                    MarketCode: this.props.modalSelectData.MarketCode,
                    Note: values.Note,
                    CreateBy: values.By,
                    UpdateBy: values.By,
                    IsDefault: values.IsDefault
                }

                let currentState = this.props.modalSelectData.MarketCode ? this.props.RELATED_EXITING_MARKET_DATA : this.props.RELATED_BRANCH_DATA

                if (this.props.modalSelectData.NOTE.length <= 0) {
                    this.props.insertUpdateMarkerNote(data, 'post', this.getLoading, this.getStatusFrom, this.props.modalSelectData, currentState)
                }
                else {
                    data.SysNO = this.props.modalSelectData.NOTE[0].SysNO
                    this.props.insertUpdateMarkerNote(data, 'put', this.getLoading, this.getStatusFrom, this.props.modalSelectData, currentState)
                }

                this.setState({ IsSubmit: true })
            }
        })
    }

    getLoading = () => {
        return message.loading('Action in progress..', 0)
    }

    getStatusFrom = (loading) => {
        setTimeout(loading, 0)
        setTimeout(() => message.success(`${this.props.modalSelectData.NOTE.length <= 0 ? 'Insert' : 'Update'} note success..`), 500)
    }

    render() {
        const { modalSelectData, form: { getFieldDecorator } } = this.props
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        }
        let iniBy = '', iniNote = '', iniDefault = true;
        if (modalSelectData.NOTE.length) {
            iniBy = modalSelectData.NOTE[0].UpdateBy
            iniNote = modalSelectData.NOTE[0].Note
            iniDefault = modalSelectData.NOTE[0].IsDefault
        }

        return (
            <div style={{ width: '465px' }}>
                <Form layout="horizontal" onSubmit={this.onSaveNote}>
                    <Row gutter={4}>
                        <Col span={18}>
                            <FormItem
                                label="By"
                                colon={true}
                                {...formItemLayout}>
                                {
                                    getFieldDecorator('By', {
                                        initialValue: iniBy,
                                        rules: [
                                            { required: true, message: 'Please input update by' },
                                        ]
                                    })
                                        (
                                        <Input placeholder="Edit By Name" disabled={this.props.STATUS_INSERT_MARKER_NOTE} />
                                        )
                                }
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem>
                                {getFieldDecorator('IsDefault', {
                                    valuePropName: 'checked',
                                    initialValue: iniDefault,
                                })(
                                    <Checkbox disabled={this.props.STATUS_INSERT_MARKER_NOTE}>Default Note</Checkbox>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={4}>
                        <Col span={24}>
                            <FormItem
                                label="Note"
                                colon={true}
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 21 }}>
                                {
                                    getFieldDecorator('Note', {
                                        initialValue: iniNote,
                                        rules: [
                                            { required: true, message: 'Please note something.' },
                                        ]
                                    })
                                        (
                                        <TextArea placeholder="Note any detail" autosize={{ minRows: 7, maxRows: 15 }} disabled={this.props.STATUS_INSERT_MARKER_NOTE} />
                                        )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={4}>
                        <Col span={12} offset={12}>
                            <Row type="flex" align="middle" gutter={8}>
                                <Col span={12}>
                                    <Button
                                        style={{ color: '#000', width: '100%', 'height': '32px', 'float': 'right', 'marginTop': '2px', 'fontSize': '1.1em' }}
                                        type="danger"
                                        ghost
                                        icon="reload"
                                        onClick={this.ClearField}
                                        disabled={this.props.STATUS_INSERT_MARKER_NOTE}>Reset</Button>
                                </Col>
                                <Col span={12}>
                                    <Button
                                        style={{ width: '100%', 'height': '32px', 'float': 'right', 'marginTop': '2px', 'fontSize': '1.1em' }}
                                        type="primary"
                                        icon="edit"
                                        htmlType="submit"
                                        loading={this.props.STATUS_INSERT_MARKER_NOTE}>Save</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

const formInsertNote = Form.create()(InsertNote)

export default connect(
    (state) => ({
        STATUS_INSERT_MARKER_NOTE: state.STATUS_INSERT_MARKER_NOTE,
        RELATED_BRANCH_DATA: state.RELATED_BRANCH_DATA,
        RELATED_EXITING_MARKET_DATA: state.RELATED_EXITING_MARKET_DATA,
    }), {
        insertUpdateMarkerNote: insertUpdateMarkerNote
    })(formInsertNote)