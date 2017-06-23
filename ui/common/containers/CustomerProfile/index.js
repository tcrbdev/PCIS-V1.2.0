import React, { Component } from 'react'
import { connect } from 'react-redux'
import CustomerInfo from '../CustomerInfo'
import CustomerTab from '../CustomerTab'
import CallScript from '../CallScript'
import BranchInformation from '../BranchInformation'
import { getMasterAll } from '../../actions/master'

import { AppOwnerContainer } from '../case_handle'

import FontAwesome from 'react-fontawesome'
import {
    Row, Col
} from 'antd';

class CustomerProfile extends Component {

    state = {
        source_type: []
    }

    componentWillMount() {
        this.props.getMasterAll()
    }

    componentWillReceiveProps(nextProps) {
        const { source_type } = nextProps.MASTER_ALL
        this.setState({ source_type })
    }

    render() {
        return (
            <div style={{ padding: '10px' }}>
                <Row gutter={12}>
                    <Col span={10}>
                        <div style={{ marginBottom: '10px' }}>
                            <AppOwnerContainer master={this.state.source_type} />
                        </div>
                        <CustomerInfo />
                    </Col>
                    <Col span={10}>
                        <CustomerTab />
                    </Col>
                    <Col span={4}>
                        <CallScript />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        MASTER_ALL: state.MASTER_ALL
    }), {
        getMasterAll: getMasterAll
    })(CustomerProfile)
