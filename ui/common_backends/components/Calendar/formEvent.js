import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Icon, Button, Modal, Form, Input, Tooltip, Checkbox, DatePicker, TimePicker, Row, Col, Popconfirm, notification } from 'antd'
import FontAwesome from 'react-fontawesome'
import moment from 'moment'
import _ from 'lodash'

import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'

import LocationMap from './locationmap'
import SelectMasterBranch from './selectMasterBranch'

import styles from './index.scss'

const FormItem = Form.Item
const { TextArea } = Input
const { RangePicker } = DatePicker

const refs = {}
const format_time = 'HH:mm'
const format_date = 'DD-MM-YYYY'
const formItemLayout = {
    className: styles['form-label'],
    colon: false,
    labelCol: {
        sm: { span: 7 },
    },
    wrapperCol: {
        sm: { span: 17 },
    },
}
const error = {
    validateStatus: '',
    help: ''
}
const objLocation = {
    type: null,
    code: '',
    text: '',
    lat: null,
    lng: null
}

class CalendarFormEvent extends Component {

    state = {
        googlePlace: null,
        showmap: false,
        isconfirm: false,
        locationMode: 'branch',
        description: '',
        description_error: error,
        location: '',
        location_error: error,
        locationDetail: _.clone(objLocation),
        locationBranchDetail: _.clone(objLocation),
        locationMarketDetail: _.clone(objLocation),
        locationCurrentDetail: _.clone(objLocation),
        locationGoogleDetail: _.clone(objLocation),
        allday: true,
        date: [moment(new Date()), moment(new Date())],
        date_error: error,
        time_error: error,
        time_start: moment('00:00', format_time),
        time_start_error: error,
        time_end: moment('00:00', format_time),
        time_end_error: error,
    }

    componentWillMount() {
        const { formItem } = this.props

        const locationDetail = {
            type: formItem.E_LocationType,
            code: formItem.E_LocationCode,
            text: formItem.E_Location,
            lat: formItem.E_Latitude ? parseFloat(formItem.E_Latitude) : null,
            lng: formItem.E_Longitude ? parseFloat(formItem.E_Longitude) : null
        }

        let init_props = {}, locationMode
        console.log(formItem)
        if (formItem.E_LocationMode) {
            init_props.locationMode = formItem.E_LocationMode
            switch (formItem.E_LocationMode) {
                case 'current':
                    init_props.locationCurrentDetail = locationDetail
                    break;
                case 'google':
                    init_props.locationGoogleDetail = locationDetail
                    break;
                case 'market':
                    init_props.locationMarketDetail = locationDetail
                    break;
                case 'branch':
                    init_props.locationBranchDetail = locationDetail
                    break;
            }
        }

        this.setState({
            location: formItem.E_Location,
            locationDetail,
            ...init_props,
            description: formItem.E_Description,
            date: [moment(formItem.start), moment(formItem.end)],
            time_start: moment(formItem.start, format_time),
            allday: formItem.allday,
            isconfirm: formItem.E_IsConfirm == 'Y' ? true : false,
            time_end: moment(formItem.end, format_time)
        })
    }

    handleSubmit = (e) => {
        if (this.handleValidateForm()) {
            const { formItem, AUTH_INFO, EMP_INFO } = this.props

            const value = {
                E_Id: formItem.E_Id,
                E_EmployeeCode: EMP_INFO.EmployeeCode,
                E_Type_Code: formItem.E_Type_Code,
                E_Title: formItem.title,
                E_Description: this.state.description,
                E_Location: this.state.locationDetail.text,
                E_LocationCode: this.state.locationDetail.code,
                E_LocationMode: this.state.locationMode,
                E_LocationType: this.state.locationDetail.type,
                E_Latitude: this.state.locationDetail.lat,
                E_Longitude: this.state.locationDetail.lng,
                E_Start: this.state.allday ? moment(this.state.date[0].toDate()).format("YYYY-MM-DD") : `${moment(this.state.date[0].toDate()).format("YYYY-MM-DD")} ${this.state.time_start.format("HH:mm")}`,
                E_End: this.state.allday ? moment(this.state.date[1].toDate()).format("YYYY-MM-DD") : `${moment(this.state.date[1].toDate()).format("YYYY-MM-DD")} ${this.state.time_end.format("HH:mm")}`,
                E_IsAllDay: this.state.allday ? 'Y' : 'N',
                E_InviteStatus: null,
                E_InviteBy: null,
                E_CreateBy: AUTH_INFO.EmployeeCode,
                E_InviteCC: null,
                E_UpdateBy: AUTH_INFO.EmployeeCode
            }

            console.log(this.state)
            console.log(value)

            this.props.onOk(value)
        }
    }

