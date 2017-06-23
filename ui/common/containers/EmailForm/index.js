import React, { Component } from 'react'
import moment from 'moment'
import TextEditor from './texteditor'
import FontAwesome from 'react-fontawesome'
import {
    Row, Col, Button, Select, Table, Input
} from 'antd';
import styles from './index.scss'

const Option = Select.Option;

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
    detail: 'New York No. 2 Lake Park',
    date: new Date()
}, {
    key: '4',
    to: 'customer4@hotmail.com',
    subject: "สอบถามความคิดเห็นเพิ่มเติม",
    detail: 'New York No. 3 Lake Park',
    date: new Date()
}];

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    })
};

class EmailForm extends Component {
    state = {
        text: '',
        options: [],
        showEmailForm: false,
        selectRecord: {
            to: null,
            subject: null,
            detail: null
        }
    }

    handleChange = (text) => {
        this.setState({ selectRecord: { detail: text } })
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

    onRowClick = (record, index) => {
        this.setShowEmailForm(record)
    }

    setShowEmailForm = (selectRecord) => {
        this.setState({ showEmailForm: !this.state.showEmailForm, selectRecord })
    }

    renderForm = () => {
        console.log("render", this.state.selectRecord)
        if (!this.state.showEmailForm) {
            console.log(this)
            return (
                <div>
                    <Button type="primary" icon="plus-circle-o" style={{ marginBottom: '10px' }} onClick={this.setShowEmailForm}>New</Button>
                    <Table rowSelection={rowSelection} onRowClick={this.onRowClick} size='small' columns={columns} dataSource={data} />
                </div>
            )
        }
        else {
            return (
                <div>
                    <Row gutter={6} className={styles['mail-form-row']}>
                        <Col span={1}>
                            To
                    </Col>
                        <Col span={23}>
                            <Input value={this.state.selectRecord.to} />
                        </Col>
                    </Row>
                    <Row gutter={6} className={styles['mail-form-row']}>
                        <Col span={1}>
                            Cc
                    </Col>
                        <Col span={23}>
                            <Input />
                        </Col>
                    </Row>
                    <Row gutter={6} style={{ padding: '10px' }}>
                        <Col span={24}>
                            <Input placeholder="Add a subject" value={this.state.selectRecord.subject} />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={24}>
                            <TextEditor
                                detail={this.state.selectRecord.detail}
                                handleChange={this.handleChange}
                            />
                        </Col>
                    </Row>
                    <Row gutter={6}>
                        <Col span={8}>
                            <Button type="primary"><FontAwesome name="paper-plane" /> Send</Button>
                            <Button type="danger" ghost onClick={this.setShowEmailForm} style={{ marginLeft: '8px' }}>Discard</Button>
                        </Col>
                    </Row>
                </div>
            )
        }
    }

    render() {
        return this.renderForm()
    }
}

export default EmailForm