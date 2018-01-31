import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'

import { Avatar, Tooltip, Badge, Popover, Button, Timeline, Icon, Popconfirm, notification } from 'antd'
import FontAwesome from 'react-fontawesome'
import Scrollbar from 'react-smooth-scrollbar'
import moment from 'moment'
import _ from 'lodash'

import UserRootTree from '../UserRootTree'

import {
    setEmployeeInformation,
    updateCalendarEvent
} from '../../actions/master'

import Calendar from './calendar'

import styles from './index.scss'

class CalendarApp extends Component {

    state = {
        MenuOpen: false
    }

    changeEmpInfo = (item) => {
        const { setEmployeeInformation } = this.props
        setEmployeeInformation({
            RoleId: '6',
            EmployeeCode: item.EmployeeCode,
            EmpName_TH: item.FullNameEng,
            StartWork: item.WorkingYMD,
            Department: item.Department
        })
    }

    changeOwner = () => {
        // const { setEmployeeInformation, AUTH_INFO } = this.props

        // setEmployeeInformation(AUTH_INFO)
    }

    openNotificationWithIcon = (type, title, description) => {
        notification[type]({
            message: title,
            description: description
        });
    }

    getPopconfirmFormatDate = (event) => {
        let date = ""
        if (event.E_IsAllDay == 'Y') {
            if (moment(event.E_Start).format("DD/MM/YYYY") == moment(event.E_End).format("DD/MM/YYYY")) {
                date = `${moment(event.E_Start).format("DD/MM/YYYY")}`
            }
            else {
                date = `${moment(event.E_Start).format("DD/MM/YYYY")} - ${moment(event.E_End).format("DD/MM/YYYY")}`
            }
        }
        else {
            if (moment(event.E_Start).format("DD/MM/YYYY") == moment(event.E_End).format("DD/MM/YYYY")) {
                date = `${moment(event.E_Start).utc().format("ha")} - ${moment(event.E_End).utc().format("ha")} ${moment(event.E_Start).format("DD/MM/YYYY")}`
            }
            else {
                date = `${moment(event.E_Start).format("DD/MM/YYYY")} ${moment(event.E_Start).utc().format("ha")} - ${moment(event.E_End).format("DD/MM/YYYY")} ${moment(event.E_End).utc().format("ha")}`
            }
        }

        return (
            <span><FontAwesome name="calendar-check-o" style={{ width: '15px', color: '#795548', marginRight: '5px' }} />{date}</span>
        )
    }

