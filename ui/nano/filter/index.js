import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
    Icon,
    Button,
    Row,
    Col,
    Collapse,
    Checkbox,
    Input,
    AutoComplete,
    Select,
    Form,
    TreeSelect,
    Modal,
    Tooltip
} from 'antd';

import {
    searchNanoData
} from '../actions/nanomaster'

import { constantQueryType } from '../../common/constants/constants'

import pinPicture from '../../../image/target.png'
import muangthai from '../../../image/muangthai.png'
import srisawat from '../../../image/srisawat.png'
import ngerntidlor from '../../../image/ngerntidlor.png'
import styles from './index.scss'

const FormItem = Form.Item
const Panel = Collapse.Panel
const CheckboxGroup = Checkbox.Group
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const tProps = {
    size: 'large',
    multiple: true,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    style: {
        width: '100%',
    }
};

const ShowMarkerOptions = [
    { label: 'PIN', value: 'MR' },
    { label: 'Radius', value: 'RA' }
];
const defaultShowMarkerOptions = ['MR', 'RA'];

const BranchTypeOptions = [
    { label: 'LB', value: 'L' },
    { label: 'Pure', value: 'P' },
    { label: 'Kiosk', value: 'K' }
];
const defaultBranchType = ['L', 'P', 'K'];

class Filter extends Component {

    state = {
        openFilterCollapsed: "1",
        visible: false
    }

    getRegionSelectItem() {
        const { NANO_MASTER_ALL: { MASTER_REGION_DATA } } = this.props

        if (!_.isEmpty(MASTER_REGION_DATA)) {
            return [{
                label: 'Select All',
                value: MASTER_REGION_DATA.map(item => item.RegionID).join(','),
                key: 'all',
                children: MASTER_REGION_DATA.map((item, index) => {
                    return ({
                        label: item.RegionID,
                        value: `${item.RegionID}`,
                        key: `${item.RegionID}`
                    })
                })
            }]
        }
    }

    getAreaSelectItem() {
        const { NANO_MASTER_ALL: { MASTER_AREA_DATA }, form: { getFieldValue } } = this.props

        if (!_.isEmpty(MASTER_AREA_DATA)) {

            const region_select = getFieldValue("RegionID") && getFieldValue("RegionID").join(',').split(',')

            const AREA_DATA = _.filter(MASTER_AREA_DATA, (o) => !_.isEmpty(_.find(region_select, (s) => (s == o.RegionID))))

            let resultGroupBy = [];
            _.mapKeys(_.groupBy(AREA_DATA, 'AreaID'), (value, key) => {
                let result = {
                    RegionID: value[0].RegionID,
                    AreaID: key,
                    Zone: []
                }
                _.mapKeys(_.groupBy(value, 'ZoneValue'), (i, k) => {
                    result.Zone.push({
                        ZoneValue: k,
                        ZoneText: i[0].ZoneText
                    })
                })
                resultGroupBy.push(result)
            })

            return [{
                label: 'Select All',
                value: resultGroupBy.map(item => item.AreaID).join(','),
                key: 'all',
                children: resultGroupBy.map((item, index) => ({
                    label: item.AreaID,
                    value: item.AreaID,
                    key: item.AreaID,
                    children: item.Zone.map(zone => ({
                        label: zone.ZoneText,
                        value: zone.ZoneValue,
                        key: zone.ZoneValue
                    }))
                }))
            }]
        }
    }

