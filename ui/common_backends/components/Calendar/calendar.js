import React, { Component } from 'react'
import { connect } from 'react-redux'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop/DragableNoBackend'

import { Layout, Menu, Dropdown, Icon, Button, Tooltip, Popover, Popconfirm, Calendar as MiniCalendar, notification, Badge } from 'antd'
import FontAwesome from 'react-fontawesome'
import moment from 'moment'

import CalendarFormEvent from './formEvent'
import CalendarEventMenu from './eventMenu'
import CalendarTrash from './calendarTrash'
import CalendarEventPopInfo from './CalendarEventPopInfo'

const { Header, Sider, Content } = Layout
const SubMenu = Menu.SubMenu

import {
    setOnOpenMainMenu,
    setOnDragEventCalendar,
    getCalendarMasterEvents,
    getCalendarEvent,
    insertCalendarEvent,
    updateCalendarEvent,
    confirmCalendarEvent,
    acknowledgeCalendarEvent
} from '../../actions/master'

import styles from './index.scss'

BigCalendar.momentLocalizer(moment)

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

class Calendar extends Component {

    state = {
        Auth: null,
        defaultView: 'month',
        gotoDate: new Date(),
        formItem: null
    }

    openNotificationWithIcon = (type, title, description) => {
        notification[type]({
            message: title,
            description: description
        });

        if (type != 'error') {
            this.setState({
                formItem: null,
            })
        }
    }

    handleOk = (obj) => {
        const { insertCalendarEvent, updateCalendarEvent, CALENDAR_EVENT_DATA, CALENDAR_EVENT_NON_CONFIRM } = this.props

        if (obj.E_Id) {
            updateCalendarEvent(obj, [CALENDAR_EVENT_DATA, CALENDAR_EVENT_NON_CONFIRM], this.openNotificationWithIcon)
        }
        else {
            insertCalendarEvent(obj, [CALENDAR_EVENT_DATA, CALENDAR_EVENT_NON_CONFIRM], this.openNotificationWithIcon)
        }
    }

    handleCancel = e => this.setState({ formItem: null })

    generateCalendarFormatItem = event => {
        if (event.E_Id) {
            return {
                type: 'event',
                title: `${event.E_Group_Title} ${event.E_Type_Description}`,
                allday: event.E_IsAllDay == 'Y' ? true : false,
                start: event.E_IsAllDay == 'Y' ? moment(moment(event.E_Start).utc().format('YYYY-MM-DD')).toDate() : moment(moment(event.E_Start).utc().format('YYYY-MM-DD HH:mm')).toDate(),
                end: event.E_IsAllDay == 'Y' ? moment(moment(event.E_End).utc().format('YYYY-MM-DD')).toDate() : moment(moment(event.E_End).utc().format('YYYY-MM-DD HH:mm')).toDate(),
                editable: event.E_IsConfirm == 'Y' ? false : true,
                foreColor: event.E_Group_ForeColor,
                backgroundColor: event.E_Group_BackgroundColor,
                ...event
            }
        }
        else {
            return {
                type: 'new_event',
                title: `${event.E_Group_Title} ${event.E_Type_Description}`,
                allday: event.allday,
                start: event.start,
                end: event.start,
                editable: true,
                foreColor: event.E_Group_ForeColor,
                backgroundColor: event.E_Group_BackgroundColor,
                ...event
            }
        }
    }

    calendarEvent = () => {
        const { CALENDAR_EVENT_DATA } = this.props
        if (CALENDAR_EVENT_DATA.length > 0) {
            return CALENDAR_EVENT_DATA.map((event, index) => {
                return this.generateCalendarFormatItem(event)
            })
        }
        else {
            return []
        }
    }