    getPopConfirmTimelineItem = () => {
        const { CALENDAR_EVENT_NON_CONFIRM, CALENDAR_EVENT_DATA, AUTH_INFO, EMP_INFO } = this.props

        let event = []

        _.mapKeys(_.groupBy(CALENDAR_EVENT_NON_CONFIRM, o => moment(o.E_Start).format("DD-MM-YYYY")), (value, key) => {
            event.push({
                key,
                date: value[0].E_Start,
                event: value
            })
        })

        return _.orderBy(event, 'date', 'asc').map((key_Date, index) => {
            return <Timeline.Item
                key={`PopConfirm_${key_Date.key}`}
                dot={
                    <div>
                        <Icon type="clock-circle-o" style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.5)', fontWeight: 'bold' }} />
                        <span className="popconfirm-group-date">{moment(key_Date.date).format("ddd MMM DD YYYY")}</span>
                    </div>
                }>
                {
                    key_Date.event.map((item, item_index) => {
                        return (
                            <div key={`TimeLineItem_${item_index}`}>
                                <Tooltip title={item.E_Title}><span style={{ fontSize: '14px', color: item.E_Group_BackgroundColor }}>{item.E_Title}</span></Tooltip>
                                <Tooltip title={item.E_Description}><span><FontAwesome name="align-left" style={{ width: '15px', color: '#795548', marginRight: '5px' }} />{item.E_Description}</span></Tooltip>
                                <Tooltip title={item.E_Location}><span><FontAwesome name="map-marker" style={{ width: '15px', color: '#795548', marginRight: '5px' }} />{item.E_Location}</span></Tooltip>
                                {
                                    this.getPopconfirmFormatDate(item)
                                }
                                {
                                    AUTH_INFO.EmployeeCode == EMP_INFO.EmployeeCode &&
                                    <div >
                                        <Tooltip title="Confirm" onClick={() => this.props.updateCalendarEvent({
                                            E_Id: item.E_Id,
                                            E_IsConfirm: 'Y',
                                            E_UpdateBy: AUTH_INFO.EmployeeCode
                                        }, [CALENDAR_EVENT_DATA, CALENDAR_EVENT_NON_CONFIRM], this.openNotificationWithIcon)}>
                                            <Icon type="check" />
                                        </Tooltip>
                                        <Popconfirm
                                            title="Are you sure delete this event?"
                                            onConfirm={() => this.props.updateCalendarEvent({
                                                E_Id: item.E_Id,
                                                E_IsDelete: 'Y',
                                                E_UpdateBy: AUTH_INFO.EmployeeCode
                                            }, [CALENDAR_EVENT_DATA, CALENDAR_EVENT_NON_CONFIRM], this.openNotificationWithIcon)}>
                                            <Tooltip title="Delete"><Icon type="delete" /></Tooltip>
                                        </Popconfirm>
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </Timeline.Item>
        })
    }

    openMenu = () => {
        this.setState({ MenuOpen: true })
    }

    onBackUp = (item, level) => {
        console.log(item, level)
    }

    onDrillDown = (item, level) => {
        console.log(item, level)
    }

    onSelect = (item, level) => {

        this.setState({ MenuOpen: false })

        setTimeout(() => {
            this.changeEmpInfo(item)
        }, 350)

    }

    render() {
        const { AUTH_INFO, EMP_INFO } = this.props

        return (
            <div style={{ height: '100%', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', background: '#FFF', marginLeft: '-16px', marginRight: '-16px', padding: '13px 13px 0 16px', borderBottom: '1px solid #e8e8e8' }}>
                    <div className={styles['calendar-profile-header']}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${EMP_INFO.EmployeeCode}`} style={{ marginRight: '5px' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2em' }}>
                                <span onClick={this.changeOwner} style={{ whiteSpace: 'nowrap' }}>{EMP_INFO.EmpName_TH}</span>
                                <span style={{ whiteSpace: 'nowrap', fontSize: '11px', color: '#a2a2a2' }}>Work Period {EMP_INFO.StartWork}</span>
                            </div>
                        </div>
                        <div>
                            <Tooltip title="Team member"><Badge><FontAwesome name="sitemap" onClick={this.openMenu} /></Badge></Tooltip>
                            <Tooltip title="Confirm Events">
                                <Popover
                                    placement="bottomLeft"
                                    content={
                                        <div style={{ minHeight: '100px', maxHeight: '400px', width: '400px', margin: '-12px -16px' }}>
                                            {
                                                this.props.CALENDAR_EVENT_NON_CONFIRM.length > 0 ?
                                                    <Scrollbar style={{ height: '100%', maxHeight: '400px', padding: '16px' }}>
                                                        <Timeline className={styles['confirm-timeline-event']}>
                                                            {
                                                                this.getPopConfirmTimelineItem()
                                                            }
                                                            <Timeline.Item dot={<Icon type="calendar" style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.5)', fontWeight: 'bold' }} />}></Timeline.Item>
                                                        </Timeline>
                                                    </Scrollbar>
                                                    :
                                                    <div className={styles['not-confirm-event-data']}><Icon type="calendar" />Not Event to confirm.</div>
                                            }
                                        </div>
                                    }
                                    title={<div style={{ color: '#757575', fontSize: '15px' }}>
                                        <FontAwesome name="calendar-check-o" style={{ marginRight: '5px', color: '#8BC34A' }} />Alert Confirm Events
                                        </div>}
                                    trigger="click">
                                    <Badge count={this.props.CALENDAR_EVENT_NON_CONFIRM.length} style={{ marginTop: '-5px', marginLeft: '3px' }} ><FontAwesome name="calendar-check-o" /></Badge>
                                </Popover>
                            </Tooltip>
                            <Tooltip title="Acknowledge Events">
                                <Popover
                                    placement="bottomLeft"
                                    content={
                                        <div style={{ minHeight: '100px', maxHeight: '400px', width: '400px', margin: '-12px -16px' }}>
                                            <div className={styles['not-confirm-event-data']}><Icon type="calendar" />No Acknowledge events.</div>
                                        </div>
                                    }
                                    title={<div style={{ color: '#757575', fontSize: '15px' }}>
                                        <FontAwesome name="exclamation-circle" style={{ marginRight: '5px', color: '#8BC34A' }} />Alert Acknowledge Events
                                        </div>}
                                    trigger="click">
                                    <Badge count={0} style={{ marginTop: '-5px', marginLeft: '3px' }} ><FontAwesome name="exclamation-circle" /></Badge>
                                </Popover>
                            </Tooltip>
                        </div>
                        <div style={{ flex: '1' }}>
                        </div>
                    </div>
                </div>
                <div style={{ background: '#FFF', marginTop: '16px', height: '88.5%', position: 'relative' }}>
                    {
                        this.props.IS_LOAD_CALENDAR_EVENT &&
                        <span
                            style={{ position: 'absolute', background: 'rgba(0,0,0,.4)', width: '100%', height: '100%', zIndex: 5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name="refresh" style={{ marginTop: '-10%', color: '#FFF' }} size='5x' spin />
                        </span>
                    }
                    <Calendar />
                </div>
                {
                    ((AUTH_INFO.Department || '').toLowerCase() == 'lending' || (AUTH_INFO.Department || '').toLowerCase() == 'bkk') &&
                    <UserRootTree
                        isOpen={this.state.MenuOpen}
                        closeSideMenu={() => this.setState({ MenuOpen: false })}
                        onSelect={this.onSelect}
                        onDrillDown={this.onDrillDown}
                        onBackUp={this.onBackUp} />
                }
            </div >
        )
    }
}

const CookiesCalendarApp = withCookies(CalendarApp)

export default connect(
    (state) => ({
        AUTH_INFO: state.AUTH_INFO,
        EMP_INFO: state.EMP_INFO,
        CALENDAR_EVENT_DATA: state.CALENDAR_EVENT_DATA,
        CALENDAR_EVENT_NON_CONFIRM: state.CALENDAR_EVENT_NON_CONFIRM,
        IS_LOAD_CALENDAR_EVENT: state.IS_LOAD_CALENDAR_EVENT
    }),
    {
        setEmployeeInformation: setEmployeeInformation,
        updateCalendarEvent: updateCalendarEvent
    })(CookiesCalendarApp)