    getBranchSelectItem() {
        const { NANO_MASTER_ALL: { MASTER_BRANCH_DATA }, form: { getFieldValue } } = this.props

        if (!_.isEmpty(MASTER_BRANCH_DATA)) {
            const region_select = getFieldValue("RegionID") && getFieldValue("RegionID").join(',').split(',')
            const area_select = getFieldValue("AreaID") && getFieldValue("AreaID").join(',').split(',')
            const branch_type_select = getFieldValue("BranchType") && getFieldValue("BranchType").join(',').split(',')

            const BRANCH_DATA = _.orderBy(_.filter(MASTER_BRANCH_DATA, o => {
                return !_.isEmpty(_.find(region_select, (s) => (s == o.RegionID)))
                    &&
                    !_.isEmpty(_.find(area_select, (s) => ((o.ZoneValue).indexOf(s) >= 0)))
                    &&
                    !_.isEmpty(_.find(branch_type_select, (s) => (s == o.BranchType)))
            }), ['RegionID', 'AreaID', 'ZoneValue', 'BranchType'])

            let group = [];
            const branch = _.filter(BRANCH_DATA, o => o.BranchType != 'K')
            const kiosk = _.filter(BRANCH_DATA, { BranchType: 'K' })

            if (branch.length > 0) {
                branch.map(item => {
                    const obj = _.filter(BRANCH_DATA, { OriginBranchCode: item.BranchCode })
                    const valueKey = obj.map(m => m.BranchCode).join(",")

                    if (obj.length > 1) {
                        if (!_.isEmpty(_.find(obj, o => o.BranchType != 'K')) && !_.isEmpty(_.find(obj, { BranchType: 'K' }))) {
                            group.push({
                                label: item.BranchName,
                                value: valueKey,
                                key: valueKey,
                                children: obj.map(s => ({
                                    label: s.BranchName,
                                    value: s.BranchCode,
                                    key: s.BranchCode
                                }))
                            })
                        }
                        else {
                            obj.map(s => {
                                group.push({
                                    label: s.BranchName,
                                    value: s.BranchCode,
                                    key: s.BranchCode
                                })
                            })
                        }
                    }
                    else {
                        group.push({
                            label: item.BranchName,
                            value: valueKey,
                            key: valueKey
                        })
                    }
                })
            }
            else {
                kiosk.map(s => {
                    group.push({
                        label: s.BranchName,
                        value: s.BranchCode,
                        key: s.BranchCode
                    })
                })
            }

            return _.cloneDeep([{
                label: 'Select All',
                value: BRANCH_DATA.map(item => item.BranchCode).join(','),
                key: 'all',
                children: group
            }])
        }
    }

    getCANameSelect() {
        const { NANO_MASTER_ALL: { MASTER_BRANCH_DATA, MASTER_CALIST_DATA }, form: { getFieldValue } } = this.props

        if (!_.isEmpty(MASTER_CALIST_DATA)) {

            const branch_select = getFieldValue("BranchCode") && getFieldValue("BranchCode").join(',').split(',')

            let CALIST_DATA = _.filter(MASTER_CALIST_DATA, o => !_.isEmpty(_.find(branch_select, s => s == o.BranchCode)))

            console.log(branch_select)
            console.log(CALIST_DATA)

            let group = []
            _.mapKeys(_.groupBy(CALIST_DATA, "OriginBranchCode"), (values, key) => {

                let obj = {
                    label: _.isEmpty(_.find(MASTER_BRANCH_DATA, { BranchCode: key })) ? key : _.find(MASTER_BRANCH_DATA, { BranchCode: key }).BranchName,
                    value: values.map(m => m.CA_Code).join(','),
                    key: values.map(m => m.CA_Code).join(',')
                }

                obj.children = values.map((item, index) => ({
                    label: item.CA_Name,
                    value: item.CA_Code,
                    key: item.CA_Code
                }))

                group.push(obj)
            })

            return [{
                label: 'Select All',
                value: CALIST_DATA.map(item => item.CA_Code).join(','),
                key: CALIST_DATA.map(item => item.CA_Code).join(','),
                children: group
            }]
        }
    }

