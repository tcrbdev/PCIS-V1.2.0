import React, { Component } from 'react'
import { connect } from 'react-redux'
import CustomerInfo from '../CustomerInfo'
import CustomerTab from '../CustomerTab'
import BranchInformation from '../BranchInformation'
import { getMasterAll } from '../../actions/master'

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
            <div>
                <Row gutter={12}>
                    <Col span={12}>
                        <BranchInformation master={this.state.source_type} />
                        <CustomerInfo />
                    </Col>
                    <Col span={12}>
                        <CustomerTab />
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
