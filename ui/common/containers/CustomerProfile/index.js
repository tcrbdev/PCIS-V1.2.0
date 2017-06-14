import React, { Component } from 'react'
import CustomerInfo from '../CustomerInfo'
import CustomerTab from '../CustomerTab'
import BranchInformation from '../BranchInformation'

import FontAwesome from 'react-fontawesome'
import {
    Row, Col
} from 'antd';

class CustomerProfile extends Component {
    render() {
        return (
            <div>
                <Row gutter={12}>
                    <Col span={12}>
                        <BranchInformation />
                    </Col>
                    <Col span={12}>
                        <CustomerTab />
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={12}>
                        <CustomerInfo />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default CustomerProfile
