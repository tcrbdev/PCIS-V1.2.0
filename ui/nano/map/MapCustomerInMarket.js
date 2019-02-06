import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'

import {
    Tooltip,
    Button,
    Tabs,
    Icon,
    Modal,
    Checkbox,
    DatePicker,
    Select,
    TreeSelect,
    Form
} from 'antd';
import FontAwesome from 'react-fontawesome'

import styles from './index.scss'

import { withGoogleMap, GoogleMap, Marker, OverlayView, Circle, InfoWindow } from "react-google-maps";

import _ from 'lodash'

import icon_full_branch from '../../../image/icon_full_branch.png'
import icon_Nano from '../../../image/icon_Nano.png'
import icon_Keyos from '../../../image/icon_Keyos.png'
import icon_Market from '../../../image/icon_Market.png'

import icon_shopYellow from '../../../image/icon_shopYellow.png'
import icon_shopBlue from '../../../image/icon_shopBlue.png'
import icon_shopBrown from '../../../image/icon_shopBrown.png'
import icon_shopGray from '../../../image/icon_shopGray.png'
import icon_shopGreen from '../../../image/icon_shopGreen.png'
import icon_shopGreen_MF from '../../../image/icon_shopGreen_MF.png'
import icon_shopRed from '../../../image/icon_shopRed.png'
import icon_shopOrange from '../../../image/icon_shopOrange.png'
import icon_shopPurple from '../../../image/icon_shopPurple.png'
import icon_Market_Kiosk_2 from '../../../image/icon_Market_Kiosk_2.png'


import { distanceBetweenPoints } from '../map/index'
import CustProfileModal from './custprofile/custprofile_map'


const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Month = [
    { text: 'Jan', value: 1 },
    { text: 'Feb', value: 2 },
    { text: 'Mar', value: 3 },
    { text: 'Apr', value: 4 },
    { text: 'May', value: 5 },
    { text: 'Jun', value: 6 },
    { text: 'Jul', value: 7 },
    { text: 'Aug', value: 8 },
    { text: 'Sep', value: 9 },
    { text: 'Oct', value: 10 },
    { text: 'Nov', value: 11 },
    { text: 'Dec', value: 12 },
]

const getPixelPositionOffset = (width, height) => ({
    x: -(width / 2),
    y: -(height / 2)
})

const CoordinateDistanceMiles = (Latitude1, Longitude1, Latitude2, Longitude2) => {
    if (Latitude1 == Latitude2 && Longitude1 == Longitude2) {
        return 0;
    } else {
        // -- CONSTANTS
        const EarthRadiusInMiles = 3963.1;
        const PI = Math.PI;
        const Kilometers = 1.609344;

        // -- RADIANS conversion
        const lat1Radians = Latitude1 * PI / 180;
        const long1Radians = Longitude1 * PI / 180;
        const lat2Radians = Latitude2 * PI / 180;
        const long2Radians = Longitude2 * PI / 180;

        return (Math.acos(Math.cos(lat1Radians) * Math.cos(long1Radians) * Math.cos(lat2Radians) * Math.cos(long2Radians) + Math.cos(lat1Radians) * Math.sin(long1Radians) * Math.cos(lat2Radians) * Math.sin(long2Radians) + Math.sin(lat1Radians) * Math.sin(lat2Radians)) * EarthRadiusInMiles) * Kilometers;
    }
}

class DragRadius extends Component {
    constructor(props) {
        super(props);

        this.state = {
            const_radius: props.defaultRadius || 2000,
            defalt_lng: null,
            default_radius: props.defaultRadius || 2000,
            ref_circle: null,
            on_drag: false,
            drag_location: null
        }
    }


    onDrag = (e) => {
        const radius = distanceBetweenPoints(this.state.ref_circle.getCenter(), e.latLng) * 1000

        this.setState({ default_radius: radius, on_drag: true, drag_location: e.latLng })
    }

    onDragEnd = (e) => {
        const radius = distanceBetweenPoints(this.state.ref_circle.getCenter(), e.latLng) * 1000

        this.setState({ default_radius: radius, on_drag: false, drag_location: e.latLng })
    }

    restoreToDefault = () => {
        this.setState({ default_radius: this.state.const_radius, on_drag: false })
    }

