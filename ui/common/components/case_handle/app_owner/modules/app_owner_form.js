import React, { Component, PropTypes } from 'react'
import { Form, Input, Select, Radio, Button, Collapse, Row, Col, Icon, Avatar, Tooltip } from 'antd'

const FormItem = Form.Item
const InputGroup = Input.Group
const Option = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const ButtonGroup = Button.Group
const Panel = Collapse.Panel

class AppOwnerFormItem extends Component {

    PropTypes = {
        visible: PropTypes.bool.isRequired,
        multiField: PropTypes.bool.isRequired,
        handleSource: PropTypes.func.isRequired,
        handleChanel: PropTypes.func.isRequired
    }

    render() {

        const { visible, multiField, handleSource, handleChanel } = this.props
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 20 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            },
        }

        const prefixBaseOfficeSelector = getFieldDecorator('prefix', { initialValue: '000' })
        (
            <Select disabled style={{ width: 60 }}>
                <Option value="000">000</Option>
                <Option value="017">017</Option>
                <Option value="999">999</Option>
            </Select>
        )

        const FixHeightForm = { maxHeight: '56px' } 
        return (
            <Form>
                <section>
                    <h4 className="text_upper marg_bottom10"><i className="fa fa-globe" aria-hidden="true"></i> Zone Information</h4>
                    <Row type="flex" justify="start" gutter={16} className="pad_bottom_none" style={{ maxHeight: '68px' }}>
                        <Col span={8}>
                            <FormItem label="Region" className="lineHeight_none text_upper bold text-left" {...formItemLayout}>
                                {
                                    getFieldDecorator('region_field', {
                                        rules: [{
                                            type: 'text',
                                            message: ''
                                        },
                                        {
                                            required: false,
                                            message: ''
                                        }]
                                    })(<Input readOnly />)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="Area" className="lineHeight_none text_upper bold text-left" {...formItemLayout}>
                                {
                                    getFieldDecorator('area_field', {
                                        rules: [{
                                            type: 'text',
                                            message: ''
                                        },
                                        {
                                            required: false,
                                            message: ''
                                        }]
                                    })(<Input readOnly />)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="Branch" className="lineHeight_none text_upper bold text-left" {...formItemLayout}>
                                {
                                    getFieldDecorator('area_field', {
                                        rules: [{
                                            type: 'text',
                                            message: ''
                                        },
                                        {
                                            required: false,
                                            message: ''
                                        }]
                                    })(<Input addonBefore={prefixBaseOfficeSelector} readOnly />)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start" gutter={16} style={{ maxHeight: '68px' }}>
                        <Col span={8}>
                            <FormItem label="Regional Director" className="lineHeight_none text_upper bold text-left" {...formItemLayout}>
                                {
                                    getFieldDecorator('regional_name', {
                                        rules: [{
                                            type: 'text',
                                            message: ''
                                        },
                                        {
                                            required: false,
                                            message: ''
                                        }]
                                    })(<Input readOnly />)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="Area Mgr." className="lineHeight_none text_upper bold text-left" {...formItemLayout}>
                                {
                                    getFieldDecorator('area_name', {
                                        rules: [{
                                            type: 'text',
                                            message: ''
                                        },
                                        {
                                            required: false,
                                            message: ''
                                        }]
                                    })(<Input readOnly />)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="Branch Mgr." className="lineHeight_none text_upper bold text-left" {...formItemLayout}>
                                {
                                    getFieldDecorator('branch_name', {
                                        rules: [{
                                            type: 'text',
                                            message: ''
                                        },
                                        {
                                            required: false,
                                            message: ''
                                        }]
                                    })(<Input readOnly />)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </section>
                <section>
                    <h4 className="text_upper marg_top10 marg_bottom10"><i className="fa fa-address-card" aria-hidden="true"></i> Application Information</h4>
                    <Row type="flex" justify="start">
                        <Col span={8} className="text-center">
                            <div className="bg_grayLight" style={{ width: '95%', minHeight: '275px' }} >
                                <Icon type="user" style={{ fontSize: '10.5em', marginTop: '60px', color: '#FFF' }} />
                            </div>
                            <div className="text_upper bold inline">
                                <Icon type="line-chart" /> Working Period : 3.0.11
                            </div>
                        </Col>
                        <Col span={16}>
                            <Row type="flex" justify="start">
                                <Col span={24} style={FixHeightForm}>
                                    <label className="text_upper bold">Owner Source</label>
                                    <InputGroup compact>
                                        <FormItem style={{ width: '25%' }}>
                                            {
                                                getFieldDecorator('radio-button', { initialValue: 'RM' })(
                                                    <RadioGroup onChange={handleSource}>
                                                        <RadioButton value="RM">RM</RadioButton>
                                                        <RadioButton value="BM">BM</RadioButton>
                                                    </RadioGroup>
                                                )
                                            }
                                        </FormItem>
                                        <FormItem style={{ width: '75%' }} className="lineHeight_none text_upper bold inline">
                                            {
                                                getFieldDecorator('owner_source', {
                                                    rules: [{
                                                        type: 'text',
                                                        message: ''
                                                    },
                                                    {
                                                        required: false,
                                                        message: ''
                                                    }]
                                                })(<Input className={visible ? '' : 'hide'} />)
                                            }
                                        </FormItem>
                                    </InputGroup>
                                </Col>
                                <Col span={24} style={FixHeightForm}>
                                    <label className="text_upper bold">
                                        Source Of Customer
                                        <span className={ (multiField) ? '':'hide' }> / Refer Code</span>
                                    </label>
                                    <InputGroup compact>
                                        <FormItem className="lineHeight_none text_upper bold inline" style={multiField ? { width: '75%' } : { width: '100%' }}>
                                            {
                                                getFieldDecorator('select', {
                                                    rules: [{
                                                        required: false,
                                                        message: ''
                                                    }]
                                                })(
                                                    <Select onChange={handleChanel}>
                                                        <Option value=""></Option>
                                                        <Option value="FV">Field visit</Option>
                                                        <Option value="TLA">Refer: Thai Life</Option>
                                                    </Select>
                                                    )
                                            }
                                        </FormItem>
                                        <FormItem className="lineHeight_none text_upper bold inline" style={multiField ? { width: '25%' } : { display: 'none' }}>
                                            {
                                                getFieldDecorator('refer_code', {
                                                    rules: [{
                                                        type: 'text',
                                                        message: ''
                                                    },
                                                    {
                                                        required: false,
                                                        message: ''
                                                    }]
                                                })(<Input placeholder="Refer Code" />)
                                            }
                                        </FormItem>
                                    </InputGroup>
                                </Col>
                                <Col span={24} style={FixHeightForm}>
                                    <label className="text_upper bold">Application Owner</label>
                                    <InputGroup compact>
                                        <FormItem className="lineHeight_none text_upper bold inline" style={{ width: '25%' }}>
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
                                                })(<Input />)
                                            }
                                        </FormItem>
                                        <FormItem className="lineHeight_none text_upper bold inline" style={{ width: '75%' }}>
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
                                                })(<Input />)
                                            }
                                        </FormItem>
                                    </InputGroup>
                                </Col>
                                <Col span={24} style={FixHeightForm}>
                                    <label className="text_upper bold">Position Title</label>
                                    <FormItem className="lineHeight_none text_upper bold inline">
                                        {
                                            getFieldDecorator('owner_position', {
                                                rules: [{
                                                    type: 'text',
                                                    message: ''
                                                },
                                                {
                                                    required: false,
                                                    message: ''
                                                }]
                                            })(<Input />)
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={24} style={FixHeightForm}>
                                    <label className="text_upper bold">Contact</label>
                                    <InputGroup compact>
                                        <FormItem className="lineHeight_none text_upper bold inline" style={{ width: '50%' }}>
                                            {
                                                getFieldDecorator('owner_mobile1', {
                                                    rules: [{
                                                        type: 'text',
                                                        message: ''
                                                    },
                                                    {
                                                        required: false,
                                                        message: ''
                                                    }]
                                                })(<Input />)
                                            }
                                        </FormItem>
                                        <FormItem className="lineHeight_none text_upper bold inline" style={{ width: '50%' }}>
                                            {
                                                getFieldDecorator('owner_mobile2', {
                                                    rules: [{
                                                        type: 'text',
                                                        message: ''
                                                    },
                                                    {
                                                        required: false,
                                                        message: ''
                                                    }]
                                                })(<Input />)
                                            }
                                        </FormItem>
                                    </InputGroup>
                                </Col>                                
                            </Row>
                        </Col>
                    </Row>
                    <Row type="flex" justify="end" style={{ maxHeight: '35px' }}>
                        <FormItem className="lineHeight_none bold inline">
                            <Button type="primary" icon="save" htmlType="submit" size="large" className="text_upper">Save</Button>
                        </FormItem>     
                    </Row>
                </section>                
            </Form>
        )
    }

}

export default Form.create()(AppOwnerFormItem)