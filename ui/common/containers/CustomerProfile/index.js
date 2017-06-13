import React, { Component } from 'react'
import CustomerInfo from '../CustomerInfo'
import CustomerTab from '../CustomerTab'

import FontAwesome from 'react-fontawesome'
import {
    Row, Col
} from 'antd';

class CustomerProfile extends Component {
    render() {
        return (
            <Row gutter={6}>
                <Col span={12}>
                    <CustomerInfo />
                </Col>
                <Col span={12}>
                    <CustomerTab />
                </Col>
            </Row>
        )
    }
}

export default CustomerProfile