    onEventDrop = (item) => {
        const { event, allday, start, end, ...custom } = item
        console.log(start, end)

        const { updateCalendarEvent, CALENDAR_EVENT_DATA, CALENDAR_EVENT_NON_CONFIRM, AUTH_INFO, EMP_INFO } = this.props

        if (event.type == "new_event") {
            //set end to start beacause year ondrop of event is 2066 not currently year on slot event
            this.setState({
                formItem: this.generateCalendarFormatItem({
                    ...event,
                    allday,
                    start
                })
            })
        }
        else {
            let start_date, end_date
            let canUpdate = false
            let is_allday = 'N'

            if (this.state.defaultView == 'month') {
                if (moment(start).format("YYYY-MM-DD") != moment(event.start).format("YYYY-MM-DD")) {
                    canUpdate = true
                    is_allday = event.allday ? 'Y' : 'N'
                    start_date = moment(start).format("YYYY-MM-DD HH:mm:ss")
                    end_date = moment(start).add(moment(event.end).diff(moment(event.start), 's'), 's').format('YYYY-MM-DD HH:mm:ss')
                }
            }
            else {
                if (allday) {
                    if (event.allday) {
                        if (moment(start).format("YYYY-MM-DD") != moment(event.start).format("YYYY-MM-DD")) {
                            canUpdate = true
                            is_allday = 'Y'
                            start_date = moment(start).format("YYYY-MM-DD HH:mm:ss")
                            end_date = moment(start).add(moment(event.end).diff(moment(event.start), 's'), 's').format('YYYY-MM-DD HH:mm:ss')
                        }
                    }
                    else {
                        if (moment(event.end).toDate().getDate() > moment(event.start).toDate().getDate()) {
                            if (moment(start).format("YYYY-MM-DD") != moment(event.start).format("YYYY-MM-DD")) {
                                canUpdate = true
                                is_allday = 'N'
                                start_date = moment(start).format("YYYY-MM-DD HH:mm:ss")
                                end_date = moment(start).add(moment(event.end).diff(moment(event.start), 's'), 's').format('YYYY-MM-DD HH:mm:ss')
                            }
                        }
                        else {
                            canUpdate = true
                            is_allday = 'Y'
                            start_date = moment(start).format("YYYY-MM-DD")
                            end_date = moment(end).format("YYYY-MM-DD")
                        }
                    }
                }
                else {
                    if (event.allday) {
                        canUpdate = true
                        is_allday = 'N'
                        start_date = moment(start).format("YYYY-MM-DD HH:mm:ss")
                        end_date = moment(start).add(30, 'm').format("YYYY-MM-DD HH:mm:ss")
                    }
                    else {
                        if (moment(start).format("YYYY-MM-DD HH:mm") != moment(event.start).format("YYYY-MM-DD HH:mm")) {
                            canUpdate = true
                            is_allday = 'N'
                            start_date = moment(start).format("YYYY-MM-DD HH:mm:ss")
                            end_date = moment(start).add(moment(event.end).diff(moment(event.start), 's'), 's').format('YYYY-MM-DD HH:mm:ss')
                        }
                    }
                }
            }

            if (canUpdate) {
                updateCalendarEvent({
                    E_Id: event.E_Id,
                    E_Start: start_date,
                    E_End: end_date,
                    E_IsAllDay: is_allday,
                    E_UpdateBy: AUTH_INFO.EmployeeCode
                }, [CALENDAR_EVENT_DATA, CALENDAR_EVENT_NON_CONFIRM], this.openNotificationWithIcon)
            }
        }
    }

    checkHaveEventOnMiniCalendar = value => {
        // const { CALENDAR_EVENT_DATA } = this.props

        // const check = _.filter(CALENDAR_EVENT_DATA, o => {
        //     const event = this.generateCalendarFormatItem(o)
        //     return moment(value.format("YYYY-MM-DD")).isSameOrAfter(moment(event.start).format("YYYY-MM-DD")) && moment(value.format("YYYY-MM-DD")).isSameOrBefore(moment(event.end).format("YYYY-MM-DD"))
        // })

        // if (!_.isEmpty(check)) {
        //     return <Badge status={'success'} />
        // }
    }