    getProvinceSelect() {
        const { NANO_MASTER_ALL: { MASTER_TARGET_MARKET_PROVINCE_DATA }, form: { getFieldValue } } = this.props

        if (!_.isEmpty(MASTER_TARGET_MARKET_PROVINCE_DATA)) {

            const region_select = getFieldValue("RegionID") && getFieldValue("RegionID").join(',').split(',')

            const PROVINCE_DATA = _.filter(MASTER_TARGET_MARKET_PROVINCE_DATA, (o) => !_.isEmpty(_.find(region_select, (s) => (s == o.RegionID))))

            const haveDistrict = _.filter(PROVINCE_DATA, o => !_.isEmpty(o.District))
            const notHaveDistrict = _.filter(PROVINCE_DATA, o => _.isEmpty(o.District))

            let result = []

            _.mapKeys(_.groupBy(haveDistrict, "ProvinceName"), (value, key) => {
                let group = {
                    label: key,
                    value: key,
                    key: key,
                    children: value.map(m => ({
                        label: m.District,
                        value: m.District,
                        key: m.District
                    }))
                }

                result.push(group)
            })

            _.forEach(notHaveDistrict, (item, key) => {
                result.push({
                    label: item.ProvinceName,
                    value: item.ProvinceName,
                    key: item.ProvinceName
                })
            })

            return [{
                label: 'Select All',
                value: [...haveDistrict.map(item => item.District), ..._.uniqBy(PROVINCE_DATA, "ProvinceName").map(item => item.ProvinceName)].join(','),
                key: [...haveDistrict.map(item => item.District), ..._.uniqBy(PROVINCE_DATA, "ProvinceName").map(item => item.ProvinceName)].join(','),
                children: result
            }]
        }
    }

    getComplititorSelect() {
        const { NANO_MASTER_ALL: { MASTER_COMPLITITOR_PROVINCE_DATA }, form: { getFieldValue } } = this.props

        if (!_.isEmpty(MASTER_COMPLITITOR_PROVINCE_DATA)) {

            const region_select = getFieldValue("RegionID") && getFieldValue("RegionID").join(',').split(',')

            const PROVINCE_DATA = _.filter(MASTER_COMPLITITOR_PROVINCE_DATA, (o) => !_.isEmpty(_.find(region_select, (s) => (s == o.RegionCode))))

            let group = []
            _.mapKeys(_.groupBy(PROVINCE_DATA, "ProvinceName"), (value, key) => {
                let obj = {
                    label: key,
                    value: value.map(m => m.District).join(','),
                    key: value.map(m => m.District).join(',')
                }

                if (value.length > 1) {
                    obj.children = value.map((item, index) => ({
                        label: item.District,
                        value: item.District,
                        key: `${item.District}_${index}`
                    }))
                }

                group.push(obj)
            })

            return [{
                label: 'Select All',
                value: PROVINCE_DATA.map(item => item.District).join(','),
                key: PROVINCE_DATA.map(item => item.District).join(','),
                children: group
            }]
        }
    }

    ClearField = (e) => {
        const { resetFields } = this.props.form

        resetFields();
    }