    handleValidateForm = () => {

        let description_error = error
        let location_error = error
        let date_error = error
        let time_error = error
        let time_start_error = error
        let time_end_error = error

        if (_.isEmpty(this.state.description) || _.isEmpty(this.state.description.replace(/\s/g, ""))) {
            description_error = {
                validateStatus: 'error',
                help: 'Please input description'
            }
        }
        else if (this.state.description.replace(/\s/g, "").length < 10) {
            description_error = {
                validateStatus: 'error',
                help: 'Must have more than 10 alphabet.'
            }
        }
        else {
            description_error = error
        }

        switch (this.state.locationMode) {
            case 'current':
                if (_.isEmpty(this.state.locationCurrentDetail.text.replace(/\s/g, ""))) {
                    location_error = {
                        validateStatus: 'error',
                        help: 'Please input location'
                    }
                }
                else {
                    location_error = error
                }
                break;
            case 'branch':
                if (_.isEmpty(this.state.locationBranchDetail.text.replace(/\s/g, ""))) {
                    location_error = {
                        validateStatus: 'error',
                        help: 'Please input location'
                    }
                }
                else {
                    location_error = error
                }
                break;
            case 'google':
                if (_.isEmpty(this.state.locationGoogleDetail.text.replace(/\s/g, ""))) {
                    location_error = {
                        validateStatus: 'error',
                        help: 'Please input location'
                    }
                }
                else {
                    location_error = error
                }
                break;
            case 'market':
                if (_.isEmpty(this.state.locationMarketDetail.text.replace(/\s/g, ""))) {
                    location_error = {
                        validateStatus: 'error',
                        help: 'Please input location'
                    }
                }
                else {
                    location_error = error
                }
                break;
        }

        if (!moment(this.state.date[0]).isValid() && !moment(this.state.date[0]).isValid()) {
            date_error = {
                validateStatus: 'error',
                help: 'Please select date'
            }
        }
        else {
            date_error = error
        }

        if (!this.state.allday) {
            if (!moment(this.state.time_start).isValid()) {
                time_start_error = {
                    validateStatus: 'error',
                    help: 'Please select start date'
                }
            }
            else {
                time_start_error = error
            }

            if (!moment(this.state.time_end).isValid()) {
                time_end_error = {
                    validateStatus: 'error',
                    help: 'Please select end date'
                }
            }
            else {
                time_end_error = error
            }

            if (time_start_error.validateStatus == "" && time_end_error.validateStatus == "") {
                const start = moment(`${moment(this.state.date[0].toDate()).format("YYYY-MM-DD")} ${this.state.time_start.format("HH:mm")}`).toDate()
                const end = moment(`${moment(this.state.date[1].toDate()).format("YYYY-MM-DD")} ${this.state.time_end.format("HH:mm")}`).toDate()

                if (start >= end) {
                    time_error = {
                        validateStatus: 'error',
                        help: 'Start date must more than end date'
                    }
                }
                else {
                    time_error = error
                }
            }
        }

        if (this.state.allday) {
            if (description_error.validateStatus != "" || location_error.validateStatus != "" || date_error.validateStatus != "") {
                this.setState({
                    description_error,
                    location_error,
                    date_error,
                    time_start_error,
                    time_end_error,
                    time_error
                })

                if (this.state.showmap) {
                    notification['error']({
                        message: "Input field error",
                        description: (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>Check for more error detail below</span>
                                {
                                    description_error.validateStatus != "" &&
                                    <span><Icon type="close" style={{ color: '#E91E63', marginRight: '5px' }} />{description_error.help}</span>
                                }
                                {
                                    location_error.validateStatus != "" &&
                                    <span><Icon type="close" style={{ color: '#E91E63', marginRight: '5px' }} />{location_error.help}</span>
                                }
                                {
                                    date_error.validateStatus != "" &&
                                    <span><Icon type="close" style={{ color: '#E91E63', marginRight: '5px' }} />{date_error.help}</span>
                                }
                            </div>
                        )
                    })
                }

                return false
            }
            else {
                return true
            }
        }
        else {
            if (description_error.validateStatus != "" || location_error.validateStatus != "" || date_error.validateStatus != "" ||
                time_start_error.validateStatus != "" || time_end_error.validateStatus != "" || time_error.validateStatus != "") {
                this.setState({
                    description_error,
                    location_error,
                    date_error,
                    time_start_error,
                    time_end_error,
                    time_error
                })

                if (this.state.showmap) {
                    notification['error']({
                        message: "Input field error",
                        description: (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>Check for more error detail below</span>
                                {
                                    description_error.validateStatus != "" &&
                                    <span><Icon type="close" style={{ color: '#E91E63', marginRight: '5px' }} />{description_error.help}</span>
                                }
                                {
                                    location_error.validateStatus != "" &&
                                    <span><Icon type="close" style={{ color: '#E91E63', marginRight: '5px' }} />{location_error.help}</span>
                                }
                                {
                                    date_error.validateStatus != "" &&
                                    <span><Icon type="close" style={{ color: '#E91E63', marginRight: '5px' }} />{date_error.help}</span>
                                }
                                {
                                    time_start_error.validateStatus != "" &&
                                    <span><Icon type="close" style={{ color: '#E91E63', marginRight: '5px' }} />{time_start_error.help}</span>
                                }
                                {
                                    time_end_error.validateStatus != "" &&
                                    <span><Icon type="close" style={{ color: '#E91E63', marginRight: '5px' }} />{time_end_error.help}</span>
                                }
                                {
                                    time_error.validateStatus != "" &&
                                    <span><Icon type="close" style={{ color: '#E91E63', marginRight: '5px' }} />{time_error.help}</span>
                                }
                            </div>
                        )
                    })
                }

                return false
            }
            else {
                return true
            }
        }
    }