    componentDidMount() {
        if (!_.isEmpty(this.refs.circle))
            this.setState({ ref_circle: this.refs.circle, defalt_lng: parseFloat(this.refs.circle.getBounds().getNorthEast().lng()) })
    }

    render() {
        const { item, index } = this.props

        return (
            <div>
                {
                    <Circle
                        center={{ lat: parseFloat(item.Latitude || item.BranchLatitude), lng: parseFloat(item.Longitude || item.BranchLongitude) }}
                        radius={this.state.default_radius}
                        ref='circle'
                        options={{
                            strokeColor: this.state.on_drag ? '#656565' : '#F33A00',
                            strokeOpacity: 1,
                            strokeWeight: 2,
                            fillColor: '#656565',
                            fillOpacity: this.state.on_drag ? 0.1 : 0
                        }}>
                    </Circle>
                }
                {
                    this.refs.circle &&
                    <Marker
                        draggable={true}
                        onDrag={this.onDrag}
                        icon={{
                            url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png",
                            size: new google.maps.Size(7, 7),
                            anchor: new google.maps.Point(4, 4)
                        }}
                        title='Resize'
                        position={{
                            lat: this.state.on_drag ? parseFloat(this.state.drag_location.lat()) : parseFloat(item.Latitude),
                            lng: this.state.on_drag ? parseFloat(this.state.drag_location.lng()) : this.state.defalt_lng
                        }}
                        key={`C_${index}`}
                    />
                }
                {
                    this.state.on_drag &&
                    <OverlayView
                        position={{
                            lat: this.state.on_drag ? parseFloat(this.state.drag_location.lat()) : parseFloat(item.BranchLatitude),
                            lng: this.state.on_drag ? parseFloat(this.state.drag_location.lng()) : this.state.defalt_lng
                        }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={getPixelPositionOffset}>
                        <div className={styles['radius-info']} style={{ color: '#5f5f5f' }} >
                            <span>{parseFloat(this.state.default_radius / 1000).toFixed(1)}Km.
                                <Tooltip title="Reset">
                                    <FontAwesome name="refresh" style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={this.restoreToDefault} />
                                </Tooltip>
                            </span>
                        </div>
                    </OverlayView>
                }
            </div>
        )
    }
}

const onDomReady = (color) => {

    let iwOuter = $(".ShopLayoutChild").closest(".gm-style-iw");
    iwOuter.addClass('Custom-Shop-Layout')
    let iwBackground = iwOuter.prev();
    iwBackground.children(':nth-child(2)').css({ 'display': 'none' });
    iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
    iwBackground.children(':nth-child(3)').find('div:first').css({ 'display': 'none' });
    iwBackground.children(':nth-child(3)').find('div').css({ 'top': '25px', 'border-left': `1px solid ${color}`, 'margin-left': '-.15rem' });
    iwBackground.children(':nth-child(3)').find('div').children().css({ 'box-shadow': '0 1px 6px rgba(0, 0, 0, 0.6)', 'z-index': '1', 'top': '0px', 'display': 'none' });

    let iwCloseBtn = iwOuter.next();
    iwCloseBtn.remove()
    iwOuter.css({ opacity: 1 })
}

const onDomMarketReady = () => {
    let iwOuter = $(".ShopMarketLayoutChild").closest(".gm-style-iw");
    iwOuter.addClass(styles['Custom-Market-Layout'])

    let iwBackground = iwOuter.prev();
    iwBackground.children(':nth-child(2)').css({ 'display': 'none' });
    iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
    iwBackground.children(':nth-child(3)').find('div').children().remove();

    let iwCloseBtn = iwOuter.next();
    iwCloseBtn.remove()
    iwOuter.css({ opacity: 1 })
}

class MarkerMarket extends Component {
    state = {
        isHover: false
    }

    onMarkerHover = () => {
        let timeout = 0;

        if (this.state.isHover) {
            timeout = 350;
        }

        setTimeout(() => {
            this.setState({ isHover: !this.state.isHover })
        }, timeout)
    }

