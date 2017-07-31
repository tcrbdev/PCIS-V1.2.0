import React, { Component } from 'react'
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

import pinPicture from '../../../../image/target.png'
import muangthai from '../../../../image/muangthai.png'
import srisawat from '../../../../image/srisawat.png'
import ngerntidlor from '../../../../image/ngerntidlor.png'
import styles from './index.scss'

const FormItem = Form.Item
const Panel = Collapse.Panel
const CheckboxGroup = Checkbox.Group
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const initMultiSelect = []

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
    { label: 'Marker', value: 'MR' },
    { label: 'Radius', value: 'RA' },
    // { label: 'Complititor', value: 'COMP' }
];
const defaultShowMarkerOptions = ['MR', 'RA'];

const BranchTypeOptions = [
    { label: 'LB', value: 'L' },
    { label: 'Pure', value: 'P' },
    { label: 'Kiosk', value: 'K' }
];
const defaultBranchType = ['L', 'P', 'K'];

class Filter extends Component {

    constructor(props) {
        super(props)

        this.state = {
            MASTER_REGION_DATA: [],
            MASTER_AREA_DATA: [],
            MASTER_BRANCH_DATA: [],
            MASTER_TARGET_MARKET_PROVINCE_DATA: [],
            MASTER_CALIST_DATA: [],
            MASTER_COMPLITITOR_PROVINCE_DATA: [],
            REGION_ITEM: initMultiSelect,
            AREA_ITEM: initMultiSelect,
            BRANCH_ITEM: initMultiSelect,
            MASTER_TARGET_MARKET_PROVINCE_ITEM: initMultiSelect,
            MASTER_COMPLITITOR_PROVINCE_ITEM: initMultiSelect,
            selectedBranch: 0,
            selectedProvince: 0,
            openFilterCollapsed: "1",
            potentialMarket: false,
            visible: false
        }

    }

    componentWillReceiveProps(nextProps) {
        this.setInitState(nextProps);
    }

    componentDidMount() {
        this.setInitState(this.props)
    }

