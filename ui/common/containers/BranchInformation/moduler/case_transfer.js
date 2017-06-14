import React, { Component } from 'react'
import { Input, Select, Row, Col, Icon } from 'antd'

const InputGroup = Input.Group;
const Option = Select.Option;

class TransferForm extends Component {

    render() {

        const selectOrginRequest = (
            <Select defaultValue="000" style={{ width: 70 }} disabled>
                <Option value="000">000</Option>
                <Option value="999">999</Option>
            </Select>
        );

        const selectNewRequest = (
            <Select defaultValue="" style={{ width: 70 }}>
                <Option value=""></Option>
                <Option value="000">000</Option>
            </Select>
        );

        return (
            <article>

                <header className="bg_darkCyan fg_white pad5 text_upper bold marg_bottom10">
                    <h4>Request Form</h4>
                    <h4 className="place-right" style={{ marginTop: '-18px' }}>Request Date <time>13/06/2017</time></h4>
                </header>
                <section>
                    <Row type="flex" justify="start" gutter={16} className="marg_bottom10">
                        <Col span={18}>
                            <h4 className="text_upper">Requestor</h4>
                            <InputGroup compact>
                                <Input defaultValue="" size="large" placeholder="Emp Code" style={{ width: '20%' }} disabled />
                                <Input defaultValue="" size="large" placeholder="Name - Surname" style={{ width: '40%' }} disabled />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start" gutter={16}>

                        <Col span={24}>
                            <header className="bg_darkCyan fg_white pad5 text_upper bold marg_bottom10">
                                <h4>Request Transfering</h4>
                            </header>
                            <section className="marg_bottom10">
                                <header className="text_upper">
                                    <h4>Original Branch</h4>
                                    <h4 style={{ marginLeft: '260px', marginTop: '-18px' }}>New Branch</h4>
                                </header>
                                <InputGroup compact>
                                    <Input addonBefore={selectOrginRequest} size="large" value="Head Office" disabled />
                                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none' }} size="large" placeholder="To" />
                                    <Input addonBefore={selectNewRequest} size="large" value="" disabled />
                                </InputGroup>
                            </section>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start" gutter={16} className="marg_bottom10">
                        <Col span={18} className="marg_bottom10">
                            <h4 className="text_upper">Please enter the reason</h4>
                            <Select defaultValue="N/A" size="large" style={{ width: '45%' }}>
                                <Option value="N/A">โปรดระบุ</Option>
                            </Select>
                        </Col>
                        <Col span={18}>
                            <h4 className="text_upper">Description</h4>
                            <Input type="textarea" autosize={{ minRows: 3 }} style={{ width: '45%' }} />
                        </Col>
                    </Row>
                </section>

            </article>
        )
    }

}

export default TransferForm