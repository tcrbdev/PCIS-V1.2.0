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
    TreeSelect
} from 'antd';

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

    constructor(props) {
        super(props)

        this.state = {
            MASTER_REGION_DATA: [],
            MASTER_AREA_DATA: [],
            MASTER_BRANCH_DATA: [],
            MASTER_TARGET_MARKET_PROVINCE_DATA: [],
            REGION_ITEM: initMultiSelect,
            AREA_ITEM: initMultiSelect,
            BRANCH_ITEM: initMultiSelect,
            MASTER_TARGET_MARKET_PROVINCE_ITEM: initMultiSelect,
            selectedBranch: 0,
            selectedProvince: 0,
            openFilterCollapsed: "1",
            potentialMarket: false
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
        console.log(branch_type)
        console.log(filter)

        _.mapKeys(_.groupBy(filter, "OriginBranchCode"), (value, key) => {
            let obj = {
                label: _.find(value, o => o.BranchType != "K").BranchName,
                value: value.map(m => m.BranchCode).join(','),
                key: value.map(m => m.BranchCode).join(',')
            }

            if (value.length > 1) {
                obj.children = value.map((item, index) => ({
                    label: item.BranchName,
                    value: item.BranchCode,
                    key: item.BranchCode
                }))
            }

            group.push(obj)
        })


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

    setInitState(nextProps) {
        const {
            MASTER_REGION_DATA,
            MASTER_AREA_DATA,
            MASTER_BRANCH_DATA,
            MASTER_TARGET_MARKET_PROVINCE_DATA } = nextProps

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
                    CAName: !_.isEmpty(values.CAName) ? values.CAName : null,
                    MarketName: !_.isEmpty(values.MarketName) ? values.MarketName : null,
                    IncludeExitingMarket: values.IncludeExitingMarket,
                    IncludeKioskMarket: values.IncludeKioskMarket,
                    IncludePotentialMarket: values.IncludePotentialMarket,
                    Province: !_.isEmpty(values.Province) ? values.Province.join(",") : null,
                    MarkerOptions: !_.isEmpty(values.MarkerOptions) ? values.MarkerOptions : []
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
        console.log(value, arguments)
        // console.log(option, extra)
        if (value.length == 3) {
            const { setFieldsValue, getFieldValue } = this.props.form
            // setFieldsValue({ RegionID: ['East'] })
            // console.log(this.props)
            const kioskBranch = _.filter(this.state.MASTER_BRANCH_DATA, o => o.BranchCode.indexOf(value) >= 0 && o.BranchType == 'K')
            // console.log(kioskBranch.map(m => m.BranchCode))
            // console.log(getFieldValue("BranchCode"))
            // this.setFieldsValue({ BranchCode: ["265274", "265313"] })
        }
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


    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };

        return (
            <Collapse bordered={true} onChange={this.onFilterCollapsedChange} activeKey={this.state.openFilterCollapsed}>
                <Panel
                    key={"1"}
                    header={<div className={styles['panel-header']}><Icon type="filter" />Filter</div>}
                >
                    <Form layout="holizontal" onSubmit={this.onSearch}>
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
                                    label={`Area`}
                                    colon={true}
                                    className={styles['row-label']}
                                    {...formItemLayout}>
                                    {
                                        getFieldDecorator('AreaID')
                                            (
                                            <TreeSelect
                                                {...tProps}
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
                                                onSelect={this.branch_select}
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
                                                treeData={this.state.AREA_ITEM}
                                                onChange={this.area_change}
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
                                            <CheckboxGroup options={ShowMarkerOptions} onChange={this.show_marker_options_change} />
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
                                                Include Exiting Market ({this.props.countExitingMarket})
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
                                                className={styles['check-box']}
                                                onChange={this.potentialMarket_change}>
                                                Include Potential Market ({this.props.countPotentialMarket})
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
                                    <Col span={12}>
                                        <Button
                                            style={{ width: '100%' }}
                                            type="primary"
                                            icon="search"
                                            size='large'
                                            htmlType="submit">Search</Button>
                                    </Col>
                                    <Col span={12}>
                                        <Button
                                            style={{ backgroundColor: '#f04134', color: '#FFF', width: '100%' }}
                                            icon="close"
                                            size='large'
                                            type="danger"
                                            onClick={this.ClearField}>Clear</Button>
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