    onCancel = () => {
        this.props.onCancel()
    }

    onOk = (e) => {
        this.handleSubmit(e)
    }

    onBranchLocationChange = (value, lable, extra) => {
        if (value) {
            const { title, lat, lng, branchType } = extra.triggerNode.props

            const locationBranchDetail = {
                type: branchType,
                code: value,
                text: title,
                lat: lat,
                lng: lng
            }

            this.setState({
                locationBranchDetail,
                locationDetail: locationBranchDetail
            })
        }
        else {
            const locationBranchDetail = _.clone(objLocation)

            this.setState({
                locationBranchDetail,
                locationDetail: locationBranchDetail
            })
        }
    }

    onGoogleLocationChange = (e) => {
        const current_state = _.clone(this.state.locationGoogleDetail)
        current_state.text = e.target.value
        current_state.type = 'place'

        if (e.target.value) {
            this.setState({
                locationDetail: current_state,
                locationGoogleDetail: current_state
            })
        }
        else {
            this.setState({
                locationGoogleDetail: { text: '' },
                locationDetail: { text: '' }
            })
        }
    }

    onGoolgePlacesChanged = () => {
        const place = refs.searchBox.getPlaces()
        if (place.length > 0) {
            const locationGoogleDetail = {
                type: 'google',
                code: '',
                text: refs.searchBox.getPlaces()[0].formatted_address,
                lat: place[0].geometry.location.lat(),
                lng: place[0].geometry.location.lng()
            }

            this.setState({
                locationGoogleDetail,
                locationDetail: locationGoogleDetail
            })
        }
    }

    getLocationModeInput() {
        const { formItem } = this.props

        switch (this.state.locationMode) {
            case 'current':
                return (
                    <Input style={{ backgroundColor: '#FFF' }} disabled value={this.state.locationDetail.text} />
                )
                break;
            case 'branch':
            default:
                return (<SelectMasterBranch onChange={this.onBranchLocationChange} defaultValue={this.state.locationDetail.text} disabled={this.state.isconfirm} />)
                break;
            case 'google':
                return (
                    <StandaloneSearchBox
                        ref={ref => refs.searchBox = ref}
                        onPlacesChanged={this.onGoolgePlacesChanged}>
                        <Input placeholder="Type your location" onChange={this.onGoogleLocationChange} value={this.state.locationDetail.text} disabled={this.state.isconfirm} />
                    </StandaloneSearchBox>
                )
                break;
            case 'market':
                return (
                    <Input placeholder="Type your market" value={this.state.locationDetail.text} disabled />
                )
                break;
        }
    }