    onSearch = (e) => {
        const { searchNanoData } = this.props

        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {

                this.setState({ openFilterCollapsed: null })

                const criteria = {
                    RegionID: !_.isEmpty(values.RegionID) ? values.RegionID.join(',') : null,
                    AreaID: null,
                    Zone: !_.isEmpty(values.AreaID) ? values.AreaID.join(",") : null,
                    BranchCode: !_.isEmpty(values.BranchCode) ? values.BranchCode.join(',') : null,
                    BranchType: !_.isEmpty(values.BranchType) ? values.BranchType.join(',') : null,
                    CAName: !_.isEmpty(values.CAName) ? values.CAName.join(',') : null,
                    MarketName: !_.isEmpty(values.MarketName) ? values.MarketName : null,
                    IncludeExitingMarket: values.IncludeExitingMarket,
                    IncludeKioskMarket: values.IncludeKioskMarket,
                    IncludePotentialMarket: values.IncludePotentialMarket,
                    Province: !_.isEmpty(values.Province) ? values.Province.join(",") : null,
                    MarkerOptions: !_.isEmpty(values.MarkerOptions) ? values.MarkerOptions : [],
                    District: !_.isEmpty(values.ProvinceComplititor) ? values.ProvinceComplititor.join(",") : null,
                    Srisawat: values.Srisawat,
                    Muangthai: values.Muangthai,
                    ngerdlor: values.ngerdlor,
                    QueryType: this.getQueryTypeReportSummary(values)
                }

                searchNanoData(criteria)
            }
        });
    }

    getQueryTypeReportSummary(values) {
        const { getFieldValue } = this.props.form

        const { MASTER_REGION_DATA, MASTER_AREA_DATA, MASTER_BRANCH_DATA, MASTER_CALIST_DATA } = this.props.NANO_MASTER_ALL

        const Region = _.isEmpty(values.RegionID) ? [] : values.RegionID.join(',').split(',')
        const Area = _.isEmpty(values.AreaID) ? [] : _.filter(values.AreaID.join(',').split(','), o => o.indexOf('Zone') <= 0)
        const Zone = _.isEmpty(values.AreaID) ? [] : _.filter(values.AreaID.join(',').split(','), o => o.indexOf('Zone') > 0)
        const Branch = _.isEmpty(values.BranchCode) ? [] : _.filter(values.BranchCode.join(',').split(','), o => o.length == 3)
        const KioskBranch = _.isEmpty(values.BranchCode) ? [] : _.filter(values.BranchCode.join(',').split(','), o => o.length > 3)
        const CAName = _.isEmpty(values.CAName) ? [] : values.CAName.join(',').split(',')

        // console.log(Region, Area, Zone, Branch, KioskBranch, CAName)

        // let result = "";

        // if (CAName.length > 0) {
        //     if (CAName.length == 1) {
        //         result = constantQueryType.ca
        //     }
        //     else {
        //         const ca_branch = _.filter(MASTER_CALIST_DATA, o => !_.isEmpty(_.find(CAName, f => f == o.CA_Code)))
        //         const branch = _.filter(MASTER_BRANCH_DATA, o => !_.isEmpty(_.find(ca_branch, { BranchCode: o.OriginBranchCode })))
        //         console.log(branch, ca_branch)
        //         if (Object.keys(_.groupBy(branch, 'OriginBranchCode')).length > 1) {
        //             result = constantQueryType.branch
        //         }
        //         else {
        //             result = constantQueryType.ca
        //         }
        //     }
        // }
        // else if (KioskBranch.length > 0) {
        //     result = constantQueryType.branch_kiosk
        // }
        // else if (Branch.length > 0) {
        //     result = constantQueryType.branch
        // }
        // else if (Zone.length > 0) {
        //     result = constantQueryType.zone
        // }
        // else if (Area.length > 0) {
        //     result = constantQueryType.area
        // }
        // else {
        //     result = constantQueryType.region
        // }

        let result = "";
        if (CAName.length > 0) {
            result = constantQueryType.ca
        }
        else if (Branch.length > 1 && KioskBranch.length > 1) {
            result = constantQueryType.branch_kiosk
        }
        else if (Branch.length >= 2 && Branch.length <= 4) {
            result = constantQueryType.branch
        }
        else if (Area.length == 1 && (Zone.length > 0)) {
            result = constantQueryType.zone
        }
        else {
            result = constantQueryType.area
        }

        return result
    }

    onFilterCollapsedChange = (key) => {
        this.setState({ openFilterCollapsed: key[0] })
    }

    modalComplititorEnable = (e) => {
        this.setState({ visible: true })
    }

    handleOk = (e) => {
        this.setState({ visible: false });
    }

    handleCancel = (e) => {
        const { resetFields } = this.props.form
        resetFields(["ngerdlor", "Muangthai", "Srisawat", "ProvinceComplititor"])
        this.setState({ visible: false });
    }

    ngerdlorClick = e => {
        const { setFieldsValue, getFieldValue } = this.props.form
        setFieldsValue({ ngerdlor: !getFieldValue('ngerdlor') })
    }

    muangthaiClick = e => {
        const { setFieldsValue, getFieldValue } = this.props.form
        setFieldsValue({ Muangthai: !getFieldValue('Muangthai') })
    }

    srisawatClick = e => {
        const { setFieldsValue, getFieldValue } = this.props.form
        setFieldsValue({ Srisawat: !getFieldValue('Srisawat') })
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };

        return (
            <Collapse bordered={true} onChange={this.onFilterCollapsedChange} style={{ zIndex: '3' }} activeKey={this.state.openFilterCollapsed}>
                <Panel
                    key={"1"}
                    header={<div className={styles['panel-header']}><Icon type="filter" />Filter</div>}
                >
                    <Form layout="horizontal" onSubmit={this.onSearch}>
                        <Row gutter={4}>
                            <Col span={12}>
                                <FormItem
                                    label={`Region`}
                                    colon={true}
                                    className={styles['row-label']}
                                    {...formItemLayout}>
                                    {
                                        getFieldDecorator('RegionID', {
                                            initialValue: ['BKK'],
                                            rules: [
                                                { required: true, message: 'Please select region' },
                                            ],
                                        })
                                            (
                                            <TreeSelect
                                                {...tProps}
                                                treeData={this.getRegionSelectItem()}
                                                searchPlaceholder="Please select area" />
                                            )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label={`Area/Zone`}
                                    colon={true}
                                    className={styles['row-label']}
                                    {...formItemLayout}>
                                    {
                                        getFieldDecorator('AreaID')
                                            (
                                            <TreeSelect
                                                {...tProps}
                                                disabled={_.isEmpty(getFieldValue("RegionID"))}
                                                className={styles['select-maxheight']}
                                                treeDefaultExpandAll={true}
                                                treeData={this.getAreaSelectItem()}
                                                searchPlaceholder="Please select area" />
                                            )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={12}>
                                <FormItem
                                    label={`Branch (${this.props.RELATED_BRANCH_DATA.length})`}
                                    colon={true}
                                    className={styles['row-label']}
                                    {...formItemLayout}>
                                    {
                                        getFieldDecorator('BranchCode')
                                            (
                                            <TreeSelect
                                                {...tProps}
                                                disabled={_.isEmpty(getFieldValue("AreaID"))}
                                                treeDefaultExpandAll={true}
                                                treeData={this.getBranchSelectItem()}
                                                dropdownMatchSelectWidth={false}
                                                searchPlaceholder="Please select branch" />
                                            )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={12} >
                                <FormItem
                                    label='BR. Type'
                                    colon={true}
                                    className={styles['row-label']}
                                    {...formItemLayout}>
                                    {
                                        getFieldDecorator('BranchType', {
                                            initialValue: defaultBranchType
                                        })
                                            (
                                            <CheckboxGroup options={BranchTypeOptions} onChange={this.branch_type_change} />
                                            )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={12}>

                                <FormItem
                                    label="CA Name"
                                    colon={true}
                                    className={styles['row-label']}
                                    {...formItemLayout}>
                                    {
                                        getFieldDecorator('CAName')
                                            (
                                            <TreeSelect
                                                {...tProps}
                                                disabled={_.isEmpty(getFieldValue("BranchCode"))}
                                                treeDefaultExpandAll={true}
                                                treeData={this.getCANameSelect()}
                                                dropdownMatchSelectWidth={false}
                                                searchPlaceholder="Search ca name" />
                                            )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label='Options'
                                    colon={true}
                                    className={styles['row-label']}
                                    {...formItemLayout}>
                                    {
                                        getFieldDecorator('MarkerOptions', {
                                            initialValue: defaultShowMarkerOptions
                                        })
                                            (
                                            <CheckboxGroup options={ShowMarkerOptions} style={{ marginRight: '0px' }} />
                                            )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={12}>
                                <FormItem
                                    label="Market Name"
                                    colon={true}
                                    className={styles['row-label']}
                                    {...formItemLayout}>
                                    {
                                        getFieldDecorator('MarketName')
                                            (
                                            <Input disabled={true} />
                                            )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label={(<span></span>)}
                                    colon={false}
                                    className={styles['row-label']}
                                    {...formItemLayout}>
                                    {
                                        getFieldDecorator('IncludeExitingMarket', {
                                            valuePropName: 'checked',
                                            initialValue: true,
                                        })
                                            (
                                            <Checkbox
                                                className={styles['check-box']}
                                                defaultChecked={true}>
                                                Include Branch Market ({_.filter(this.props.RELATED_EXITING_MARKET_DATA, o => o.BranchType != 'K').length})
                                            </Checkbox>
                                            )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>

                        </Row>
                        <Row gutter={8}>

                            <Col span={12}>

                                <Modal className={styles['modalComplititor']}
                                    title="Competitor Location PIN"
                                    visible={this.state.visible}
                                    onOk={false}
                                    onCancel={this.handleCancel}
                                    width="400"
                                    footer={null}
                                >
                                    <article className={styles["complititorContent"]}>

                                        <Row type="flex" gutter={20}>
                                            <Col span={8}>

                                                <img src={ngerntidlor} className={styles['complititorBrand-modal']} onClick={this.ngerdlorClick} />

                                                {
                                                    getFieldDecorator('ngerdlor', {
                                                        valuePropName: 'checked',
                                                        initialValue: false,
                                                    })
                                                        (
                                                        <Checkbox className={styles['check-box']}>เงินติดล้อ ({_.filter(this.props.RELATED_COMPLITITOR_DATA, { TypeCode: '2' }).length})</Checkbox>
                                                        )
                                                }

                                            </Col>
                                            <Col span={8}>

                                                <img src={muangthai} className={styles['complititorBrand-modal']} onClick={this.muangthaiClick} />

                                                {
                                                    getFieldDecorator('Muangthai', {
                                                        valuePropName: 'checked',
                                                        initialValue: false,
                                                    })
                                                        (
                                                        <Checkbox className={styles['check-box']}>เมืองไทย ({_.filter(this.props.RELATED_COMPLITITOR_DATA, { TypeCode: '3' }).length})</Checkbox>
                                                        )
                                                }

                                            </Col>
                                            <Col span={8}>

                                                <img src={srisawat} className={styles['complititorBrand-modal']} onClick={this.srisawatClick} />

                                                {
                                                    getFieldDecorator('Srisawat', {
                                                        valuePropName: 'checked',
                                                        initialValue: false,
                                                    })
                                                        (
                                                        <Checkbox className={styles['check-box']}>ศรีสวัสดิ์ ({_.filter(this.props.RELATED_COMPLITITOR_DATA, { TypeCode: '1' }).length})</Checkbox>
                                                        )
                                                }

                                            </Col>
                                        </Row>
                                        <Row gutter={8} style={{ marginTop: '10px' }}>
                                            <Col span={15}>
                                                {
                                                    getFieldDecorator('ProvinceComplititor', {
                                                        initialValue: []
                                                    })
                                                        (
                                                        <TreeSelect
                                                            {...tProps}
                                                            treeDefaultExpandAll={false}
                                                            dropdownMatchSelectWidth={false}
                                                            treeData={this.getComplititorSelect()}
                                                            searchPlaceholder="กรุณาเลือกจังหวัด"
                                                            style={{ 'width': '100%' }} />
                                                        )
                                                }
                                            </Col>
                                            <Col span={9}>
                                                <Button type="primary" style={{ color: '#FFF', width: '45%', 'float': 'right', 'marginLeft': '4px', 'height': '32px' }} onClick={this.handleOk}>OK</Button>
                                                <Button style={{ color: '#000', width: '45%', 'float': 'right', 'marginLeft': '2px', 'height': '32px' }} onClick={this.handleCancel}>Clear</Button>
                                            </Col>
                                        </Row>
                                    </article>

                                </Modal>
                                <div className={styles['complititor-container']}>
                                    <Tooltip title="Complititor Location">
                                        <img src={pinPicture} className={styles['complititorBrand']} onClick={this.modalComplititorEnable} />
                                    </Tooltip>
                                </div>
                                <FormItem
                                    label={(<span></span>)}
                                    colon={false}
                                    className={styles['row-label']}
                                    {...formItemLayout}>
                                    {
                                        getFieldDecorator('IncludePotentialMarket', {
                                            valuePropName: 'checked',
                                            initialValue: false,
                                        })
                                            (
                                            <Checkbox
                                                className={styles['check-box']}>
                                                Include Potential Mkt ({this.props.RELATED_TARGET_MARKET_DATA.length})
                                            </Checkbox>
                                            )
                                    }
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem
                                    label={(<span></span>)}
                                    colon={false}
                                    className={styles['row-label']}
                                    {...formItemLayout}>
                                    {
                                        getFieldDecorator('IncludeKioskMarket', {
                                            valuePropName: 'checked',
                                            initialValue: true,
                                        })
                                            (
                                            <Checkbox
                                                className={styles['check-box']}>
                                                Include Kiosk Market ({_.filter(this.props.RELATED_EXITING_MARKET_DATA, { BranchType: 'K' }).length})
                                            </Checkbox>
                                            )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={12}>
                                {
                                    getFieldValue("IncludePotentialMarket") &&
                                    <FormItem
                                        label="Province"
                                        colon={true}
                                        className={styles['row-label']}
                                        {...formItemLayout}>
                                        {
                                            getFieldDecorator('Province')
                                                (
                                                <TreeSelect
                                                    {...tProps}
                                                    treeDefaultExpandAll={true}
                                                    treeDefaultExpandedKeys={['all']}
                                                    treeData={this.getProvinceSelect()}
                                                    searchPlaceholder="Search employee name" />
                                                )
                                        }
                                    </FormItem>
                                }
                            </Col>
                            <Col>
                                <Row type="flex" align="middle" gutter={8}>
                                    <Col span={7}></Col>
                                    <Col span={8}>
                                        <Button
                                            disabled={this.props.ON_NANO_SEARCHING_DATA}
                                            style={{ color: '#000', width: '100%', 'height': '32px', 'float': 'right', 'marginTop': '2px', 'fontSize': '1.1em' }}
                                            onClick={this.ClearField}>Clear</Button>
                                    </Col>
                                    <Col span={9}>
                                        <Button
                                            loading={this.props.ON_NANO_SEARCHING_DATA}
                                            style={{ width: '100%', 'height': '32px', 'float': 'right', 'marginTop': '2px', 'fontSize': '1.1em' }}
                                            type="primary"
                                            icon="search"
                                            htmlType="submit">Search</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Panel>
            </Collapse >
        )
    }
}

const FilterForm = Form.create()(Filter)

export default connect(
    (state) => ({
        NANO_MASTER_ALL: state.NANO_MASTER_ALL,
        ON_NANO_SEARCHING_DATA: state.ON_NANO_SEARCHING_DATA,
        RELATED_BRANCH_DATA: state.RELATED_BRANCH_DATA,
        RELATED_EXITING_MARKET_DATA: state.RELATED_EXITING_MARKET_DATA,
        RELATED_TARGET_MARKET_DATA: state.RELATED_TARGET_MARKET_DATA,
        RELATED_COMPLITITOR_DATA: state.RELATED_COMPLITITOR_DATA
    }), {
        searchNanoData: searchNanoData
    })(FilterForm)