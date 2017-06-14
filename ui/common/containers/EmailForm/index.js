import React, { Component } from 'react'
import moment from 'moment'
import ReactQuill from 'react-quill'
import FontAwesome from 'react-fontawesome'
import {
    Row, Col, Button, Select, Table
} from 'antd';
import styles from './index.scss'
const Option = Select.Option;

const CustomToolbar = () => (
    <div id="toolbar" className={styles['mail-form-toolbar']}>
        <select className="ql-header">
            <option value="1"></option>
            <option value="2"></option>
            <option value="3"></option>
            <option value="4"></option>
            <option selected></option>
        </select>
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <select className="ql-color">
            <option value="rgb(117, 123, 128)"></option>
            <option value="rgb(189, 19, 152)"></option>
            <option value="rgb(114, 50, 173)"></option>
            <option value="rgb(0, 111, 201)"></option>
            <option value="rgb(75, 165, 36)"></option>
            <option value="rgb(226, 197, 1)"></option>
            <option value="rgb(208, 92, 18)"></option>
            <option value="rgb(255, 0, 0)"></option>
            <option value="rgb(255, 255, 255)"></option>
            <option selected value="rgb(0, 0, 0)"></option>
        </select>
        <select className="ql-background">
            <option value="rgb(117, 123, 128)"></option>
            <option value="rgb(189, 19, 152)"></option>
            <option value="rgb(114, 50, 173)"></option>
            <option value="rgb(0, 111, 201)"></option>
            <option value="rgb(75, 165, 36)"></option>
            <option value="rgb(226, 197, 1)"></option>
            <option value="rgb(208, 92, 18)"></option>
            <option value="rgb(255, 0, 0)"></option>
            <option value="rgb(255, 255, 255)"></option>
            <option selected value="rgb(0, 0, 0)"></option>
        </select>
    </div>
)

class EmailForm extends Component {
    state = {
        text: '',
        options: [],
    }

    handleChange = (text) => {
        this.setState({ text })
    }

    handleChanges = (value) => {
        let options;
        if (!value || value.indexOf('@') >= 0) {
            options = [];
        } else {
            options = ['gmail.com', '163.com', 'qq.com'].map((domain) => {
                const email = `${value}@${domain}`;
                return <Option key={email}>{email}</Option>;
            });
        }
        this.setState({ options });
    }

    render() {
        const columns = [{
            dataIndex: 'name',
            width: '90%',
            render: (text, row, index) => {
                console.log(row)
                return (
                    <div>
                        <Row>
                            <Col span={24}><span style={{ fontSize: '18px' }}>{row.to}</span></Col>
                        </Row>
                        <Row>
                            <Col span={24}>{row.subject}</Col>
                        </Row>
                        <Row>
                            <Col span={24}><span className={styles['detail-email']}>{row.detail}</span></Col>
                        </Row>
                    </div>
                )
            },
        }, {
            dataIndex: 'age',
            width: '10%',
            render: (text, row, index) => {
                return (<div>{moment(row.date).format("DD/MM/YYYY")}</div>)
            }
        }];

        const data = [{
            key: '1',
            to: 'customer1@hotmail.com',
            subject: "จัดส่ง promotion",
            detail: 'เรียนคุณลูกค้า ตัวอย่างโปรโมชั่นต่างๆ ที่ทางเราได้จัดส่ง',
            date: new Date()
        }, {
            key: '2',
            to: 'customer2@hotmail.com',
            subject: "ขอเอกสารเพิ่มเติม",
            detail: 'New York No. 1 Lake Park',
            date: new Date()
        }, {
            key: '3',
            to: 'customer3@hotmail.com',
            subject: "รายละเอียดของ product ต่างๆ",
            detail: 'New York No. 1 Lake Park',
            date: new Date()
        }, {
            key: '4',
            to: 'customer4@hotmail.com',
            subject: "สอบถามความคิดเห็นเพิ่มเติม",
            detail: 'New York No. 1 Lake Park',
            date: new Date()
        }];

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User',    // Column configuration not to be checked
            }),
        };

        return (
            <div>
                <Button type="primary" icon="plus-circle-o">New</Button>
                <Table rowSelection={rowSelection} size='small' columns={columns} dataSource={data} />
                <Row gutter={6}>
                    <Col span={6}>
                        <Select
                            mode="multiple"
                            style={{ width: 200 }}
                            onChange={this.handleChanges}
                            filterOption={false}
                            placeholder="Enter the account name">
                            {this.state.options}
                        </Select>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={6}>
                        <Select
                            mode="multiple"
                            style={{ width: 200 }}
                            onChange={this.handleChanges}
                            filterOption={false}
                            placeholder="Enter the account name"
                        >
                            {this.state.options}
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className={styles['mail-form']}>
                            <div className={styles['mail-from-file']}>
                            </div>
                            <div>
                                <ReactQuill
                                    className={styles['mail-form-text']}
                                    theme="snow"
                                    value={this.state.text}
                                    onChange={this.handleChange}
                                    modules={
                                        {
                                            toolbar: {
                                                container: "#toolbar"
                                            }
                                        }
                                    } >
                                    <div className="my-editing-area" />
                                </ReactQuill>
                            </div>
                            <div>
                                <CustomToolbar />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={6}>
                        <Button type="primary"><FontAwesome name="paper-plane" /> Send</Button>
                    </Col>
                    <Col span={6}>
                        <Button type="danger" ghost>Discard</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default EmailForm