    changeLocationMode = (mode) => {
        const { AUTH_INFO, formItem } = this.props

        let set_state = null

        switch (mode) {
            case 'current':
                const locationCurrentDetail = {
                    type: AUTH_INFO.BaseBranchType,
                    code: AUTH_INFO.BaseBranchCode,
                    text: AUTH_INFO.BaseBranchName,
                    lat: parseFloat(AUTH_INFO.BaseBranchLatitude),
                    lng: parseFloat(AUTH_INFO.BaseBranchLongitude)
                }

                set_state = {
                    locationMode: mode,
                    locationCurrentDetail,
                    locationDetail: locationCurrentDetail
                }
                break;
            case 'branch':
                let locationBranchDetail = _.clone(objLocation)

                if (formItem.E_LocationMode == mode) {
                    locationBranchDetail = {
                        type: formItem.E_LocationType,
                        code: formItem.E_LocationCode,
                        text: formItem.E_Location,
                        lat: formItem.E_Latitude,
                        lng: formItem.E_Longitude
                    }
                }

                set_state = {
                    locationMode: mode,
                    locationBranchDetail,
                    locationDetail: locationBranchDetail
                }
                break;
            case 'google':
                let locationGoogleDetail = _.clone(objLocation)

                if (formItem.E_LocationMode == mode) {
                    locationGoogleDetail = {
                        type: 'google',
                        code: '',
                        text: formItem.E_Location,
                        lat: formItem.E_Latitude,
                        lng: formItem.E_Longitude
                    }
                }

                set_state = {
                    locationMode: mode,
                    locationGoogleDetail,
                    locationDetail: locationGoogleDetail
                }
                break;
            case 'market':
                let locationMarketDetail = _.clone(objLocation)

                if (formItem.E_LocationMode == mode) {
                    locationMarketDetail = {
                        type: 'google',
                        code: '',
                        text: formItem.E_Location,
                        lat: formItem.E_Latitude,
                        lng: formItem.E_Longitude
                    }
                }

                set_state = {
                    locationMode: mode,
                    locationMarketDetail,
                    locationDetail: locationMarketDetail
                }
                break;
        }

        this.setState(set_state)
    }

    onMapClick = (locationDetail) => {
        this.setState({
            locationMode: 'google',
            locationGoogleDetail: locationDetail,
            locationDetail
        })
    }