    getStateRegion(props) {
        const { MASTER_REGION_DATA } = props

        return {
            MASTER_REGION_DATA,
            Default_Region: MASTER_REGION_DATA[0].RegionID,
            Expand_Region: MASTER_REGION_DATA.map(item => item.RegionID).join(','),
            REGION_ITEM: [{
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

    getStateArea(props, region) {
        const { MASTER_AREA_DATA, form: { getFieldValue } } = props

        if (!_.isEmpty(region))
            if (region[0].indexOf(',') >= 0)
                region = region[0].split(',')

        const AREA_DATA =
            _.filter(MASTER_AREA_DATA, (o) => !_.isEmpty(_.find(region, (s) => (s == o.RegionID))))

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

        return {
            MASTER_AREA_DATA,
            Expand_Area: resultGroupBy.map(item => item.AreaID).join(','),
            AREA_ITEM: [{
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

    getStateBranch(props, region, area, branch_type) {
        const { MASTER_BRANCH_DATA, form: { getFieldValue } } = props

        if (!_.isEmpty(region))
            if (region[0].indexOf(',') >= 0)
                region = region[0].split(',')

        if (!_.isEmpty(area))
            if (area[0].indexOf(',') >= 0)
                area = area[0].split(',')

        const filter = _.orderBy(_.filter(MASTER_BRANCH_DATA, o => {
            return !_.isEmpty(_.find(region, (s) => (s == o.RegionID)))
                &&
                !_.isEmpty(_.find(area, (s) => ((o.ZoneValue).indexOf(s) >= 0)))
                &&
                !_.isEmpty(_.find(branch_type, (s) => (s == o.BranchType)))
        }), ['RegionID', 'AreaID', 'ZoneValue', 'BranchType'])

        let group = [];
        const branch = _.filter(filter, o => o.BranchType != 'K')
        const kiosk = _.filter(filter, { BranchType: 'K' })

        if (branch.length > 0) {
            branch.map(item => {
                const obj = _.filter(filter, { OriginBranchCode: item.BranchCode })
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

        return {
            MASTER_BRANCH_DATA,
            Expand_Branch: filter.map(item => item.BranchCode).join(','),
            BRANCH_ITEM: [{
                label: 'Select All',
                value: filter.map(item => item.BranchCode).join(','),
                key: 'all',
                children: group
            }]
        }
    }

    getStateProvince(props, region) {
        const { MASTER_TARGET_MARKET_PROVINCE_DATA } = props

        if (!_.isEmpty(region))
            if (region[0].indexOf(',') >= 0)
                region = region[0].split(',')

        const PROVINCE_DATA =
            _.filter(MASTER_TARGET_MARKET_PROVINCE_DATA, (o) => !_.isEmpty(_.find(region, (s) => (s == o.RegionID))))

        return {
            MASTER_TARGET_MARKET_PROVINCE_DATA,
            Expand_Province: PROVINCE_DATA.map(item => item.ProvinceName).join(','),
            MASTER_TARGET_MARKET_PROVINCE_ITEM: [{
                label: 'Select All',
                value: PROVINCE_DATA.map(item => item.ProvinceName).join(','),
                key: 'all',
                children: PROVINCE_DATA.map((item, index) => {
                    return ({
                        label: item.ProvinceName,
                        value: item.ProvinceName,
                        key: item.ProvinceName
                    })
                })
            }]
        }
    }

    getStateCAList(props) {
        const { MASTER_BRANCH_DATA, MASTER_CALIST_DATA, form: { getFieldValue } } = props
        let master_calist = MASTER_CALIST_DATA[0]

        let branchcode = getFieldValue('BranchCode') || []
        let areacode = getFieldValue('AreaID') || []

        if (!_.isEmpty(branchcode))
            branchcode = branchcode.join(',').split(',')

        if (!_.isEmpty(areacode))
            areacode = areacode.join(',').split(',')

        let CA_DATA = _.filter(MASTER_CALIST_DATA[0], (o) => !_.isEmpty(_.find(branchcode, (s) => (s == o.BranchCode))))

        CA_DATA = (CA_DATA.length > 0) ? CA_DATA : master_calist
        let group = []
        if (branchcode.length > 1 || areacode) {
            _.mapKeys(_.groupBy(CA_DATA, "BranchCode"), (value, key) => {
                let obj = {
                    label: _.isEmpty(_.find(MASTER_BRANCH_DATA, { BranchCode: key })) ? key : _.find(MASTER_BRANCH_DATA, { BranchCode: key }).BranchName,
                    value: value.map(m => m.CA_Code).join(','),
                    key: value.map(m => m.CA_Code).join(',')
                }

                if (value.length > 1) {
                    obj.children = value.map((item, index) => ({
                        label: item.CA_Name,
                        value: item.CA_Code,
                        key: item.CA_Code
                    }))
                }

                group.push(obj)

            })

            return {
                master_calist,
                Expand_CAList: CA_DATA.map(item => item.CA_Code).join(','),
                CA_ITEM: [
                    {
                        label: 'Select All',
                        value: CA_DATA.map(item => item.CA_Code).join(','),
                        key: 'all',
                        children: group
                    }
                ]
            }
        }
        else {
            return {
                master_calist,
                Expand_CAList: CA_DATA.map(item => item.CA_Code).join(','),
                CA_ITEM: [
                    {
                        label: 'Select All',
                        value: CA_DATA.map(item => item.CA_Code).join(','),
                        key: 'all',
                        children: CA_DATA.map((item, index) => {
                            return ({
                                label: item.CA_Name,
                                value: item.CA_Code,
                                key: item.CA_Code
                            })
                        })
                    }
                ]
            }
        }
    }

    getStateComplititorProvince(props, region) {
        const { MASTER_COMPLITITOR_PROVINCE_DATA } = props

        if (!_.isEmpty(region))
            if (region[0].indexOf(',') >= 0)
                region = region[0].split(',')

        const PROVINCE_DATA =
            _.filter(MASTER_COMPLITITOR_PROVINCE_DATA, (o) => !_.isEmpty(_.find(region, (s) => (s == o.RegionCode))))

        let group = []
        _.mapKeys(_.groupBy(MASTER_COMPLITITOR_PROVINCE_DATA, "ProvinceName"), (value, key) => {
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

        return {
            MASTER_COMPLITITOR_PROVINCE_DATA,
            Expand_Complititor_Province: PROVINCE_DATA.map(item => item.District).join(','),
            MASTER_COMPLITITOR_PROVINCE_ITEM: [{
                label: 'Select All',
                value: MASTER_COMPLITITOR_PROVINCE_DATA.map(item => item.District).join(','),
                key: 'all',
                children: group
            }]
        }

        // const { MASTER_COMPLITITOR_PROVINCE_DATA, form: { getFieldValue } } = props

        // let regioncode = getFieldValue('RegionCode') || []

        // if (!_.isEmpty(regioncode))
        //     if (regioncode[0].indexOf(',') >= 0) regioncode = regioncode[0].split(',')

        // let PROVINCE_DATA = _.filter(MASTER_COMPLITITOR_PROVINCE_DATA, (o) => !_.isEmpty(_.find(regioncode, (s) => (s == o.RegionCode))))

        // let group = []
        // console.log(areacode)
        // if (branchcode.length > 1 || areacode.length == 0) {
        //     _.mapKeys(_.groupBy(CA_DATA, "BranchCode"), (value, key) => {
        //         let obj = {
        //             label: _.isEmpty(_.find(MASTER_BRANCH_DATA, { BranchCode: key })) ? key : _.find(MASTER_BRANCH_DATA, { BranchCode: key }).BranchName,
        //             value: value.map(m => m.CA_Code).join(','),
        //             key: value.map(m => m.CA_Code).join(',')
        //         }

        //         if (value.length > 1) {
        //             obj.children = value.map((item, index) => ({
        //                 label: item.CA_Name,
        //                 value: item.CA_Code,
        //                 key: item.CA_Code
        //             }))
        //         }

        //         group.push(obj)

        //     })

        //     return {
        //         master_calist,
        //         Expand_CAList: CA_DATA.map(item => item.CA_Code).join(','),
        //         CA_ITEM: [
        //             {
        //                 label: 'Select All',
        //                 value: CA_DATA.map(item => item.CA_Code).join(','),
        //                 key: 'all',
        //                 children: group
        //             }
        //         ]
        //     }
        // }
        // else {
        //     return {
        //         master_calist,
        //         Expand_CAList: CA_DATA.map(item => item.CA_Code).join(','),
        //         CA_ITEM: [
        //             {
        //                 label: 'Select All',
        //                 value: CA_DATA.map(item => item.CA_Code).join(','),
        //                 key: 'all',
        //                 children: CA_DATA.map((item, index) => {
        //                     return ({
        //                         label: item.CA_Name,
        //                         value: item.CA_Code,
        //                         key: item.CA_Code
        //                     })
        //                 })
        //             }
        //         ]
        //     }
        // }
    }

    setInitState(nextProps) {
        const {
            MASTER_REGION_DATA,
            MASTER_AREA_DATA,
            MASTER_BRANCH_DATA,
            MASTER_CALIST_DATA,
            MASTER_COMPLITITOR_PROVINCE_DATA,
            MASTER_TARGET_MARKET_PROVINCE_DATA
        } = nextProps

        let state = {}

        if (MASTER_REGION_DATA !== this.state.MASTER_REGION_DATA) {
            state = { ...state, ...this.getStateRegion(nextProps) }
        }

        if (MASTER_AREA_DATA !== this.state.MASTER_AREA_DATA) {
            state = { ...state, ...this.getStateArea(nextProps, [state.Default_Region]) }
        }

        if (MASTER_BRANCH_DATA !== this.state.MASTER_BRANCH_DATA) {
            state = { ...state, ...this.getStateBranch(nextProps, [state.Default_Region], null) }
        }

        if (MASTER_TARGET_MARKET_PROVINCE_DATA !== this.state.MASTER_TARGET_MARKET_PROVINCE_DATA) {
            state = { ...state, ...this.getStateProvince(nextProps, [state.Default_Region]) }
        }

        if (MASTER_CALIST_DATA !== this.state.MASTER_CALIST_DATA) {
            state = { ...state, ...this.getStateCAList(nextProps) }
        }

        if (MASTER_COMPLITITOR_PROVINCE_DATA !== this.state.MASTER_COMPLITITOR_PROVINCE_DATA) {
            state = { ...state, ...this.getStateComplititorProvince(nextProps, [state.Default_Region]) }
        }

        this.setState({ ...state })
    }

    ClearField = (e) => {
        const { resetFields } = this.props.form

        resetFields();
    }
    onSearch = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.MarketName != null)
                    values.CAViewMode = true
                else
                    values.CAViewMode = false

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
                    ngerdlor: values.ngerdlor
                }
                this.props.searchHandle(criteria)
            }
        });
    }

    onFilterCollapsedChange = (key) => {
        this.setState({ openFilterCollapsed: key[0] })
    }

    region_change = value => {
        const { getFieldValue } = this.props.form

        this.setState({
            selectedBranch: 0,
            selectedProvince: 0,
            ...this.getStateArea(this.props, value)
            , ...this.getStateBranch(this.props, value, null, getFieldValue('BranchType'))
            , ...this.getStateProvince(this.props, value)
        })
    }

    area_change = value => {
        const { getFieldValue } = this.props.form

        this.setState({
            selectedBranch: 0,
            ...this.getStateBranch(this.props, getFieldValue('RegionID'), value, getFieldValue('BranchType', ))
        })
    }

    branch_select = (value, option, extra) => {
        // console.log(value, arguments)
        // // console.log(option, extra)
        // if (value.length == 3) {
        //     const { setFieldsValue, getFieldValue } = this.props.form
        //     // setFieldsValue({ RegionID: ['East'] })
        //     // console.log(this.props)
        //     const kioskBranch = _.filter(this.state.MASTER_BRANCH_DATA, o => o.BranchCode.indexOf(value) >= 0 && o.BranchType == 'K')
        //     // console.log(kioskBranch.map(m => m.BranchCode))
        //     // console.log(getFieldValue("BranchCode"))
        //     // this.setFieldsValue({ BranchCode: ["265274", "265313"] })
        // }
    }

    branch_change = (value) => {
        if (!_.isEmpty(value))
            if (value[0].indexOf(',') > 0) {
                this.setState({ selectedBranch: value[0].split(',').length })
            }
            else {
                const { setFieldsValue, getFieldValue } = this.props.form
                setFieldsValue({ BranchCode: ["265274", "265313"] })
                this.setState({ selectedBranch: value.length })
            }
        else
            this.setState({ selectedBranch: 0 })
    }

    branch_type_change = (value) => {
        const { getFieldValue } = this.props.form

        this.setState({
            ...this.getStateBranch(this.props, getFieldValue('RegionID'), getFieldValue('AreaID'), value)
        })
    }

    show_marker_options_change = (value) => {

    }

    target_market_change = (value) => {
        if (!_.isEmpty(value))
            if (value[0].indexOf(',') > 0) {
                this.setState({ selectedProvince: value[0].split(',').length })
            }
            else {
                this.setState({ selectedProvince: value.length })
            }
        else
            this.setState({ selectedProvince: 0 })
    }

    potentialMarket_change = () => {
        this.setState({ potentialMarket: !this.state.potentialMarket })
    }

    modalComplititorEnable = (e) => {
        this.setState({ visible: true })
    }

    handleOk = (e) => {
        this.setState({ visible: false });
    }

    handleCancel = (e) => {
        this.setState({ visible: false });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        console.log(this.props.SEARCH_COMPLITITOR_MARKER)

        return (
            <Collapse bordered={true} onChange={this.onFilterCollapsedChange} activeKey={this.state.openFilterCollapsed}>
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
                                            initialValue: [this.state.Default_Region],
                                            rules: [
                                                { required: true, message: 'Please select region' },
                                            ],
                                        })
                                            (
                                            <TreeSelect
                                                {...tProps}
                                                treeDefaultExpandedKeys={this.state.Expand_Region}
                                                treeData={this.state.REGION_ITEM}
                                                onChange={this.region_change}
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
                                                className={styles['select-maxheight']}
                                                treeDefaultExpandAll={true}
                                                treeData={this.state.AREA_ITEM}
                                                onChange={this.area_change}
                                                searchPlaceholder="Please select area" />
                                            )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={12}>
                                <FormItem
                                    label={`Branch (${this.state.selectedBranch}) `}
                                    colon={true}
                                    className={styles['row-label']}
                                    {...formItemLayout}>
                                    {
                                        getFieldDecorator('BranchCode')
                                            (
                                            <TreeSelect
                                                {...tProps}
                                                treeDefaultExpandAll={true}
                                                treeData={this.state.BRANCH_ITEM}
                                                onChange={this.branch_change}
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
                                                treeData={this.state.CA_ITEM}
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
                                            <CheckboxGroup options={ShowMarkerOptions} style={{ marginRight: '0px' }} onChange={this.show_marker_options_change} />
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
                                            <Input />
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
                                                onChange={this.onCheckBoxChange}
                                                defaultChecked={true}>
                                                Include Branch Market ({this.props.countExitingMarket})
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
                                    title="Complititor Location PIN"
                                    visible={this.state.visible}
                                    onOk={false}
                                    onCancel={this.handleCancel}
                                    width="400"
                                    footer={null}
                                >
                                    <article className={styles["complititorContent"]}>

                                        <Row type="flex" gutter={20}>
                                            <Col span={8}>

                                                <img src={ngerntidlor} className={styles['complititorBrand-modal']} />

                                                {
                                                    getFieldDecorator('ngerdlor', {
                                                        valuePropName: 'checked',
                                                        initialValue: false,
                                                    })
                                                        (
                                                        <Checkbox className={styles['check-box']}>เงินติดล้อ ({_.filter(this.props.SEARCH_COMPLITITOR_MARKER, { TypeCode: '2' }).length})</Checkbox>
                                                        )
                                                }

                                            </Col>
                                            <Col span={8}>

                                                <img src={muangthai} className={styles['complititorBrand-modal']} />

                                                {
                                                    getFieldDecorator('Muangthai', {
                                                        valuePropName: 'checked',
                                                        initialValue: false,
                                                    })
                                                        (
                                                        <Checkbox className={styles['check-box']}>เมืองไทย ({_.filter(this.props.SEARCH_COMPLITITOR_MARKER, { TypeCode: '3' }).length})</Checkbox>
                                                        )
                                                }

                                            </Col>
                                            <Col span={8}>

                                                <img src={srisawat} className={styles['complititorBrand-modal']} />

                                                {
                                                    getFieldDecorator('Srisawat', {
                                                        valuePropName: 'checked',
                                                        initialValue: false,
                                                    })
                                                        (
                                                        <Checkbox className={styles['check-box']}>ศรีสวัสดิ์ ({_.filter(this.props.SEARCH_COMPLITITOR_MARKER, { TypeCode: '1' }).length})</Checkbox>
                                                        )
                                                }

                                            </Col>
                                        </Row>
                                        <Row gutter={8} style={{ marginTop: '10px' }}>
                                            <Col span={15}>
                                                {
                                                    getFieldDecorator('ProvinceComplititor')
                                                        (
                                                        <TreeSelect
                                                            {...tProps}
                                                            dropdownMatchSelectWidth={false}
                                                            treeData={this.state.MASTER_COMPLITITOR_PROVINCE_ITEM}
                                                            searchPlaceholder="กรุณาเลือกจังหวัด"
                                                            style={{ 'width': '100%' }} />
                                                        )
                                                }
                                            </Col>
                                            <Col span={9}>
                                                <Button type="primary" style={{ color: '#FFF', width: '45%', 'float': 'right', 'marginLeft': '4px', 'height': '32px' }} onClick={this.handleOk}>OK</Button>
                                                <Button style={{ color: '#000', width: '45%', 'float': 'right', 'marginLeft': '2px', 'height': '32px' }} onClick={this.handleOk}>Clear</Button>
                                            </Col>
                                        </Row>
                                    </article>

                                </Modal>

                                <FormItem
                                    label={(<Tooltip title="Complititor Location">
                                        <img src={pinPicture} className={styles['complititorBrand']} onClick={this.modalComplititorEnable} />
                                    </Tooltip>)}
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
                                                className={styles['check-box']}
                                                onChange={this.potentialMarket_change}>
                                                Include Potential Mkt ({this.props.countPotentialMarket})
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
                                                className={styles['check-box']}
                                                onChange={this.onCheckBoxChange}>
                                                Include Kiosk Market ({this.props.countKioskMarket})
                                            </Checkbox>
                                            )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={12}>
                                {
                                    this.state.potentialMarket &&
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
                                                    treeDefaultExpandedKeys={['all']}
                                                    treeData={this.state.MASTER_TARGET_MARKET_PROVINCE_ITEM}
                                                    onChange={this.target_market_change}
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
                                            style={{ color: '#000', width: '100%', 'height': '32px', 'float': 'right', 'marginTop': '2px', 'fontSize': '1.1em' }}
                                            onClick={this.ClearField}>Clear</Button>
                                    </Col>
                                    <Col span={9}>
                                        <Button
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

export default Form.create()(Filter)