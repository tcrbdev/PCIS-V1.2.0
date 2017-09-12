import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie';

import { Icon, Button, Table, Tooltip, Modal, Form, Row, Col, Input, Popover, Popconfirm, Checkbox, message } from 'antd';

import FontAwesome from 'react-fontawesome'

import moment from 'moment'

import {
    insertUpdateMarkerNoteCA
} from '../actions/nanomaster'

import styles from './index.scss'

const FormItem = Form.Item
const { TextArea } = Input

class InsertNote extends Component {

    state = {
        IsSubmit: false,
        auth: {}
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
                    BranchCode: this.props.caData.CA_Code,
                    Note: values.Note,
                    CreateBy: values.By,
                    UpdateBy: values.By,
                    IsDefault: values.IsDefault
                }

                const { RELATED_CA_NOTE_DATA, caData } = this.props
                const canote = _.find(RELATED_CA_NOTE_DATA, { BranchCode: caData.CA_Code })

                if (_.isEmpty(canote)) {
                    this.props.insertUpdateMarkerNoteCA(data, 'post', this.getLoading, this.getStatusFrom, RELATED_CA_NOTE_DATA)
                }
                else {
                    data.SysNO = canote.SysNO.
                        data.UpdateBy = this.state.auth.Session.sess_engname
                    this.props.insertUpdateMarkerNoteCA(data, 'put', this.getLoading, this.getStatusFrom, RELATED_CA_NOTE_DATA)
                }
            }
        })
    }

    getLoading = () => {
        return message.loading('Action in progress..', 0)
    }

    getStatusFrom = (loading) => {
        const { RELATED_CA_NOTE_DATA, caData } = this.props
        const canote = _.find(RELATED_CA_NOTE_DATA, { BranchCode: caData.CA_Code })

        setTimeout(loading, 0)
        setTimeout(() => message.success(`${_.isEmpty(canote) ? 'Insert' : 'Update'} note success..`), 500)
    }

    componentDidMount() {
        const { cookies } = this.props
        if (!_.isEmpty(cookies.get('authen_info'))) {
            const auth = cookies.get('authen_info')
            this.setState({ auth })
        }
    }

    render() {
        const { RELATED_CA_NOTE_DATA, caData, form: { getFieldDecorator } } = this.props
        const canote = _.find(RELATED_CA_NOTE_DATA, { BranchCode: caData.CA_Code })
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        }
        let iniBy = '', iniNote = '', iniDefault = true;
        if (!_.isEmpty(canote)) {
            iniBy = canote.UpdateBy
            iniNote = canote.Note
            iniDefault = canote.IsDefault
        }
        else {
            if (!_.isEmpty(this.state.auth))
                iniBy = this.state.auth.Session.sess_engname
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
                                        <Input placeholder="Edit By Name" disabled={this.props.STATUS_INSERT_MARKER_NOTE} disabled={true} />
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

const CookiesInsertNote = withCookies(formInsertNote)

export default connect(
    (state) => ({
        STATUS_INSERT_MARKER_NOTE: state.STATUS_INSERT_MARKER_NOTE,
        RELATED_BRANCH_DATA: state.RELATED_BRANCH_DATA,
        RELATED_CA_NOTE_DATA: state.RELATED_CA_NOTE_DATA,
        RELATED_EXITING_MARKET_DATA: state.RELATED_EXITING_MARKET_DATA,
    }), {
        insertUpdateMarkerNoteCA: insertUpdateMarkerNoteCA
    })(CookiesInsertNote)