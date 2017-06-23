import React, { Component } from 'react'
import { Form, Input, Select, Row, Col, Icon } from 'antd'

const FormItem = Form.Item
const InputGroup = Input.Group
const Option = Select.Option

class TransferForm extends Component {

    render() {

        const { getFieldDecorator } = this.props.form;
        const prefixOriginalSelector = getFieldDecorator('prefix', { initialValue: '000' })
            (
            <Select disabled style={{ width: 60 }}>
                <Option value="000">000</Option>
                <Option value="017">017</Option>
                <Option value="999">999</Option>
            </Select>
            )

        const prefixNewChangeSelector = getFieldDecorator('prefix', { initialValue: '000' })
            (
            <Select style={{ width: 60 }}>
                <Option value="000">000</Option>
                <Option value="017">017</Option>
                <Option value="999">999</Option>
            </Select>
            )

        return (
            <Form>
                <header className="bg_darkCyan fg_white pad5 text_upper bold marg_bottom10">
                    <h4>Request Form</h4>
                    <h4 className="place-right" style={{ marginTop: '-18px' }}>Request Date <time>13/06/2017</time></h4>
                </header>
                <section>
                    <Row type="flex" justify="start" gutter={16}>
                        <Col span={24}>
                            <label className="text_upper bold">Requestor</label>
                            <InputGroup compact>
                                <FormItem className="lineHeight_none text_upper bold inline" style={{ width: '15%' }}>
                                    {
                                        getFieldDecorator('app_ownercode', {
                                            rules: [{
                                                type: 'text',
                                                message: ''
                                            },
                                            {
                                                required: false,
                                                message: ''
                                            }]
                                        })(<Input placeholder="Emp Code" />)
                                    }
                                </FormItem>
                                <FormItem className="lineHeight_none text_upper bold inline" style={{ width: '30%' }}>
                                    {
                                        getFieldDecorator('app_ownername', {
                                            rules: [{
                                                type: 'text',
                                                message: ''
                                            },
                                            {
                                                required: false,
                                                message: ''
                                            }]
                                        })(<Input placeholder="Emp Name" />)
                                    }
                                </FormItem>
                            </InputGroup>
                        </Col>
                    </Row>
                </section>
                <header className="bg_darkCyan fg_white pad5 text_upper bold">
                    <h4>Request Transfering</h4>
                </header>
                <section>
                    <Row type="flex" justify="start" gutter={16} className="marg_bottom10">
                        <Col span={24} style={{ maxHeight: '68px' }}>
                            <section className="marg_top10">
                                <header className="text_upper">
                                    <h4>Original Branch</h4>
                                    <h4 style={{ marginLeft: '225px', marginTop: '-18px' }}>New Branch</h4>
                                </header>
                                <InputGroup compact>
                                    <FormItem className="lineHeight_none text_upper bold inline" style={{ width: '30%' }}>
                                        {
                                            getFieldDecorator('original_branch', {
                                                rules: [{
                                                    type: 'text',
                                                    message: ''
                                                },
                                                {
                                                    required: false,
                                                    message: ''
                                                }]
                                            })(<Input addonBefore={prefixOriginalSelector} value="Head Office" disabled />)
                                        }
                                    </FormItem>
                                    <FormItem className="lineHeight_none text_upper bold inline">
                                        {
                                            getFieldDecorator('new_branch', {
                                                rules: [{
                                                    type: 'text',
                                                    message: ''
                                                },
                                                {
                                                    required: false,
                                                    message: ''
                                                }]
                                            })(<Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none' }} size="large" placeholder="To" />)
                                        }
                                    </FormItem>
                                    <FormItem className="lineHeight_none text_upper bold inline" style={{ width: '30%' }}>
                                        {
                                            getFieldDecorator('original_branch', {
                                                rules: [{
                                                    type: 'text',
                                                    message: ''
                                                },
                                                {
                                                    required: false,
                                                    message: ''
                                                }]
                                            })(<Input addonBefore={prefixNewChangeSelector} disabled />)
                                        }
                                    </FormItem>
                                </InputGroup>
                            </section>
                        </Col>
                        <Col span={24} style={{ maxHeight: '58px' }}>
                            <label className="text_upper bold">Please enter the reason :</label>
                            <FormItem className="lineHeight_none text_upper bold inline">
                                {
                                    getFieldDecorator('request_reason', {
                                        rules: [{
                                            required: false,
                                            message: ''
                                        }]
                                    })(<Select style={{ width: '35%' }}><Option value=""></Option></Select>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <label className="text_upper bold">Description</label>
                            <FormItem className="lineHeight_none text_upper bold inline">
                                {
                                    getFieldDecorator('request_reason', {
                                        rules: [{
                                            required: false,
                                            message: ''
                                        }]
                                    })(<Input type="textarea" autosize={{ minRows: 3 }} style={{ width: '65%' }} />)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </section>
            </Form>
        )
    }

}

export default Form.create()(TransferForm)