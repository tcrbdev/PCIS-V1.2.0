import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie';

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
import moment from 'moment'

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
    { label: 'Radius', value: 'RA' },
    { label: 'KPI', value: 'SBVOL', disabled: true }
];
const defaultShowMarkerOptions = ['MR', 'RA'];

const BranchTypeOptions = [
    { Group: 'Current', label: 'LB', value: 'L' },
    { Group: 'Current', label: 'Pure', value: 'P' },
    { Group: 'Current', label: 'Kiosk', value: 'K' },
    //{ Group: 'Plan Branch', label: 'LB', value: '_L' },
    { Group: 'New Branch', label: 'Pure', value: '_P' },
    { Group: 'New Branch', label: 'Kiosk', value: '_K' }
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
                children: _.orderBy(MASTER_REGION_DATA, ['RegionID'], ['asc']).map((item, index) => {
                    return ({
                        label: item.RegionID,
                        value: `${item.RegionID}`,
                        key: `${item.RegionID}`
                    })
                })
            }]
        }
    }

    getBranchTypeSelectItem() {
        let resultGroupBy = []
        _.mapKeys(_.groupBy(BranchTypeOptions, 'Group'), (value, key) => {
            if (key == 'Current') {
                value.map((item, index) => {
                    resultGroupBy.push({
                        label: item.label,
                        value: item.value,
                        key: item.value,
                    })
                })
            }
            else {
                resultGroupBy.push({
                    label: key,
                    value: value.map(item => item.value).join(','),
                    key: value.map(item => item.value).join(','),
                    children: value.map((item, index) => ({
                        label: item.label,
                        value: item.value,
                        key: item.value
                    }))
                })
            }
        })

        return [{
            label: 'Select All',
            value: resultGroupBy.map(item => item.value).join(','),
            key: 'all',
            children: resultGroupBy
        }]
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
                value: _.uniq(CALIST_DATA.map(item => item.CA_Code)).join(','),
                key: _.uniq(CALIST_DATA.map(item => item.CA_Code)).join(','),
                children: group
            }]
        }
    }

    getProvinceSelect() {
        const { NANO_MASTER_ALL: { MASTER_TARGET_MARKET_PROVINCE_DATA }, form: { getFieldValue } } = this.props

        if (!_.isEmpty(MASTER_TARGET_MARKET_PROVINCE_DATA)) {

            const region_select = getFieldValue("RegionID") && getFieldValue("RegionID").join(',').split(',')

            const PROVINCE_DATA = _.filter(MASTER_TARGET_MARKET_PROVINCE_DATA, (o) => !_.isEmpty(_.find(region_select, (s) => (s == o.Region))))

            const haveDistrict = _.filter(PROVINCE_DATA, o => !_.isEmpty(o.Amphor))
            const notHaveDistrict = _.filter(PROVINCE_DATA, o => _.isEmpty(o.Amphor))

            let result = []

            _.mapKeys(_.groupBy(PROVINCE_DATA, "Province"), (value, key) => {

                let group = {
                    label: key,
                    value: value.map(o => o.PotentialMarketCode).join(","),
                    key: value.map(o => o.PotentialMarketCode).join(","),
                    children: []
                }

                let amphor_group = []

                _.mapKeys(_.groupBy(value, "Amphor"), (a_value, a_key) => {
                    let a_group = {
                        label: a_key,
                        value: a_value.map(o => o.PotentialMarketCode).join(","),
                        key: a_value.map(o => o.PotentialMarketCode).join(",")
                    }
                    amphor_group.push(a_group)
                })

                group.children = amphor_group

                result.push(group)
            })

            // _.forEach(notHaveDistrict, (item, key) => {
            //     result.push({
            //         label: item.Province,
            //         value: item.Province,
            //         key: item.Province
            //     })
            // })

            return [{
                label: 'Select All',
                value: [..._.uniqBy(PROVINCE_DATA, "PotentialMarketCode").map(item => item.PotentialMarketCode)].join(','),
                key: [..._.uniqBy(PROVINCE_DATA, "PotentialMarketCode").map(item => item.PotentialMarketCode)].join(','),
                children: _.orderBy(result, 'key', 'asc')
            }]

            // const PROVINCE_DATA = _.filter(MASTER_TARGET_MARKET_PROVINCE_DATA, (o) => !_.isEmpty(_.find(region_select, (s) => (s == o.RegionID))))

            // const haveDistrict = _.filter(PROVINCE_DATA, o => !_.isEmpty(o.District))
            // const notHaveDistrict = _.filter(PROVINCE_DATA, o => _.isEmpty(o.District))

            // let result = []

            // _.mapKeys(_.groupBy(haveDistrict, "ProvinceName"), (value, key) => {
            //     let group = {
            //         label: key,
            //         value: key,
            //         key: key,
            //         children: value.map(m => ({
            //             label: m.District,
            //             value: m.District,
            //             key: m.District
            //         }))
            //     }

            //     result.push(group)
            // })

            // _.forEach(notHaveDistrict, (item, key) => {
            //     result.push({
            //         label: item.ProvinceName,
            //         value: item.ProvinceName,
            //         key: item.ProvinceName
            //     })
            // })

            // return [{
            //     label: 'Select All',
            //     value: [...haveDistrict.map(item => item.District), ..._.uniqBy(PROVINCE_DATA, "ProvinceName").map(item => item.ProvinceName)].join(','),
            //     key: [...haveDistrict.map(item => item.District), ..._.uniqBy(PROVINCE_DATA, "ProvinceName").map(item => item.ProvinceName)].join(','),
            //     children: _.orderBy(result, 'key', 'asc')
            // }]
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
        const { searchNanoData, cookies } = this.props

        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {

                const auth = cookies.get('authen_info')

                this.setState({ openFilterCollapsed: null })

                const criteria = {
                    RegionID: !_.isEmpty(values.RegionID) ? values.RegionID.join(',') : null,
                    AreaID: !_.isEmpty(values.AreaID) ? _.uniq(values.AreaID.join(",").split(',').map(i => i.indexOf('-') > 0 ? i.substring(0, i.indexOf('-')) : i)).join(',') : null,
                    Zone: !_.isEmpty(values.AreaID) ? values.AreaID.join(",") : null,
                    BranchCode: !_.isEmpty(values.BranchCode) ? values.BranchCode.join(',') : null,
                    BranchType: !_.isEmpty(values.BranchType) ? values.BranchType.join(',') : null,
                    CAName: !_.isEmpty(values.CAName) ? values.CAName.join(',') : null,
                    CAID: !_.isEmpty(values.CAName) ? values.CAName.join(',') : null,
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

                if (process.env.NODE_ENV === 'production') {
                    criteria.EmpCode = auth.Session.sess_empcode
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

        console.log(Region, Area, Zone, Branch, KioskBranch, CAName)

        let result = "";

        if (Region.length > 1) {
            result = constantQueryType.region
        }

        if (Area.length >= 1) {
            result = constantQueryType.area
        }

        if (Zone.length > 0) {
            result = constantQueryType.zone
        }

        if (Branch.length > 0) {
            result = constantQueryType.branch
        }

        if (KioskBranch.length > 0) {
            result = constantQueryType.branch_kiosk
        }

        if (CAName.length > 0) {
            result = constantQueryType.ca
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

    // Dropdown Handle: state refernace
    onRegionExpand = (e) => {
        _.delay(() => {
            let cls = (e) ? e : styles['region_field']
            const elements = $(`.tool_${cls}`)

            if ($(elements).length > 0) { }
            else {
                $(`.${cls}`).click().after(() => {
                    _.delay(() => {
                        $('body').find('.ant-select-dropdown').first().parent().parent().addClass(`tool_${cls}`).after(() => { $(`.${cls}`).click() })
                    }, 200)
                })
            }

        }, 200)

    }

    onExpand = (e) => {
        _.delay(() => {
            const cls_base = styles['area_field']
            const elements = $(`.tool_${cls_base}`)
            let cls = (e) ? e : cls_base

            if ($(elements).length > 0) {
                const parent_target = $('body').find(`.tool_${cls_base}`)
                let el_target = $(parent_target).find('span.ant-select-tree-switcher')[0]
                if ($(el_target).hasClass('ant-select-tree-switcher_close')) {
                    $(el_target).click()
                }

            } else {

                $(`.${cls}`).click().after(() => {
                    _.delay(() => {
                        const el_parent = $('body').find('.ant-select-dropdown').parent().parent()
                        let el_escape = $(el_parent).not('div[class^="tool_"]')
                        if (!$(el_escape[0]).attr('class')) {
                            $(el_escape[0]).addClass(`tool_${cls}`).after(() => { $(`.${cls}`).click() })
                        }
                    }, 200)

                    $(`.${cls}`).bind('click', () => { this.onExpand(cls_base) })

                })
            }
        }, 200)
    }

    onBrExpand = (e) => {
        _.delay(() => {
            const cls_base = styles['branch_field']
            $(`.${cls_base}`).after(() => {
                const el_parent = $('body').find('.ant-select-dropdown').parent().parent()
                let el_escape = $(el_parent).not('div[class^="tool_"]')
                if (!$(el_escape[0]).attr('class')) {
                    $(el_escape[0]).addClass(`tool_${cls_base}`).after(() => {
                        const selector = $(el_escape[0]).find('span.ant-select-tree-switcher')
                        if ($(selector).hasClass('ant-select-tree-switcher_close')) {
                            $(selector).click()
                        }

                    })
                }
            })
        }, 200)
    }

    onCAExpand = () => {
        _.delay(() => {
            const cls_base = styles['calist_field']
            $(`.${cls_base}`).after(() => {
                const el_parent = $('body').find('.ant-select-dropdown').parent().parent()
                let el_escape = $(el_parent).not('div[class^="tool_"]')
                if (!$(el_escape[0]).attr('class')) {
                    $(el_escape[0]).addClass(`tool_${cls_base}`).after(() => {
                        const selector = $(el_escape[0]).find('span.ant-select-tree-switcher')
                        if ($(selector).hasClass('ant-select-tree-switcher_close')) {
                            $(selector).click()
                        }

                    })
                }
            })
        }, 200)
    }

    onProvinceExpand = (e) => {
        _.delay(() => {
            const cls_base = styles['province_field']
            $(`.${cls_base}`).after(() => {
                const el_parent = $('body').find('.ant-select-dropdown').parent().parent()
                let el_escape = $(el_parent).not('div[class^="tool_"]')
                if (!$(el_escape[0]).attr('class')) {
                    $(el_escape[0]).addClass(`tool_${cls_base}`).after(() => {
                        const selector = $(el_escape[0]).find('span.ant-select-tree-switcher')
                        if ($(selector).hasClass('ant-select-tree-switcher_close')) {
                            $(selector).click()
                        }

                    })
                }
            })
        }, 200)
    }

    onCompetitorExpand = (e) => {
        _.delay(() => {
            const cls_base = styles['competitor_field']
            $(`.${cls_base}`).after(() => {
                const el_parent = $('body').find('.ant-select-dropdown').parent().parent()
                let el_escape = $(el_parent).not('div[class^="tool_"]')
                if (!$(el_escape[0]).attr('class')) {
                    $(el_escape[0]).addClass(`tool_${cls_base}`).after(() => {
                        const selector = $(el_escape[0]).find('span.ant-select-tree-switcher')
                        if ($(selector).hasClass('ant-select-tree-switcher_close')) {
                            $(selector).click()
                        }

                    })
                }
            })
        }, 200)
    }

    in_array = (needle, haystack, argStrict) => {
        var key = '', strict = !!argStrict;
        if (strict) {
            for (key in haystack) {
                if (haystack[key] === needle) {
                    return true
                }
            }
        } else {
            for (key in haystack) {
                if (haystack[key] == needle) {
                    return true
                }
            }
        }

        return false

    }

    componentDidMount() {
        // STACK EVENT
        $(`span.${styles['region_field']}`).parent().bind('click', (e) => { this.onRegionExpand.bind(this) })

    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { MASTER_ASOF_DATA } = this.props.NANO_MASTER_ALL
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };

        const { cookies, AUTH_NANO_USER } = this.props
        const authen_info = cookies.get('authen_info')
        const AuthList = ['57251', '56225', '58141', '56679', '58106', '58385', '59016', '57568', '59440', '57160', '57249']

        let auth_pass = false
        if (process.env.NODE_ENV === 'production') {
            if (!_.isEmpty(AUTH_NANO_USER)) {
                if (!_.isEmpty(_.find(AuthList, o => o == AUTH_NANO_USER.Session.sess_empcode))) {
                    auth_pass = true
                    ShowMarkerOptions[2].disabled = !auth_pass
                }
            }
        }
        else {
            auth_pass = true
            ShowMarkerOptions[2].disabled = !auth_pass
        }

        return (
            <Collapse bordered={true} onChange={this.onFilterCollapsedChange} style={{ zIndex: '3' }} activeKey={this.state.openFilterCollapsed}>
                <Panel
                    key={"1"}
                    header={
                        <div className={styles['panel-header']}><Icon type="filter" />Filter
                            <span className={styles['as-of-date']}>Data as of {!_.isEmpty(MASTER_ASOF_DATA) ? moment(MASTER_ASOF_DATA[0].ImportDate).format('DD-MMM-YY') : ''}</span>
                        </div>}
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
                                                className={styles['region_field']}
                                                treeData={this.getRegionSelectItem()}
                                                searchPlaceholder="Please select area"
                                                onClick={this.onRegionExpand(styles['region_field'])}
                                            />
                                            )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <article id="area_field">
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
                                                    className={`${styles['area_field']} ${styles['select-maxheight']}`}
                                                    treeData={this.getAreaSelectItem()}
                                                    autoExpandParent={true}
                                                    searchPlaceholder="Please select area"
                                                    onClick={this.onExpand(styles['area_field'])}
                                                />
                                                )
                                        }
                                    </FormItem>
                                </article>
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
                                                className={styles['branch_field']}
                                                disabled={_.isEmpty(getFieldValue("AreaID"))}
                                                treeDefaultExpandAll={false}
                                                treeData={this.getBranchSelectItem()}
                                                dropdownMatchSelectWidth={false}
                                                onClick={this.onBrExpand}
                                                searchPlaceholder="Please select branch"
                                            />
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
                                            <TreeSelect
                                                {...tProps}
                                                className={`${styles['branch_type_field']} ${styles['select-maxheight']}`}
                                                treeData={this.getBranchTypeSelectItem()}
                                                autoExpandParent={true}
                                                searchPlaceholder="Please select branch type"
                                                onClick={this.onExpand(styles['branch_type_field'])}
                                            />
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
                                                className={styles['calist_field']}
                                                disabled={_.isEmpty(getFieldValue("BranchCode"))}
                                                treeDefaultExpandAll={false}
                                                treeData={this.getCANameSelect()}
                                                dropdownMatchSelectWidth={false}
                                                onClick={this.onCAExpand}
                                                searchPlaceholder="Search ca name"
                                            />
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
                                            initialValue: false,
                                        })
                                            (
                                            <Checkbox
                                                className={styles['check-box']}>
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
                                                            className={styles['competitor_field']}
                                                            treeDefaultExpandAll={false}
                                                            dropdownMatchSelectWidth={false}
                                                            treeData={this.getComplititorSelect()}
                                                            searchPlaceholder="กรุณาเลือกจังหวัด"
                                                            style={{ 'width': '100%' }}
                                                            onClick={this.onCompetitorExpand} />
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
                                            <Checkbox className={styles['check-box']}>
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
                                            initialValue: false,
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
                                                    className={styles['province_field']}
                                                    treeDefaultExpandAll={true}
                                                    treeDefaultExpandedKeys={['all']}
                                                    treeData={this.getProvinceSelect()}
                                                    searchPlaceholder="Search employee name"
                                                    onClick={this.onProvinceExpand} />
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
                                            className={styles['searchCriteria']}
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

const CookiesFilterForm = withCookies(FilterForm)

export default connect(
    (state) => ({
        AUTH_NANO_USER: state.AUTH_NANO_USER,
        NANO_MASTER_ALL: state.NANO_MASTER_ALL,
        NANO_VISIT_POPUP_INFO: state.NANO_VISIT_POPUP_INFO,
        ON_NANO_SEARCHING_DATA: state.ON_NANO_SEARCHING_DATA,
        RELATED_BRANCH_DATA: state.RELATED_BRANCH_DATA,
        RELATED_EXITING_MARKET_DATA: state.RELATED_EXITING_MARKET_DATA,
        RELATED_TARGET_MARKET_DATA: state.RELATED_TARGET_MARKET_DATA,
        RELATED_COMPLITITOR_DATA: state.RELATED_COMPLITITOR_DATA
    }), {
        searchNanoData: searchNanoData
    })(CookiesFilterForm)