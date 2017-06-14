import React, { Component } from 'react'
import { Form, Input, Select, Radio, Button, Collapse, Row, Col, Icon, Avatar, Tooltip } from 'antd'
import RequestForm from './modal_handler'
import Style from './style/branch_style.css'

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;
const Panel = Collapse.Panel;

class Branch extends Component {

    state = {
        visible: false,
        view_title: null,
        view_mode: null,
        bm_handle: false
    }

    handleBMSource = (e) => {
        const { value } = e.target;
        const { bm_handle } = this.state
        this.setState({ bm_handle: (value) == 'BM' ? true : false });
    }

    showModal = (e) => {
        this.setState({
            visible: true,
            view_title: e.currentTarget.dataset.attr,
            view_mode: e.currentTarget.dataset.mode
        })
    }

    handleOk = (e) => {
        this.setState({ visible: false });
    }

    handleCancel = (e) => {
        this.setState({ visible: false });
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {}

        return (
            <article id="case_handle_component">
                <Row>
                    <Col >
                        <Collapse bordered={true} defaultActiveKey={['1']}>
                            <Panel className="panel_darkCyan" header={
                                <h4 className="text_upper fg_white">Information</h4>
                            } key="1">

                                <section>
                                    <h4 className="text_upper marg_bottom10">
                                        <i className="fa fa-globe" aria-hidden="true"></i> Zone Information
                                    </h4>
                                    <Row type="flex" justify="start" gutter={16} className="marg_bottom5">
                                        <Col span={8}>
                                            <h4 className="text_upper">Region</h4>
                                            <Tooltip placement="right" title="Mobile : -">
                                                <Input defaultValue="" size="large" disabled />
                                            </Tooltip>
                                        </Col>
                                        <Col span={8}>
                                            <h4 className="text_upper">Area</h4>
                                            <Tooltip placement="right" title="Mobile : -">
                                                <Input defaultValue="" size="large" disabled />
                                            </Tooltip>
                                        </Col>
                                        <Col span={8}>
                                            <h4 className="text_upper">Branch</h4>
                                            <InputGroup compact>
                                                <Tooltip placement="right" title="Mobile : -">
                                                    <Select defaultValue="Option1" size="large" disabled>
                                                        <Option value="Option1">000</Option>
                                                        <Option value="Option2">017</Option>
                                                        <Option value="Option3">999</Option>
                                                    </Select>
                                                    <Input defaultValue="" size="large" style={{ width: '75%' }} disabled />
                                                </Tooltip>
                                            </InputGroup>

                                        </Col>
                                    </Row>
                                    <Row type="flex" justify="start" gutter={16}>
                                        <Col span={8}>
                                            <h4 className="text_upper">Regional Director</h4>
                                            <Tooltip placement="right" title="Mobile : -">
                                                <Input defaultValue="" size="large" disabled />
                                            </Tooltip>
                                        </Col>
                                        <Col span={8}>
                                            <h4 className="text_upper">Area Mgr.</h4>
                                            <Tooltip placement="right" title="Mobile : -">
                                                <Input defaultValue="" size="large" disabled />
                                            </Tooltip>
                                        </Col>
                                        <Col span={8}>
                                            <h4 className="text_upper">Branch Mgr.</h4>
                                            <Tooltip placement="right" title="Mobile : -">
                                                <Input defaultValue="" size="large" disabled />
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                </section>

                                <section>
                                    <h4 className="text_upper marg_top10 marg_bottom10">
                                        <i className="fa fa-address-card" aria-hidden="true"></i> Application Information
                                    </h4>
                                    <Col span={8} className="text-center">
                                        <Avatar id="avatar_cust" shape="square" size="large" icon="user" style={{ width: '95%', minHeight: '260px' }} className="place-left" />
                                        <footer>
                                            <h4 className="text_upper inline">
                                                <Icon type="line-chart" /> Working Period
                                            </h4>
                                            <div className="inline"> : 3.0.11</div>
                                        </footer>
                                    </Col>
                                    <Col span={16}>
                                        <section>
                                            <h4 className="text_upper">App. Owner Source</h4>
                                            <RadioGroup defaultValue="RM" onChange={this.handleBMSource} size="large" style={{ width: '25%' }}>
                                                <RadioButton value="RM">RM</RadioButton>
                                                <RadioButton value="BM">BM</RadioButton>
                                            </RadioGroup>
                                            <Input defaultValue="" size="large" placeholder="Name - Surname" className={this.state.bm_handle ? '' : 'hide'} style={{ width: '75%' }} />
                                        </section>
                                        <section className="marg_top5">
                                            <h4 className="text_upper">Application Owner</h4>
                                            <InputGroup compact>
                                                <Input defaultValue="" size="large" placeholder="Emp Code" style={{ width: '25%' }} disabled />
                                                <Input defaultValue="" size="large" placeholder="Name - Surname" style={{ width: '75%' }} disabled />
                                            </InputGroup>

                                            {/*<InputGroup compact>
                                                <Input defaultValue="" size="large" placeholder="Emp Code" addonAfter={<Icon type="search" />} style={{ width: '25%' }} />
                                                <Input defaultValue="" size="large" placeholder="Name - Surname" style={{ width: '75%' }} disabled />
                                            </InputGroup>*/}

                                        </section>
                                        <section className="marg_top5">
                                            <h4 className="text_upper">Position</h4>
                                            <Input defaultValue="" size="large" placeholder="Job Postiion" disabled />
                                        </section>
                                        <section className="marg_top5">
                                            <h4 className="text_upper">Contact</h4>
                                            <InputGroup compact>
                                                <Input defaultValue="" size="large" placeholder="Mobile 1" style={{ width: '50%' }} disabled />
                                                <Input defaultValue="" size="large" placeholder="Mobile 2" style={{ width: '50%' }} disabled />
                                            </InputGroup>
                                        </section>

                                        <section id="request_tool_component" className="marg_top5">
                                            <Collapse bordered={false} defaultActiveKey={['1']}>
                                                <Panel header={
                                                    <h4 className="text_upper">
                                                        <i className="fa fa-wrench" style={{ fontSize: '1.2em' }} /> Request Form & History
                                                    </h4>
                                                } key={1}>
                                                    <Row type="flex" justify="end">
                                                        <Col>
                                                            <ButtonGroup size="large">
                                                                <Button type="primary" onClick={this.showModal.bind(this)} data-mode="CBR" data-attr="REQUEST: CHANGE BRANCH">
                                                                    <Icon type="exception" style={{ fontSize: '1.2em' }} />
                                                                    Change Branch
                                                                </Button>
                                                                <Button type="primary" onClick={this.showModal.bind(this)} data-mode="CRM" data-attr="REQUEST: CHANGE RM" className="marg_right10">
                                                                    <Icon type="solution" style={{ fontSize: '1.2em' }} />
                                                                    Change RM
                                                                </Button>
                                                            </ButtonGroup>
                                                            <Button size="large" type="dashed" onClick={this.showModal.bind(this)} data-mode="HIST" data-attr="TIMELINE: HISTORY">
                                                                <Icon type="clock-circle-o" style={{ fontSize: '1.2em' }} />
                                                                History
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Panel>
                                            </Collapse>
                                        </section>

                                    </Col>
                                </section>


                            </Panel>
                        </Collapse>
                    </Col>
                </Row>
                <RequestForm visible={this.state.visible} viewTitle={this.state.view_title} viewMode={this.state.view_mode} handleOk={this.handleOk} onCancel={this.handleCancel} />
            </article>
        )
    }

}

export default Form.create()(Branch) 