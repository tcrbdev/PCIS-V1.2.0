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
const { Option, OptGroup } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class CustomerInfo extends Component {

    state = {
        autoCompleteAddress: [],
        channelTypeOption: null,
        businessTypeOption: null,
        interestingProductRadio: null,
        opportunityCustomerRadioButton: null,
        presentProductTypeRadioButton: null,
        businessPrefixOption: null,
        appointmentReasonOption: null,
        prefixOption: null,
        loading: false
    }

    componentWillMount() {
        this.props.getMasterAll()
    }

    componentWillReceiveProps(nextProps) {
        const { MASTER_ALL } = nextProps

        if (_.isEmpty(this.state.autoCompleteAddress)) {
            let address = this.getAutoCompleteAddress(MASTER_ALL)
            this.setState({
                autoCompleteAddress: address,
                loading: _.isEmpty(MASTER_ALL)
            })
        }

        if (_.isEmpty(this.state.businessPrefixOption)) {
            this.setState({
                businessPrefixOption: _.orderBy(MASTER_ALL.business_prefix, 'BusinessPrefixIndex').map((item, index) => {
                    return (<Option key={index} value={item.BusinessPrefixCode}>{item.BusinessPrefixName}</Option>)
                })
            })
        }

        if (_.isEmpty(this.state.interestingProductRadio)) {
            this.setState({
                interestingProductRadio: MASTER_ALL.interesting_product.map((item, index) => {
                    return (<Radio key={index} value={item.InterestingProductCode}>{item.InterestingProductName}</Radio>)
                })
            })
        }

        if (_.isEmpty(this.state.prefixOption)) {
            this.setState({
                prefixOption: MASTER_ALL.prefix.map((item, index) => {
                    return (<Option key={index} value={item.PrefixId}>{item.PrefixNameTH}</Option>)
                })
            })
        }

        if (_.isEmpty(this.state.channelTypeOption)) {
            this.setState({
                channelTypeOption: MASTER_ALL.channel_type.map((item, index) => {
                    return (
                        <OptGroup key={index} label={item.GroupChannelName}>
                            {
                                item.ChannelItem.map((cItem, cIndex) => {
                                    return (<Option key={cIndex} value={cItem.ChannelTypeCode}>{cItem.ChannelTypeName}</Option>)
                                })
                            }
                        </OptGroup>
                    )
                })
            })
        }

        if (_.isEmpty(this.state.businessTypeOption)) {
            this.setState({
                businessTypeOption: MASTER_ALL.business_type.map((item, index) => {
                    return (<Option key={index} value={item.BusinessTypeCode}>{item.BusinessTypeName}</Option>)
                })
            })
        }

        if (_.isEmpty(this.state.opportunityCustomerRadioButton)) {
            this.setState({
                opportunityCustomerRadioButton: _.orderBy(MASTER_ALL.opportunity_customer, 'OpportunityCustomerIndex').map((item, index) => {
                    return (<RadioButton key={index} value={item.OpportunityCustomerCode}>{item.OpportunityCustomerName}</RadioButton>)
                })
            })
        }

        if (_.isEmpty(this.state.presentProductTypeRadioButton)) {
            this.setState({
                presentProductTypeRadioButton: MASTER_ALL.present_product_type.map((item, index) => {
                    return (<RadioButton key={index} value={item.PresentProductTypeCode}>{item.PresentProductTypeDigit}</RadioButton>)
                })
            })
        }

        if (_.isEmpty(this.state.appointmentReasonOption)) {
            this.setState({
                appointmentReasonOption: MASTER_ALL.appointment_reason.map((item, index) => {
                    return (<Option key={index} value={item.AppointmentReasonCode}>{item.AppointmentReasonName}</Option>)
                })
            })
        }

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
                            label: `${idistrict.DistrictNameTH}`,
                            code: idistrict.ZipCode
                        }))
                }))
        }))
    }

    businessProvinceChange = (value, selectedOptions) => {
        console.log(this.props)
        const { setFieldsValue } = this.props.form
        if (value.length == 3) {
            const zipcode = selectedOptions[2].code
            setFieldsValue({ businessZipCode: zipcode })
        } else {
            setFieldsValue({ businessZipCode: null })
        }
    }

    customerProvinceChange = (value, selectedOptions) => {
        const { setFieldsValue } = this.props.form
        if (value.length == 3) {
            const zipcode = selectedOptions[2].code
            setFieldsValue({ customerZipCode: zipcode })
        } else {
            setFieldsValue({ customerZipCode: null })
        }
    }

    businessPrefixSelector(name) {
        const { getFieldDecorator } = this.props.form
        return getFieldDecorator(name, {
            rules: [{ required: true }],
        })(
            <Select style={{ width: '65px' }}>
                {
                    this.state.businessPrefixOption
                }
            </Select>
            );
    }

    prefixSelector(name, radioName) {
        const { getFieldDecorator } = this.props.form
        let option = {
            rules: [{ required: true }],
        }

        if (radioName)
            option.onChange = this.prefixSexChange.bind({ _: this, rd: radioName })

        return getFieldDecorator(name, option)(
            <Select style={{ width: '75px' }}>
                {
                    this.state.prefixOption
                }
            </Select>
        );
    }

    prefixSexChange(value) {
        const { props: { MASTER_ALL, form: { setFieldsValue } } } = this._
        const sex = _.find(MASTER_ALL.prefix, { PrefixId: value })
        let sexValue = ''

        if (this.rd == 'customerSex') {
            setFieldsValue({ customerSex: sex.PrefixSex })
        }
        else if (this.rd == 'contractSex') {
            setFieldsValue({ contractSex: sex.PrefixSex })
        }
    }

    componentDidMount() {

    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form : ', values)
            }
        })
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form

        return (
            <Spin tip="Loading..." size="large" spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit}>
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel className={styles['Panel']}
                            header={
                                <div className={styles['Icon-Panel']}><Icon type="user" /><span>Basic Information</span></div>
                            } key="1">
                            <Row gutter={6}>
                                <Col span={24}>
                                    <FormItem label="ประเภท - ชื่อกิจการ">
                                        {getFieldDecorator('businessName', {
                                            rules: [{ required: true, message: 'กรุณาเลือกประเภทกิจการ และ ชื่อกิจการ' }],
                                        })(
                                            <Input addonBefore={this.businessPrefixSelector('businessPrefix')} placeholder="ชื่อกิจการ" />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={6}>
                                <Col span={12}>
                                    <FormItem label="รายละเอียดเพิ่มเติมเกี่ยวกับกิจการ">
                                        {getFieldDecorator('businessDescription')(
                                            <Input type="textarea" placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับกิจการ" autosize={{ minRows: 2, maxRows: 3 }} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="ที่อยู่ กิจการ">
                                        {getFieldDecorator('businessAddress')(
                                            <Input type="textarea" placeholder="ที่อยู่ กิจการ" autosize={{ minRows: 2, maxRows: 3 }} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={6}>
                                <Col span={12}>
                                    <FormItem label="จังหวัด" >
                                        {
                                            getFieldDecorator('businessProvince', {})
                                                (
                                                <Cascader
                                                    showSearch
                                                    options={this.state.autoCompleteAddress}
                                                    onChange={this.businessProvinceChange} />
                                                )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="รหัสไปรษณีย์" >
                                        {
                                            getFieldDecorator('businessZipCode', {})
                                                (
                                                <Input placeholder="รหัสไปรษณีย์" className={styles['disable-text']} disabled={true} />
                                                )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="เบอร์โทรศัพท์กิจการ">
                                        {getFieldDecorator('businessTel', {
                                            rules: [{ required: true, message: 'กรุณาใส่เบอร์โทรศัพท์' }],
                                        })(
                                            <Input placeholder="เบอร์โทรศัพท์กิจการ" />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={6}>
                                <Col span={12}>
                                    <FormItem label="ชื่อ - นามสกุล ลูกค้า">
                                        {getFieldDecorator('customerName', {
                                            rules: [{ required: true, message: 'กรุณากรอกชื่อ - นามสกุล ลูกค้า' }],
                                        })(
                                            <Input addonBefore={this.prefixSelector('customerPrefix', 'customerSex')} placeholder="ชื่อ - นามสกุล ลูกค้า" />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="เพศ">
                                        {getFieldDecorator('customerSex')(
                                            <RadioGroup disabled={!_.isEmpty(getFieldValue("customerPrefix"))} size="large" style={{ width: '100%' }}>
                                                <RadioButton value="M" className="man"><Icon type="man" style={{ marginRight: '5px' }} />ชาย</RadioButton>
                                                <RadioButton value="F" className="woman"><Icon type="woman" style={{ marginRight: '5px' }} />หญิง</RadioButton>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="เบอร์โทรศัพท์">
                                        {getFieldDecorator('customerTel', {
                                            rules: [{ required: true, message: 'กรุณาใส่เบอร์โทรศัพท์' }],
                                        })(
                                            <Input placeholder="เบอร์โทรศัพท์" />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={6}>
                                <Col span={12}>
                                    <FormItem label="ชื่อ - นามสกุล ผู้ติดต่อ">
                                        {getFieldDecorator('contractName', {
                                            rules: [{ required: true, message: 'กรุณากรอกชื่อ - นามสกุล ผู้ติดต่อ' }],
                                        })(
                                            <Input addonBefore={this.prefixSelector('contractPrefix', 'contractSex')} placeholder="ชื่อ - นามสกุล ผู้ติดต่อ" />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="เพศ">
                                        {
                                            getFieldDecorator('contractSex')
                                                (
                                                <RadioGroup disabled={!_.isEmpty(getFieldValue("contractPrefix"))} size="large" style={{ width: '100%' }}>
                                                    <RadioButton value="M" className="man"><Icon type="man" style={{ marginRight: '5px' }} />ชาย</RadioButton>
                                                    <RadioButton value="F" className="woman"><Icon type="woman" style={{ marginRight: '5px' }} />หญิง</RadioButton>
                                                </RadioGroup>
                                                )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="เบอร์โทรศัพท์">
                                        {getFieldDecorator('contractTel', {
                                            rules: [{ required: true, message: 'กรุณาใส่เบอร์โทรศัพท์' }],
                                        })(
                                            <Input placeholder="เบอร์โทรศัพท์" />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Panel>
                        <Panel
                            header={
                                <div className={styles['Icon-Panel']}><Icon type="idcard" /><span>Advance Information</span></div>
                            } key="2">
                            <Row gutter={6}>
                                <Col span={6}>
                                    <FormItem label="เลขบัตรประจำตัวประชาชน">
                                        {getFieldDecorator('customerIdCard')(
                                            <Input placeholder="เลขบัตรประจำตัวประชาชน" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="อีเมล์">
                                        {getFieldDecorator('customerEmail')(
                                            <Input placeholder="อีเมล์" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={3}>
                                    <FormItem label="รายได้กิจการ">
                                        {getFieldDecorator('customerIncome')(
                                            <Input placeholder="รายได้กิจการ" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={6}>
                                <Col span={12}>
                                    <FormItem label="ที่อยู่ ลูกค้า">
                                        {getFieldDecorator('customerAddress')(
                                            <Input type="textarea" placeholder="ที่อยู่ ลูกค้า" autosize={{ minRows: 2, maxRows: 3 }} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={6}>
                                <Col span={12}>
                                    <FormItem label="จังหวัด" >
                                        {
                                            getFieldDecorator('customerProvince', {})
                                                (
                                                <Cascader
                                                    showSearch
                                                    placeholder="จังหวัด"
                                                    options={this.state.autoCompleteAddress}
                                                    onChange={this.customerProvinceChange} />
                                                )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="รหัสไปรษณีย์" >
                                        {
                                            getFieldDecorator('customerZipCode', {})
                                                (
                                                <Input placeholder="รหัสไปรษณีย์" className={styles['disable-text']} disabled={true} />
                                                )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={6}>
                                <Col span={4}>
                                    <FormItem label="ลูกค้า สนใจผลิตภัณฑ์" >
                                        {
                                            getFieldDecorator('customerInterestingProduct', {})
                                                (
                                                <RadioGroup>
                                                    {this.state.interestingProductRadio}
                                                </RadioGroup>
                                                )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="รับทราบจากช่องทาง" >
                                        {
                                            getFieldDecorator('customerChannelType', {})
                                                (
                                                <Select>
                                                    {this.state.channelTypeOption}
                                                </Select>
                                                )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="กิจการเกี่ยวกับ" >
                                        {
                                            getFieldDecorator('customerBusinessType', {})
                                                (
                                                <Select>
                                                    {this.state.businessTypeOption}
                                                </Select>
                                                )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="โอกาศการเป็นลูกค้า" >
                                        {
                                            getFieldDecorator('customerOpportunity', {})
                                                (
                                                <RadioGroup size="large" style={{ width: '100%' }}>
                                                    {this.state.opportunityCustomerRadioButton}
                                                </RadioGroup>
                                                )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="ผลิตภัณฑ์นำเสนอ" >
                                        {
                                            getFieldDecorator('customerPresentProductType', {})
                                                (
                                                <RadioGroup size="large" style={{ width: '100%' }}>
                                                    {this.state.presentProductTypeRadioButton}
                                                </RadioGroup>
                                                )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={6}>
                                <Col span={8}>
                                    <FormItem label="เหตุผลการนัดหมาย" >
                                        {
                                            getFieldDecorator('customerAppointmentReason', {})
                                                (
                                                <Select >
                                                    {this.state.appointmentReasonOption}
                                                </Select>
                                                )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="วงเงินที่ต้องการ">
                                        {getFieldDecorator('customerRequestLoan')(
                                            <Input placeholder="วงเงินที่ต้องการ" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="เงินเดือนลูกค้า">
                                        {getFieldDecorator('customerSalary')(
                                            <Input placeholder="เงินเดือนลูกค้า" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="สถานภาพการสมรส">
                                        {
                                            getFieldDecorator('customerMaritalStatus')
                                                (
                                                <RadioGroup size="large" style={{ width: '100%' }}>
                                                    <RadioButton value="Single" >โสด</RadioButton>
                                                    <RadioButton value="Married" >สมรส</RadioButton>
                                                    <RadioButton value="Divorced" >หย่าร้าง</RadioButton>
                                                </RadioGroup>
                                                )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={6}>
                                <Col span={8}>
                                    <FormItem label="ชื่อ - นามสกุล บุคคลอ้างอิง">
                                        {getFieldDecorator('referenceName', {
                                            rules: [{ required: true, message: 'ชื่อ - นามสกุล บุคคลอ้างอิง' }],
                                        })(
                                            <Input addonBefore={this.prefixSelector('referencePrefix')} placeholder="ชื่อ - นามสกุล บุคคลอ้างอิง" />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="ความสัมพันธ์">
                                        {getFieldDecorator('referenceRelationShip')(
                                            <Input placeholder="ความสัมพันธ์" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="เบอร์โทรศัพท์">
                                        {getFieldDecorator('referenceTel')(
                                            <Input placeholder="เบอร์โทรศัพท์" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                    <Button type="primary" htmlType="submit">Save</Button>
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