    // onMouseOver={this.onMarkerHover}
    // onMouseOut={this.onMarkerHover}>
    render() {
        const { Market, index, ownProps, Type } = this.props

        if (Type == 'B') {
            let icon = icon_full_branch;

            switch (Market.BranchType) {
                case 'K':
                    icon = icon_Keyos
                    break;
                case 'P':
                    icon = icon_Nano
                    break;
            }

            return (
                <Marker
                    key={`${Market.BranchName}`}
                    title={Market.BranchName}
                    zIndex={0}
                    position={{ lat: parseFloat(Market.BranchLatitude), lng: parseFloat(Market.BranchLongitude) }}
                    onClick={this.props.onClick}
                    icon={{
                        url: icon
                    }} />
            )
        }
        else {
            return (
                <Marker
                    key={`${Market.MarketName}`}
                    title={Market.MarketName}
                    zIndex={0}
                    position={{ lat: parseFloat(Market.Latitude), lng: parseFloat(Market.Longitude) }}
                    onClick={this.props.onClick}
                    icon={{
                        url: icon_Market
                    }}
                    onMouseOver={this.onMarkerHover}
                    onMouseOut={this.onMarkerHover}>
                    {
                        this.state.isHover &&
                        <InfoWindow
                            title={Market.MarketName} onDomReady={() => onDomMarketReady()}>
                            <div className={`ShopMarketLayoutChild`} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ width: '100%', height: '100%', overflow: 'auto', padding: '3px', background: 'rgba(0,0,0,.7)' }}>
                                    {/* <Tooltip title="View Layout">
                                        <Button
                                            shape="circle"
                                            icon="eye"
                                            style={{ position: 'absolute', top: '10px', left: '10px' }}
                                            onClick={this.props.onClick} />
                                    </Tooltip> */}
                                    <img style={{ width: '272px', height: '270px' }} src={`http://172.17.9.94/newservices/LBServices.svc/nano/layout/image/${Market.MarketCode}`} />
                                </div>
                            </div>
                        </InfoWindow>
                    }
                </Marker>
            )
        }
    }
}

class MarkerCustomer extends Component {
    state = {
        isHover: false
    }

    onMarkerHover = () => {
        let timeout = 0;

        if (this.state.isHover) {
            timeout = 350;
        }

        setTimeout(() => {
            this.setState({ isHover: !this.state.isHover })
        }, timeout)
    }

    onMarkerClick = () => {
        this.props.onMarkerClick(this.props.cust);
    }

    render() {
        const { cust } = this.props
        const iconProp = checkColor(cust.BGC)


        return (
            <Marker
                key={`${cust.ApplicationNo}`}
                icon={{
                    url: iconProp.icon
                }}
                title={`${cust.MarketName}`}
                position={{
                    lat: parseFloat(cust.cust_Latitude),
                    lng: parseFloat(cust.cust_Longitude)
                }}
                onClick={this.onMarkerClick}
                onMouseOver={this.onMarkerHover}
                onMouseOut={this.onMarkerHover}>
                {
                    this.state.isHover &&
                    <InfoWindow
                        options={{ maxWidth: 40 }}
                        title={cust.MarketName}
                        onDomReady={() => onDomReady(iconProp.color)}>
                        <div className={`ShopLayoutChild`} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: iconProp.color,
                                color: '#FFF',
                                fontSize: '10px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1', width: '100%' }}>{cust.Principle}</div>
                                <div style={{ width: '100%', height: '1px', border: '1px solid #FFF' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1', width: '100%', background: 'rgba(0,0,0,.4)' }}>{cust.StatusDigit}</div>
                            </div>
                        </div>
                    </InfoWindow>
                }
            </Marker>
        )
    }
}

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 4 },
}

