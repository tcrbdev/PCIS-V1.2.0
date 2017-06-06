import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import styles from './index.scss'
import {
    Form, Icon, Input
    , AutoComplete, Select, Cascader
    , Button, Collapse, Row
    , Col, Spin, Radio
} from 'antd';

import { getMasterAll } from '../../actions/master'

const FormItem = Form.Item;
const Panel = Collapse.Panel;

class CustomerInfo extends Component {

    state = {
        autoCompleteAddress: [],
        loading: true
    }

    componentWillMount() {
        this.props.getMasterAll()
    }

    componentWillReceiveProps(nextProps) {
        const { MASTER_ALL } = nextProps

        let address = this.getAutoCompleteAddress(MASTER_ALL)
        console.log("ReceiveProps", address)
        this.setState({
            autoCompleteAddress: address,
            loading: _.isEmpty(MASTER_ALL)
        })
    }

    getAutoCompleteAddress(props) {
        const { province, amphur, district } = props

        return _.map(province, (iprovince, index) => ({
            value: iprovince.ProvinceCode,
            label: iprovince.ProvinceNameTH,
            children: _.filter(amphur, (o) => o.ProvinceCode == iprovince.ProvinceCode)
                .map((iamphur, index) => ({
                    value: iamphur.AmphurCode,
                    label: iamphur.AmphurNameTH,
                    children: _.filter(district, (o) => o.ProvinceCode == iprovince.ProvinceCode && o.AmphurCode == iamphur.AmphurCode)
                        .map((idistrict, index) => ({
                            value: idistrict.DistrictCode,
                            label: `${idistrict.DistrictNameTH} (${idistrict.ZipCode})`,
                            code: idistrict.ZipCode
                        }))
                }))
        }))
    }

    onBusinessZipCodeChange = (value, selectedOptions) => {
        const { setFieldsValue } = this.props.form
        if (value.length == 3) {
            // const zipcode = selectedOptions[2].code
            // setFieldsValue({ BusinessZipCode: zipcode })
        } else {
            // setFieldsValue({ BusinessZipCode: null })
        }
    }


    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form : ', values)
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        // let options = [{
        //     value: 'zhejiang',
        //     label: 'Zhejiang',
        //     children: [{
        //         value: 'hangzhou',
        //         label: 'Hangzhou',
        //         children: [{
        //             value: 'xihu',
        //             label: 'West Lake',
        //         }, {
        //             value: 'xiasha',
        //             label: 'Xia Sha',
        //             disabled: true,
        //         }],
        //     }],
        // }, {
        //     value: 'jiangsu',
        //     label: 'Jiangsu',
        //     children: [{
        //         value: 'nanjing',
        //         label: 'Nanjing',
        //         children: [{
        //             value: 'zhonghuamen',
        //             label: 'Zhong Hua men',
        //         }],
        //     }],
        // }]

        // this.state.autoCompleteAddress.map((item, index) => {
        //     options.push({
        //         value: 'zhejiang',
        //         label: 'Zhejiang',
        //         children: [{
        //             value: 'hangzhou',
        //             label: 'Hangzhou',
        //             children: [{
        //                 value: 'xihu',
        //                 label: 'West Lake',
        //             }, {
        //                 value: 'xiasha',
        //                 label: 'Xia Sha',
        //                 disabled: true,
        //             }],
        //         }],
        //     })
        // })

        // options = this.state.autoCompleteAddress
        // options = []

        // console.log("render", options)

        return (
            <Spin tip="Loading..." size="large" spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit} style={{ width: '100%' }}>
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel className={styles['Panel']}
                            header={
                                <div className={styles['Icon-Panel']}><Icon type="user" /><span>Basic Information</span></div>
                            } key="1">
                            <Row gutter={4}>
                                <Col span={7}>
                                    <FormItem label="จังหวัด">
                                        {
                                            getFieldDecorator('BusinessProvince', {})
                                                (
                                                <Cascader
                                                    showSearch
                                                    options={this.state.autoCompleteAddress}
                                                    onChange={this.onBusinessZipCodeChange} />
                                                )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={2}>
                                </Col>
                            </Row>
                        </Panel>
                        <Panel
                            header={
                                <div className={styles['Icon-Panel']}><Icon type="idcard" /><span>Advance Information</span></div>
                            } key="2">
                        </Panel>
                    </Collapse>
                </Form>
            </Spin>
        )
    }
}

const CustomerInfoForm = Form.create()(CustomerInfo)

export default connect(
    (state) => ({
        MASTER_ALL: state.MASTER_ALL
    }), {
        getMasterAll: getMasterAll
    })(CustomerInfoForm)