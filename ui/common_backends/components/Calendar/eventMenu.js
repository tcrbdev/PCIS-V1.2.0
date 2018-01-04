import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'

import { Menu, Icon, Button, Card, Tooltip, List, Divider } from 'antd'

import { setOnDragEventCalendar } from '../../actions/master'

import styles from './index.scss'

class DragMenu extends Component {
    render() {
        const { isDragging, connectDragSource, detail, index } = this.props
        const opacity = isDragging ? 0.4 : 1
        return connectDragSource(
            <div className={styles['wrap-text']} style={{ background: `${this.props.E_Type_BackgroundColor}`, color: `${this.props.E_Type_ForeColor}` }}>
                <Tooltip title={this.props.E_Type_Title} placement="right">
                    <Icon type="tag" style={{ marginRight: '5px' }} />
                    <span>{this.props.E_Type_Title}</span>
                </Tooltip>
            </div>
        )
    }
}

const boxSource = {
    beginDrag(props) {
        const { setOnDragEventCalendar } = props

        setTimeout(() => setOnDragEventCalendar(false))

        return props
    }
}

const DragEvents = DragSource(props => props.type, boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))(DragMenu)

class SideMenu extends Component {

    toggleCollapsed = () => {
        const { setOnDragEventCalendar, IS_DRAG_EVENT_CALENDAR } = this.props

        setOnDragEventCalendar(!IS_DRAG_EVENT_CALENDAR)
    }

    render() {
        const { CALENDAR_MASTER_EVENTS_DATA } = this.props

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {
                    CALENDAR_MASTER_EVENTS_DATA.map((item, index) => {
                        return (
                            <div key={`${item.E_Group_Id}_${index}`}>
                                <span style={{ color: `${item.E_Group_BackgroundColor}`, marginBottom: '5px', display: 'block' }}>{item.E_Group_Description}</span>
                                {
                                    item.E_Events_Item.map((event, event_index) => {
                                        return (
                                            <DragEvents key={`New_Event_${event_index}`} type="new_event" index={event_index} {...event} setOnDragEventCalendar={this.props.setOnDragEventCalendar} />
                                        )
                                    })
                                }
                                <Divider dashed style={{ margin: '12px 0' }} />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default connect(
    (state) => ({
        IS_DRAG_EVENT_CALENDAR: state.IS_DRAG_EVENT_CALENDAR,
        CALENDAR_MASTER_EVENTS_DATA: state.CALENDAR_MASTER_EVENTS_DATA
    }),
    {
        setOnDragEventCalendar: setOnDragEventCalendar
    })(SideMenu)