class SelectMonth extends Component {
    onMonthChange = (value, from) => {
        const { getFieldValue, setFieldsValue } = this.props.form

        let start = minMonth, end = maxMonth;

        if (from == 1) {
            start = value;
            end = getFieldValue('MonthEnd');

            if (start > end) {
                end = start < maxMonth ? start + 1 : maxMonth;
                setFieldsValue({ MonthEnd: end })
            }
        }
        else {
            start = getFieldValue('MonthStart');
            end = value;

            if (end < start) {
                start = end > minMonth ? end - 1 : minMonth;
                setFieldsValue({ MonthStart: start })
            }
        }

        this.props.onMonthChange(start, end);
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form layout="inline" style={{ display: 'inline-flex', marginRight: '7px' }}>
                <Form.Item label="From" {...formItemLayout}>
                    {
                        getFieldDecorator('MonthStart', { initialValue: minMonth })(

                            <Select size="small" onChange={value => this.onMonthChange(value, 1)} style={{ width: '80px' }}>
                                {
                                    Month.map((item, index) => <Option key={item.value} value={item.value}>{item.text}</Option>)
                                }
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item label="To" {...formItemLayout}>
                    {
                        getFieldDecorator('MonthEnd', { initialValue: maxMonth })(

                            <Select size="small" onChange={value => this.onMonthChange(value, 2)} style={{ width: '80px' }}>
                                {
                                    Month.map((item, index) => <Option key={item.value} value={item.value}>{item.text}</Option>)
                                }
                            </Select>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}

const WrapSelectMonth = Form.create({ name: 'selecte_month' })(SelectMonth)

class HeaderMenu extends Component {
    state = {
        active_sub_menu_ca: false,
        active_sub_menu: false,
        active_menu: false
    }

    getButtonCust = (cust) => {
        let propColor = checkColor(cust.key);

        return (
            <Tooltip placement="top" title={`${cust.title} (${cust.value.length})`}>
                <div
                    className={`${styles['button_cust']} ${_.find(this.props.custFilterSelected, o => o == cust.key) ? styles['button_cust_active'] : ''}`}
                    onClick={() => this.props.onChange(cust.key)}>
                    <img src={propColor.icon} style={{ marginTop: '-15px', width: '100%', zIndex: '2' }} />
                </div>
            </Tooltip>
        )
    }
    getCustYear = () => {
        return defaultSelectYear.map((item, index) => ({
            title: item,
            value: item,
            key: item,
            children: []
        }))
    }

    render() {
        const { Type, Market } = this.props

        return (
            <div className={styles['container_cust']}>
                <div className={`${styles['container_cust_button']} ${this.state.active_menu ? styles['container_cust_button_active'] : ''}`}>
                    <Tooltip placement="top" title={`${this.state.active_menu ? 'Close Menu' : 'Open Menu'}`}>
                        <div className={styles['MenuCustHeader']} onClick={() => this.setState({ active_menu: !this.state.active_menu, active_sub_menu: this.state.active_menu ? false : this.state.active_sub_menu })}>
                            <Icon type="right-circle" />
                        </div>
                    </Tooltip>
                    <Tooltip placement="top" title={`${this.state.active_sub_menu ? 'Close' : 'Open'} By Year & Month`}>
                        <div className={` ${styles['sub_menu']}`} onClick={() => this.setState({ active_sub_menu: !this.state.active_sub_menu, active_sub_menu_ca: false })}>
                            <Icon type="calendar" style={{ color: '#FF5722', fontSize: '20px', zIndex: '2' }} />
                            <Icon className={`sub_active ${this.state.active_sub_menu ? 'sub_is_active' : ''}`} type="caret-down" />
                        </div>
                    </Tooltip>
                    <Tooltip placement="top" title={`${this.state.active_sub_menu_ca ? 'Close' : 'Open'} By CA`}>
                        <div className={` ${styles['sub_menu']}`} onClick={() => this.setState({ active_sub_menu_ca: !this.state.active_sub_menu_ca, active_sub_menu: false })}>
                            <Icon type="usergroup-add" style={{ color: '#2196F3', fontSize: '20px', zIndex: '2' }} />
                            <Icon className={`sub_active ${this.state.active_sub_menu_ca ? 'sub_is_active' : ''}`} type="caret-down" />
                        </div>
                    </Tooltip>
                    <Tooltip placement="top" title={`Show All Market (${this.props.RELATED_EXITING_MARKET_DATA.length})`}>
                        <div className={`${styles['button_cust']} ${_.find(this.props.custFilterSelected, o => o == 'Market') ? styles['button_cust_active'] : ''}`} onClick={() => this.props.onChange('Market')}>
                            <img src={icon_Market} style={{ marginTop: '-1px', width: '20px', height: '27px', zIndex: '2' }} />
                        </div>
                    </Tooltip>
                    {
                        (Type == 'B' && Market.BranchType != 'K') &&
                        <Tooltip placement="top" title="Show All Kiosk">
                            <div className={`${styles['button_cust']} ${_.find(this.props.custFilterSelected, o => o == 'Kiosk') ? styles['button_cust_active'] : ''}`} onClick={() => this.props.onChange('Kiosk')}>
                                <img src={icon_Keyos} style={{ marginTop: '-7px', width: '20px', height: '27px', zIndex: '2' }} />
                            </div>
                        </Tooltip>
                    }
                    {
                        this.props.custGroupColor.map(cust => this.getButtonCust(cust))
                    }
                    <span style={{ margin: '0 7px', background: '#FFF' }}>{`${this.props.custFilter.length} Cust.`}</span>
                </div>
                <div className={`${styles['submenu_item']} ${this.state.active_sub_menu ? styles['submenu_item_active'] : ''}`}>
                    <span>Year</span>
                    <TreeSelect
                        style={{ width: '180px' }}
                        multiple
                        treeCheckable
                        showCheckedStrategy={TreeSelect.SHOW_PARENT}
                        searchPlaceholder={false}
                        treeData={this.getCustYear()}
                        size="small"
                        onChange={this.props.onYearChange}
                        defaultValue={defaultSelectYear} />
                    <WrapSelectMonth onMonthChange={this.props.onMonthChange} />
                </div>
                <div className={`${styles['submenu_item']} ${this.state.active_sub_menu_ca ? styles['submenu_item_active'] : ''}`}>
                    {
                        this.props.caList.map(ca =>
                            <div
                                className={`${styles['ca-selected-img']} ${!_.isEmpty(_.find(this.props.selectedCa, o => o == ca.key)) ? styles['ca-selected-img-active'] : ''}`}
                                onClick={() => this.props.onCaChange(ca.key)}>
                                <img className={styles['ca-small-img']} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${ca.EmpCode}`} />
                                <Icon type="check-circle" />
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

const defaultSelect = ['Blue', 'Green'];
const defaultSelectYear = ['2016', '2017', '2018', '2019'];
const minMonth = 1, maxMonth = 12;

const checkColor = (key) => {
    let prop = {}

    switch (key) {
        case 'Brown':
            prop.seq = 1;
            prop.title = "Pospect Customer";
            prop.color = '#a5673f';
            prop.icon = icon_shopBrown;
            break;
        case 'Blue':
            prop.seq = 2;
            prop.title = "App on hand";
            prop.color = '#1b6eae';
            prop.icon = icon_shopBlue;
            break;
        case 'Yellow':
            prop.seq = 3;
            prop.title = "Cancel & Reject";
            prop.color = '#f0a30a';
            prop.icon = icon_shopYellow;
            break;
        case 'Green':
            prop.seq = 4;
            prop.title = "Current Bucket";
            prop.color = '#008a00';
            // prop.icon = icon_shopGreen;
            prop.icon = icon_shopGreen_MF;
            break;
        case 'Orange':
            prop.seq = 5;
            prop.title = "XDay";
            prop.color = '#ff4500';
            prop.icon = icon_shopOrange;
            break;
        case 'Purple':
            prop.seq = 6;
            prop.title = "M1 + M2";
            prop.color = '#6d04ce';
            prop.icon = icon_shopPurple;
            break;
        case 'Red':
            prop.seq = 7;
            prop.title = "NPL";
            prop.color = '#e20000';
            prop.icon = icon_shopRed;
            break;
        case 'Gray':
            prop.seq = 8;
            prop.title = "End";
            prop.color = '#697e92';
            prop.icon = icon_shopGray;
            break;
    }

    return prop
}

class GMapPath extends Component {

    constructor(props) {
        super(props);
        let custColor = [];
        let caList = [];


        _.mapKeys(_.groupBy(props.Data[0], "BGC"), (value, key) => custColor.push({ ...checkColor(key), key, value }));
        _.mapKeys(_.groupBy(props.Data[0], "EmpCode"), (value, key) => caList.push({ EmpCode: _.replace(key, 'T', ''), key, value }));

        this.state = {
            isShowCustProfile: false,
            custProfileSelected: null,
            isShowAllMarket: false,
            active_sub_menu: false,
            active_menu: false,
            custFilter: _.filter(this.props.Data[0], o => !_.isEmpty(_.find(defaultSelect, c => c == o.BGC))),
            custGroupColor: _.orderBy(custColor, 'seq'),
            custFilterSelected: defaultSelect,
            custFilterYear: defaultSelectYear,
            monthS: minMonth,
            monthE: maxMonth,
            caList,
            selectedCa: [],//caList.map(ca => ca.key)
        }
    }

    getRadiusCircle = () => {
        const circle = [{
            radius: 500,
            options: {
                strokeColor: '#08B21F',
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: '#08B21F',
                fillOpacity: 0.04
            }
        }, {
            radius: 1000,
            options: {
                strokeColor: '#F3CA04',
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: '#F3CA04',
                fillOpacity: 0.04
            }
        }, {
            radius: 2000,
            options: {
                strokeColor: '#F33A00',
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: '#F33A00',
                fillOpacity: 0.04
            }
        }]

        const { Market } = this.props

        const radius = circle.map(c => (
            <Circle
                center={{ lat: parseFloat(Market.Latitude), lng: parseFloat(Market.Longitude) }}
                radius={c.radius}
                options={{ ...c.options }}
            />
        ))

        return radius;
    }

    onCloseCustProfileModal = () => (this.setState({ isShowCustProfile: false, custProfileSelected: null }))

    onMarkerClick = cust => {
        this.setState({ isShowCustProfile: true, custProfileSelected: cust });
    }

    getAllMarketMarker = () => {
        if (_.find(this.state.custFilterSelected, o => o == 'Market')) {
            let filter = _.filter(this.props.RELATED_EXITING_MARKET_DATA, o => o.MarketCode != this.props.Market.MarketCode);

            if (this.state.selectedCa.length > 0) {
                let groupMarketCodeFromCa = []
                _.mapKeys(_.groupBy(this.state.custFilter, "MarketCode"), (value, key) => groupMarketCodeFromCa.push(key));

                filter = _.filter(filter, o => !_.isEmpty(_.find(groupMarketCodeFromCa, c => c == o.MarketCode)));
            }

            return filter.map((item, index) => {
                return (
                    <Marker
                        key={`ExitingMarket_${index}`}
                        title={item.MarketName}
                        zIndex={1}
                        position={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                        icon={{
                            url: item.BranchType == 'K' ? icon_Market_Kiosk_2 : icon_Market
                        }} />
                )
            });
        }
    }

    onCustomerFilterChange = (value) => {
        let selected = [];

        if (!_.find(this.state.custFilterSelected, o => o == value)) {
            selected = [...this.state.custFilterSelected, value];
        }
        else {
            selected = [..._.filter(this.state.custFilterSelected, o => o != value)]
        }

        let custFilter = _.filter(this.props.Data[0], o => !_.isEmpty(_.find(selected, c => c == o.BGC)))

        custFilter = _.filter(custFilter, o => !_.isEmpty(_.find(this.state.custFilterYear, c => c == o.AppInYear)));

        custFilter = _.filter(custFilter, o => parseInt(o.AppInMonthNo) >= this.state.monthS && parseInt(o.AppInMonthNo) <= this.state.monthE);

        if (this.state.selectedCa.length > 0) {
            custFilter = _.filter(custFilter, o => !_.isEmpty(_.find(this.state.selectedCa, c => c == o.EmpCode)));
        }

        this.setState({ custFilterSelected: selected, custFilter })
    }

    onCustomerFilterYearChange = (value) => {

        let custFilterByYear = _.filter(this.props.Data[0], o => !_.isEmpty(_.find(this.state.custFilterSelected, c => c == o.BGC)));

        custFilterByYear = _.filter(custFilterByYear, o => !_.isEmpty(_.find(value, c => c == o.AppInYear)));

        custFilterByYear = _.filter(custFilterByYear, o => parseInt(o.AppInMonthNo) >= this.state.monthS && parseInt(o.AppInMonthNo) <= this.state.monthE);

        if (this.state.selectedCa.length > 0) {
            custFilterByYear = _.filter(custFilterByYear, o => !_.isEmpty(_.find(this.state.selectedCa, c => c == o.EmpCode)));
        }

        this.setState({ custFilterYear: value, custFilter: custFilterByYear });
    }

    onMonthSelectedChange = (start, end) => {
        let custFilterByYear = _.filter(this.props.Data[0], o => !_.isEmpty(_.find(this.state.custFilterSelected, c => c == o.BGC)));

        custFilterByYear = _.filter(custFilterByYear, o => !_.isEmpty(_.find(this.state.custFilterYear, c => c == o.AppInYear)));

        custFilterByYear = _.filter(custFilterByYear, o => parseInt(o.AppInMonthNo) >= start && parseInt(o.AppInMonthNo) <= end);

        if (this.state.selectedCa.length > 0) {
            custFilterByYear = _.filter(custFilterByYear, o => !_.isEmpty(_.find(this.state.selectedCa, c => c == o.EmpCode)));
        }

        this.setState({ monthS: start, monthE: end, custFilter: custFilterByYear });
    }

    onCaChange = EmpCode => {
        let selected = [];

        if (!_.find(this.state.selectedCa, o => o == EmpCode)) {
            selected = [...this.state.selectedCa, EmpCode];
        }
        else {
            selected = [..._.filter(this.state.selectedCa, o => o != EmpCode)]
        }

        let custFilterByCA = _.filter(this.props.Data[0], o => !_.isEmpty(_.find(this.state.custFilterSelected, c => c == o.BGC)));

        custFilterByCA = _.filter(custFilterByCA, o => !_.isEmpty(_.find(this.state.custFilterYear, c => c == o.AppInYear)));

        custFilterByCA = _.filter(custFilterByCA, o => parseInt(o.AppInMonthNo) >= this.state.monthS && parseInt(o.AppInMonthNo) <= this.state.monthE);

        custFilterByCA = _.filter(custFilterByCA, o => !_.isEmpty(_.find(selected, c => c == o.EmpCode)));

        this.setState({ selectedCa: selected, custFilter: custFilterByCA });
    }

    setActiveButton = (setActiveButton) => {
        let checked = _.cloneDeep(this.state.checkedList);

        if (!_.isEmpty(checked, o => o == setActiveButton)) {
            checked = _.remove(checked, o => o == setActiveButton);
        }
        else {
            checked.push(setActiveButton);
        }

        this.setState({ checkedList: checked });
    }

    getHeaderMenu = () => {
        if (process.env.NODE_ENV === 'production') {
            if (this.props.AUTH_NANO_USER.BaseBranchCode == "000") {
                return (<HeaderMenu
                    {...this.props}
                    custFilterSelected={this.state.custFilterSelected}
                    custGroupColor={this.state.custGroupColor}
                    onChange={this.onCustomerFilterChange}
                    onYearChange={this.onCustomerFilterYearChange}
                    custFilter={this.state.custFilter}
                    onMonthChange={this.onMonthSelectedChange}
                    caList={this.state.caList}
                    selectedCa={this.state.selectedCa} />)
            }
        }
        else {
            return (<HeaderMenu
                {...this.props}
                custFilterSelected={this.state.custFilterSelected}
                custGroupColor={this.state.custGroupColor}
                onChange={this.onCustomerFilterChange}
                onYearChange={this.onCustomerFilterYearChange}
                custFilter={this.state.custFilter}
                onMonthChange={this.onMonthSelectedChange}
                caList={this.state.caList}
                selectedCa={this.state.selectedCa}
                onCaChange={this.onCaChange} />)
        }
    }

    render() {
        const { Market, Type } = this.props;

        let centerPosition;

        if (Type == 'B') {
            centerPosition = { lat: parseFloat(Market.BranchLatitude), lng: parseFloat(Market.BranchLongitude) };
        }
        else {
            centerPosition = { lat: parseFloat(Market.Latitude), lng: parseFloat(Market.Longitude) };
        }

        return (
            <div>
                {
                    this.getHeaderMenu()
                }
                {
                    this.state.isShowCustProfile &&
                    <CustProfileModal
                        authen={this.props.AUTH_NANO_USER}
                        visible={this.state.isShowCustProfile}
                        mktCode={this.state.custProfileSelected.MarketCode}
                        appNo={this.state.custProfileSelected.ApplicationNo}
                        CustProfileClose={this.onCloseCustProfileModal}
                    />
                }

                <GoogleMap ref="map" defaultCenter={centerPosition} defaultZoom={14} >
                    <MarkerMarket {...this.props} />
                    {
                        _.find(this.state.custFilterSelected, o => o == 'Kiosk') &&
                        _.filter(this.props.ownProps.RELATED_BRANCH_DATA, { BranchType: 'K' }).map((kisok) => (<MarkerMarket Market={kisok} Type='B' />))
                    }
                    {
                        this.state.custFilter.map((cust, c_index) => (
                            <MarkerCustomer cust={cust} onMarkerClick={this.onMarkerClick} />
                        ))
                    }
                    {
                        this.getRadiusCircle()
                    }
                    {
                        <DragRadius item={Market} index={89898989} />
                    }
                    {
                        this.state.isShowAllMarket &&
                        _.filter(this.props.RELATED_EXITING_MARKET_DATA, o => o.MarketCode != Market.MarketCode).map((market, index) => {
                            return <DragRadius item={market} defaultRadius={50} index={89898990 + index} />
                        })
                    }
                    {
                        this.getAllMarketMarker()
                    }
                </GoogleMap>
            </div>)
    }
}

const MapWithAMarker = withGoogleMap(GMapPath);

class MapCustomerInMarket extends Component {

    state = {
        activeKey: "map",
        isShowLayoutTab: false,
        visible: false
    }

    generateLayoutTab = () => {
        if (this.props.Type != 'B') {
            this.setState({ isShowLayoutTab: true, activeKey: 'layout' })
        }
    }

    closeLayoutTab = () => this.setState({ isShowLayoutTab: false, activeKey: 'map' })

    onChange = (activeKey) => {
        this.setState({ activeKey });
    }

    render() {
        const { Market } = this.props;

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1',
                    width: '100%',
                    height: '500px',
                    overflow: 'hidden'
                }}>
                <Tabs
                    size="small"
                    style={{ height: '100%' }}
                    className={styles['card-container']}
                    activeKey={this.state.activeKey}
                    onChange={this.onChange} >
                    <TabPane tab="Map" key="map" closable={false}>
                        <MapWithAMarker
                            {...this.props}
                            onClick={this.generateLayoutTab}
                            containerElement={< div style={{ width: '100%', height: `100%` }} />}
                            mapElement={< div style={{ width: '100%', height: `100%` }} />} />
                    </TabPane>
                    {
                        this.state.isShowLayoutTab &&
                        <TabPane tab={(<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <span style={{ marginRight: '10px' }}>Layout</span>
                            <Icon onClick={this.closeLayoutTab} type="close" />
                        </div>)}
                            key="layout"
                            closable={true}>
                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                <Button
                                    size="small"
                                    ghost
                                    onClick={() => this.setState({ visible: true })}
                                    style={{ position: 'absolute', top: '5px', right: '5px', padding: '3px', border: '1px solid', color: '#000' }} >
                                    <Icon type="arrows-alt" style={{ fontSize: '18px' }} />
                                </Button>
                                <iframe style={{ width: '100%', height: '100%' }} src={`http://tc001pcis1p/marketlayout?cache=${Date.now()}&marketcode=${Market.MarketCode}&fs=false`} />
                            </div>
                        </TabPane>
                    }
                </Tabs>
                {
                    this.props.Type != 'B' &&
                    <Modal
                        className={styles['modal-full-screen']}
                        visible={this.state.visible}
                        destroyOnClose={true}
                        footer={null}
                        closable={true}
                        onCancel={() => this.setState({ visible: false })}>
                        <div style={{ width: '100%', height: '99.2vh' }}>
                            <iframe style={{ width: '100%', height: '100%' }} src={`http://tc001pcis1p/marketlayout?cache=${Date.now()}&marketcode=${Market.MarketCode}&fs=true&sidebar=true`} />
                        </div>
                    </Modal>
                }
            </div >
        )
    }
}

export default connect((state) => ({
    AUTH_NANO_USER: state.AUTH_NANO_USER,
    RELATED_EXITING_MARKET_DATA: state.RELATED_EXITING_MARKET_DATA
}), {})(MapCustomerInMarket)