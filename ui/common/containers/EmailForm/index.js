import React, { Component } from 'react'

import ReactQuill from 'react-quill'
import FontAwesome from 'react-fontawesome'
import {
    Row, Col, Button, Select, Table
} from 'antd';
const Option = Select.Option;

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
            title: 'Name',
            dataIndex: 'name',
            render: text => <a href="#">{text}</a>,
        }, {
            title: 'Age',
            dataIndex: 'age',
        }, {
            title: 'Address',
            dataIndex: 'address',
        }];
        const data = [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        }, {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        }, {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        }, {
            key: '4',
            name: 'Disabled User',
            age: 99,
            address: 'Sidney No. 1 Lake Park',
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
                <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
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
                        <ReactQuill theme="snow" value={this.state.text} onChange={this.handleChange} />
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={3}>
                        <Button type="primary"><FontAwesome name="paper-plane" style={{ marginRight: '10px' }} />Send</Button>
                    </Col>
                    <Col span={3}>
                        <Button><FontAwesome name="paper-plane" style={{ marginRight: '10px' }} />Discard</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default EmailForm