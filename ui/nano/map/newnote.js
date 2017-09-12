import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie';

import { Icon, Button, Table, Tooltip, Modal, Form, Row, Col, Input, Popover, Popconfirm, Checkbox } from 'antd';

import FontAwesome from 'react-fontawesome'

import moment from 'moment'

import {
    insertUpdateMarkerNote
} from '../actions/nanomaster'

import styles from './index.scss'

const FormItem = Form.Item
const { TextArea } = Input

class AddNote extends Component {

    onSaveNote = (e) => {
        // const { modalSelectData } = this.state

        e.preventDefault()

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                let data = {
                    BranchCode: this.props.modalSelectData.BranchCode,
                    MarketCode: this.props.modalSelectData.MarketCode,
                    Note: values.Note,
                    CreateBy: values.By,
                    UpdateBy: null,
                    IsDefault: values.IsDefault
                }

                this.props.insertUpdateMarkerNote(data, 'post')
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 },
        }

        let By;
        if (!_.isEmpty(cookies.get('authen_info'))) {
            const auth = cookies.get('authen_info')
            By = auth.Session.sess_engname
        }

        return (
            <div style={{ width: '465px' }}>
                <span>{this.props.modalSelectData.MarketCode}</span>
                <Form layout="vertical" onSubmit={this.onSaveNote}>
                    <Row gutter={4}>
                        <Col span={18}>
                            <FormItem
                                label="By"
                                colon={true}
                                {...formItemLayout}>
                                {
                                    getFieldDecorator('By', {
                                        initialValue: By,
                                        rules: [
                                            { required: true, message: 'Please input update by' },
                                        ]
                                    })
                                        (
                                        <Input placeholder="Edit By Name" />
                                        )
                                }
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem>
                                {getFieldDecorator('IsDefault', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(
                                    <Checkbox>Default Note</Checkbox>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={4}>
                        <Col span={24}>
                            <FormItem
                                label="Note"
                                colon={true}
                                labelCol={{ span: 2 }}
                                wrapperCol={{ span: 22 }}>
                                {
                                    getFieldDecorator('Note', {
                                        initialValue: '',
                                        rules: [
                                            { required: true, message: 'Please note something.' },
                                        ]
                                    })
                                        (
                                        <TextArea placeholder="Note any detail" autosize={{ minRows: 3, maxRows: 10 }} />
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
                                        onClick={this.ClearField}>Clear</Button>
                                </Col>
                                <Col span={12}>
                                    <Button
                                        style={{ width: '100%', 'height': '32px', 'float': 'right', 'marginTop': '2px', 'fontSize': '1.1em' }}
                                        type="primary"
                                        icon="edit"
                                        htmlType="submit">Save</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

const formAddNote = Form.create()(AddNote)

const CookiesAddNote = withCookies(formAddNote)

export default connect(
    (state) => ({}), {
        insertUpdateMarkerNote: insertUpdateMarkerNote
    })(CookiesAddNote)