    render() {
        const { formItem, onCancel, onOk, onDelete } = this.props
        console.log(this.state.locationDetail)

        return (
            <div>
                <Modal
                    visible={formItem ? true : false}
                    closable={false}
                    style={{ top: 20 }}
                    wrapClassName={` ${this.state.showmap ? styles['show-map'] : styles['calendar-form-event']} }`}
                    getContainer={() => document.getElementById("mask-modal-calendar-event")}
                    maskClosable={false}
                    mask={true}
                    maskTransitionName="fade"
                    footer={
                        formItem.E_IsConfirm != 'Y' &&
                        <div style={{ display: 'flex', alignItems: 'center', margin: '0 -10px' }}>
                            {
                                formItem.type == 'event' &&
                                <div style={{ flex: '1', textAlign: 'left' }}>
                                    <Popconfirm
                                        title="Are you sure delete this event?"
                                        onConfirm={() => onDelete(formItem)}>
                                        <Tooltip title="Delete Event">
                                            <Button shape="circle" type="danger" icon="delete" ghost disabled={false} />
                                        </Tooltip>
                                    </Popconfirm>
                                </div>
                            }
                            <div style={{ width: '100%', textAlign: 'right' }}>
                                <Tooltip title={`${formItem.type == 'event' ? 'Update' : 'Create'} Event`}>
                                    <Button shape="circle" icon={formItem.type == 'event' ? "edit" : 'save'} type="primary" loading={false} onClick={this.onOk} />
                                </Tooltip>
                            </div>
                        </div>
                    }
                    bodyStyle={{
                        padding: '0'
                    }}
                >
                    <div>
                        <div className={styles['calendar-from-event-header']} style={{ background: `${formItem.backgroundColor}`, color: `${formItem.foreColor}` }}>
                            <Icon type="tag" />
                            <Tooltip title={`${formItem.title}`}><span>{`${formItem.title}`}</span></Tooltip>
                            <Icon onClick={onCancel} type="close" className="close" />
                        </div>
                        <div className={styles['calendar-from-event-body']}>
                            {
                                !this.state.showmap &&
                                <Row>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span><FontAwesome name="align-left" /> Description</span>}
                                        validateStatus={this.state.description_error.validateStatus}
                                        help={this.state.description_error.help}
                                    >
                                        <TextArea size="small"
                                            autosize={{ minRows: 3, maxRows: 4 }}
                                            onChange={(e) => this.setState({ description: e.target.value })}
                                            value={this.state.description}
                                            disabled={this.state.isconfirm} />
                                    </FormItem>
                                </Row>
                            }
                            <Row style={{ marginBottom: '5px', height: '20px' }}>
                                <Col span={this.state.showmap ? 7 : 7} offset={7} className={styles['icon-location']}>

                                    <Tooltip title="Your base location">
                                        {
                                            (this.state.isconfirm) ?
                                                this.state.locationMode == 'current'
                                                    ?
                                                    <FontAwesome name="location-arrow" />
                                                    :
                                                    ''
                                                :
                                                <div onClick={() => this.changeLocationMode('current')} className={this.state.locationMode == 'current' ? 'active' : ''}>
                                                    <FontAwesome name="location-arrow" />
                                                </div>
                                        }
                                    </Tooltip>
                                    <Tooltip title="Branch">
                                        {
                                            (this.state.isconfirm)
                                                ?
                                                this.state.locationMode == 'branch'
                                                    ?
                                                    <FontAwesome name="building" />
                                                    :
                                                    ''
                                                :
                                                <div onClick={() => this.changeLocationMode('branch')} className={this.state.locationMode == 'branch' ? 'active' : ''}>
                                                    <FontAwesome name="building" />
                                                </div>
                                        }
                                    </Tooltip>
                                    <Tooltip title="Search By Google">
                                        {
                                            (this.state.isconfirm)
                                                ?
                                                this.state.locationMode == 'google'
                                                    ?
                                                    <FontAwesome name="search" />
                                                    :
                                                    ''
                                                :
                                                <div onClick={() => this.changeLocationMode('google')} className={this.state.locationMode == 'google' ? 'active' : ''}>
                                                    <FontAwesome name="search" />
                                                </div>
                                        }
                                    </Tooltip>
                                    {/* <Tooltip title="Market">
                                        <div onClick={() => this.changeLocationMode('market')} className={this.state.locationMode == 'market' ? 'active' : ''}>
                                            <FontAwesome name="shopping-basket" />
                                        </div>
                                    </Tooltip> */}
                                </Col>
                                <Col span={this.state.showmap ? 9 : 10} >
                                    {
                                        this.state.locationDetail.lat &&
                                        <Tooltip title={
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>Lat : {this.state.locationDetail.lat}</span>
                                                <span>Lng : {this.state.locationDetail.lng}</span>
                                            </div>
                                        }>
                                            <span className={styles['text-ellipse']} style={{ textAlign: 'right', fontSize: '12px' }}>
                                                {`${this.state.locationDetail.lat} , ${this.state.locationDetail.lng}`}
                                            </span>
                                        </Tooltip>
                                    }
                                </Col>
                                {
                                    this.state.showmap &&
                                    <Col span={1} className={styles['icon-location']} style={{ justifyContent: 'flex-end', alignItems: 'center', cursor: 'pointer' }}>
                                        <Tooltip title="Close Map">
                                            <FontAwesome onClick={() => this.setState({ showmap: !this.state.showmap })} style={{ fontSize: '18px', color: 'red' }} name="angle-double-down" />
                                        </Tooltip>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span><FontAwesome name="map-marker" /> Location</span>}
                                    validateStatus={this.state.location_error.validateStatus}
                                    help={this.state.location_error.help}
                                >
                                    <Col span={this.state.showmap ? 24 : 22}>
                                        {
                                            this.getLocationModeInput()
                                        }
                                    </Col>
                                    {
                                        !this.state.showmap &&
                                        <Col span={2} className={styles['location-map-icon']}>
                                            <Tooltip title="Choose from Map"><FontAwesome onClick={() => this.setState({ showmap: !this.state.showmap })} name="globe" /></Tooltip>
                                        </Col>
                                    }
                                </FormItem>
                            </Row>
                            {
                                this.state.showmap &&
                                <div style={{ width: '100%', height: '400px' }}>
                                    <LocationMap
                                        onClick={this.onMapClick}
                                        locationMode={this.state.locationMode}
                                        locationDetail={this.state.locationDetail}
                                        containerElement={<div style={{ height: `100%` }} />}
                                        mapElement={<div style={{ height: `100%` }} />}
                                        disabled={this.state.isconfirm}
                                    />
                                </div>
                            }
                            {
                                !this.state.showmap &&
                                <Row>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span><FontAwesome name="calendar-check-o" /> Date</span>}
                                        validateStatus={this.state.date_error.validateStatus}
                                        help={this.state.date_error.help}
                                    >
                                        <Col span={18}>
                                            <RangePicker
                                                onChange={(date, date_string) => this.setState({ date: [moment(date_string[0], format_date), moment(date_string[1], format_date)] })}
                                                defaultValue={this.state.date[0].isValid() ? this.state.date : [null, null]}
                                                format={format_date}
                                                style={{ width: '100%' }}
                                                disabled={this.state.isconfirm} />
                                        </Col>

                                        <Col span={6}>
                                            <Checkbox
                                                className={styles['form-check-box']}
                                                defaultChecked={this.state.allday}
                                                onChange={(e) => this.setState({ allday: e.target.checked })}
                                                disabled={this.state.isconfirm} >
                                                <span style={{ fontSize: '11px', color: 'rgba(0,0,0,.6)' }}>All Day</span>
                                            </Checkbox>
                                        </Col>
                                    </FormItem>
                                </Row>
                            }
                            {
                                !this.state.showmap &&
                                !this.state.allday &&
                                <Row style={{ marginBottom: '10px' }}>
                                    <FormItem
                                        {...formItemLayout}
                                        className={`${styles['error-date']} ${styles['form-label']} `}
                                        validateStatus={this.state.time_error.validateStatus}
                                        help={this.state.time_error.help}
                                        label={<span><FontAwesome name="clock-o" /> Time</span>}
                                    >
                                        <Col span={11}>
                                            <FormItem
                                                validateStatus={this.state.time_start_error.validateStatus}
                                                help={this.state.time_start_error.help}
                                            >
                                                <TimePicker
                                                    onChange={(time, timestring) => this.setState({ time_start: moment(timestring, format_time) })}
                                                    defaultValue={this.state.time_start}
                                                    format={format_time}
                                                    style={{ width: '100%' }}
                                                    disabled={this.state.isconfirm} />
                                            </FormItem>
                                        </Col>
                                        <Col span={2}>
                                            <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>-</span>
                                        </Col>
                                        <Col span={11}>
                                            <FormItem
                                                validateStatus={this.state.time_end_error.validateStatus}
                                                help={this.state.time_end_error.help}
                                            >
                                                <TimePicker
                                                    onChange={(time, timestring) => this.setState({ time_end: moment(timestring, format_time) })}
                                                    defaultValue={this.state.time_end}
                                                    format={format_time}
                                                    style={{ width: '100%' }}
                                                    disabled={this.state.isconfirm} />
                                            </FormItem>
                                        </Col>
                                    </FormItem>
                                </Row>
                            }
                        </div>
                    </div>
                </Modal>
            </div >
        )
    }
}

export default connect(
    (state) => ({
        AUTH_INFO: state.AUTH_INFO,
        EMP_INFO: state.EMP_INFO,
        CALENDAR_MASTER_BRANCH_LOCATION_DATA: state.CALENDAR_MASTER_BRANCH_LOCATION_DATA
    }),
    {
    })(CalendarFormEvent)