    getToolbar = (toolbar, obj) => {
        const { onNavigate, onViewChange, views, label } = toolbar
        const { onDropToTrash, onSelectMiniCalendar, props: { IS_DRAG_EVENT_CALENDAR, setOnDragEventCalendar, getCalendarEvent, AUTH_INFO, EMP_INFO } } = this

        const goToBack = () => {
            if (this.state.defaultView == 'day') {
                toolbar.date.setDate(toolbar.date.getDate() - 1)
            }
            else if (this.state.defaultView == 'week') {
                toolbar.date.setDate(toolbar.date.getDate() - 7)
            }
            else {
                toolbar.date.setMonth(toolbar.date.getMonth() - 1)
            }

            toolbar.onNavigate('PREV');
        }

        const goToNext = () => {
            if (this.state.defaultView == 'day') {
                toolbar.date.setDate(toolbar.date.getDate() + 1)
            }
            else if (this.state.defaultView == 'week') {
                toolbar.date.setDate(toolbar.date.getDate() + 7)
            }
            else {
                toolbar.date.setMonth(toolbar.date.getMonth() + 1)
            }

            toolbar.onNavigate('NEXT');
        }

        const goToCurrent = () => {
            const now = new Date();
            toolbar.date.setDate(now.getDate())
            toolbar.date.setMonth(now.getMonth())
            toolbar.date.setYear(now.getFullYear())

            // toolbar.onNavigate('current');
            toolbar.onNavigate('TODAY');
        }

        const changeView = (view) => {
            this.setState({ defaultView: view })
            onViewChange(view)
        }

        return (
            <Header style={{ background: '#ff5722', width: '100%', height: '45px', lineHeight: '45px', padding: '0 20px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <div className={styles['header-calendar-tool']}>
                        <div onClick={() => goToBack()} ><Tooltip title="Previous"><FontAwesome name="chevron-left" /></Tooltip></div>
                        <div onClick={() => goToCurrent()} >
                            <Popover
                                placement="bottomLeft"
                                content={
                                    <div style={{ width: '290px' }}>
                                        <MiniCalendar
                                            className={styles['have-event-minicalendar']}
                                            fullscreen={false}
                                            onSelect={onSelectMiniCalendar}
                                            dateCellRender={this.checkHaveEventOnMiniCalendar} />
                                    </div>
                                }>
                                <Tooltip title="Today">
                                    <span>
                                        <FontAwesome name="calendar-o" />
                                        <i style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, 0)', paddingTop: '.18em', fontSize: '8px' }}>{moment(new Date()).format("DD")}</i>
                                    </span>
                                </Tooltip>
                            </Popover>
                        </div>
                        <div onClick={() => goToNext()}><Tooltip title="Next"><FontAwesome name="chevron-right" /></Tooltip></div>
                        <div onClick={() => setOnDragEventCalendar(!IS_DRAG_EVENT_CALENDAR)}><Tooltip title="New Event"><FontAwesome name="calendar-plus-o" /></Tooltip></div>
                        <div onClick={() => getCalendarEvent(EMP_INFO)}><Tooltip title="Refresh"><FontAwesome name="refresh" /></Tooltip></div>
                    </div>
                    <div style={{ flex: '1', textAlign: 'center', fontSize: '20px', color: '#FFF' }}>
                        {
                            this.state.defaultView == 'month' &&
                            `${label}`
                        }
                        {
                            this.state.defaultView == 'week' &&
                            `${moment(toolbar.date).format('YYYY')} ${label}`
                        }
                        {
                            this.state.defaultView == 'day' &&
                            `${label} ${moment(toolbar.date).format('YYYY')}`
                        }
                    </div>
                    <div className={styles['header-calendar-tool']}>
                        <CalendarTrash onDrop={this.onDropToTrash} />
                        <div onClick={() => changeView('month')} ><Tooltip title="Month View"><Icon type="table" /></Tooltip></div>
                        <div onClick={() => changeView('week')}><Tooltip title="Week View"><FontAwesome name="th-list" /></Tooltip></div>
                        <div onClick={() => changeView('day')} ><Tooltip title="Day View"><Icon type="pause" /></Tooltip></div>
                        <div onClick={() => changeView('agenda')}><Tooltip title="Agenda View"><Icon type="profile" /></Tooltip></div>
                    </div>
                </div>
            </Header>
        )
    }

    onDropToTrash = (item) => {
        const { updateCalendarEvent, CALENDAR_EVENT_DATA, CALENDAR_EVENT_NON_CONFIRM, AUTH_INFO } = this.props
        updateCalendarEvent({
            E_Id: item.E_Id,
            E_IsDelete: 'Y',
            E_UpdateBy: AUTH_INFO.EmployeeCode
        }, [CALENDAR_EVENT_DATA, CALENDAR_EVENT_NON_CONFIRM], this.openNotificationWithIcon)
    }

    customEvent = (event, start, end, isSelected) => {

        var backgroundColor = event.backgroundColor ? event.backgroundColor : '#ff5722'

        var style = {
            fontSize: '12px',
            borderRadius: '0',
            padding: '0',
            cursor: 'pointer'
        }

        if (this.state.defaultView == 'agenda') {
            style.color = backgroundColor
        }
        else {
            style.backgroundColor = backgroundColor
        }

        return {
            style: style
        }
    }

    eventFormat = (props) => {
        const { event } = props

        return (
            <Popover
                trigger="hover"
                content={<CalendarEventPopInfo event={event} onDelete={this.onDropToTrash} arrowPointAtCenter />}
                mouseEnterDelay={.4}
            >
                <div onClick={() => this.setState({ formItem: event })} style={{ width: '100%', height: '100%', display: 'flex', position: 'relative' }}>
                    {
                        !event.allday && this.state.defaultView != 'agenda' &&
                        < span style={{ background: 'rgba(0,0,0,.7)', padding: '0 3px' }}>{moment(event.start).format("ha")}</span>
                    }
                    {
                        event.E_IsConfirm == 'Y' &&
                        <Icon type="lock" style={{ margin: '0 4px', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                    }
                    <span style={{ marginLeft: '5px', flex: '1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</span>
                </div>
            </Popover>
        )
    }

    componentWillMount() {
        const { getCalendarMasterEvents, getCalendarEvent, AUTH_INFO, EMP_INFO } = this.props

        this.setState({ Auth: EMP_INFO })

        getCalendarMasterEvents(EMP_INFO)
        getCalendarEvent(EMP_INFO, { StartDate: moment(new Date()).add(-1, 'M').startOf('M').format("YYYY-MM-DD"), EndDate: moment(new Date()).add(1, 'M').endOf('M').format("YYYY-MM-DD") })
    }

    componentWillReceiveProps(nextProps) {
        const { getCalendarMasterEvents, getCalendarEvent, AUTH_INFO, EMP_INFO } = nextProps

        if (this.state.Auth != EMP_INFO) {
            this.setState({ Auth: EMP_INFO })

            getCalendarMasterEvents(EMP_INFO)
            getCalendarEvent(EMP_INFO, { StartDate: moment(new Date()).add(-1, 'M').startOf('M').format("YYYY-MM-DD"), EndDate: moment(new Date()).add(1, 'M').endOf('M').format("YYYY-MM-DD") })
        }

    }

    componentWillUpdate() {
        this.createMaskCalendarModalEvent()
    }

    createMaskCalendarModalEvent = () => {
        if (document.getElementById('mask-modal-calendar-event') === null || document.getElementById('mask-modal-calendar-event') === undefined) {
            var divModal = document.createElement("div")
            divModal.id = 'mask-modal-calendar-event'
            document.getElementById('m-calendar').appendChild(divModal)
        }
    }

    onSelectMiniCalendar = (value) => {
        this.setState({ gotoDate: value.toDate() })
    }

    handleNavigate(date, view, action) {
        if (action == "DATE") {
            this.setState({ gotoDate: date })
        }
    }

    eventEndAccessor = event => {
        if (event.allday) {
            if (this.state.defaultView == 'day') {
                return moment(event.end).toDate()
            }
            else {
                if (moment(event.start).format("YYYY-MM-DD") == moment(event.end).format("YYYY-MM-DD")) {
                    return moment(event.end).toDate()
                }
                else if (moment(event.end).toDate().getDay() == 6) {
                    return moment(`${moment(event.end).format("YYYY-MM-DD")} 00:59:00`).toDate()
                }
                else {
                    return moment(event.end).add(1, 'd').toDate()
                }
            }
        }
        else {
            return moment(event.end).toDate()
        }
    }

    render() {
        return (
            <div style={{ position: 'relative', display: 'flex', width: '100%', height: '100%' }}>
                {
                    this.state.formItem &&
                    <CalendarFormEvent
                        formItem={this.state.formItem}
                        onCancel={this.handleCancel}
                        onOk={this.handleOk}
                        onDelete={this.onDropToTrash} />
                }
                < div className={`${styles['event-calendar']} ${this.props.IS_DRAG_EVENT_CALENDAR && styles['event-calendar-open']}`}>
                    <div style={{ textAlign: 'right', fontSize: '16px', fontWeight: 'bold', marginRight: '5px', marginTop: '5px', cursor: 'pointer', color: '#ff5722' }}>
                        <Tooltip title="Close"><Icon type="close" onClick={() => this.props.setOnDragEventCalendar(!this.props.IS_DRAG_EVENT_CALENDAR)} /></Tooltip>
                    </div>
                    {
                        this.props.IS_DRAG_EVENT_CALENDAR &&
                        <div className={styles['custom-scrollbar']} style={{ padding: '5px', overflow: 'auto' }}>
                            <CalendarEventMenu />
                        </div>
                    }
                </div >
                <div ref='calendar_container' style={{ position: 'relative', width: '100%' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '100%' }} className={styles['modal-event-calendar']} id="m-calendar">
                        <div id="mask-modal-calendar-event"></div>
                    </div>
                    <div style={{ width: '100%', height: '100%' }}>
                        <DragAndDropCalendar
                            date={this.state.gotoDate}
                            popup
                            defaultDate={this.state.gotoDate}
                            defaultView={this.state.defaultView}
                            events={this.calendarEvent()}
                            drilldownView="day"
                            onNavigate={(date, view, action) => this.handleNavigate(date, view, action)}
                            onEventDrop={this.onEventDrop}
                            eventPropGetter={this.customEvent}
                            endAccessor={this.eventEndAccessor}
                            components={{
                                event: this.eventFormat.bind(this),
                                toolbar: this.getToolbar.bind(this)
                            }} />
                    </div>
                </div>
            </div >
        )
    }
}

const ContextCalendar = DragDropContext(HTML5Backend)(Calendar)

export default connect(
    (state) => ({
        AUTH_INFO: state.AUTH_INFO,
        EMP_INFO: state.EMP_INFO,
        IS_DRAG_EVENT_CALENDAR: state.IS_DRAG_EVENT_CALENDAR,
        CALENDAR_EVENT_DATA: state.CALENDAR_EVENT_DATA,
        CALENDAR_EVENT_NON_CONFIRM: state.CALENDAR_EVENT_NON_CONFIRM
    }),
    {
        setOnDragEventCalendar: setOnDragEventCalendar,
        getCalendarMasterEvents: getCalendarMasterEvents,
        getCalendarEvent: getCalendarEvent,
        insertCalendarEvent: insertCalendarEvent,
        updateCalendarEvent: updateCalendarEvent,
        confirmCalendarEvent: confirmCalendarEvent,
        acknowledgeCalendarEvent: acknowledgeCalendarEvent
    })(ContextCalendar)