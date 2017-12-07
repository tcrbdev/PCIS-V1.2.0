import React, { Component } from 'react'

import BigCalendar from 'react-big-calendar'
import { Layout, Menu, Icon, Button } from 'antd'
import FontAwesome from 'react-fontawesome'

import moment from 'moment'
import styles from './index.scss'

BigCalendar.momentLocalizer(moment)

const { Header, Sider, Content } = Layout

const getToolbars = (props) => {

    const { onViewChange, onNavigate, views, ...custom } = props

    return (
        <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
                className="trigger"
                type='menu-fold'
            />
            <Button type="primary" icon="left" onClick={() => onViewChange(views[3])} />
            <Button type="primary" onClick={() => onViewChange(views[3])} ><FontAwesome name="calendar-o" />{(new Date().getDate())}</Button>
            <Button type="primary" icon="right" onClick={() => onViewChange(views[3])} />
        </Header>
    )
}

export default class Index extends Component {

    render() {
        let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])
        return (
            <div style={{ height: '100%' }}>
                <BigCalendar
                    components={{
                        toolbar: getToolbars
                    }}
                    events={[
                        {
                            'title': 'All Day Event very long title',
                            'allDay': true,
                            'start': new Date(),
                            'end': new Date('2017-12-15')
                        },
                        {
                            'title': 'Long Event',
                            'start': new Date(),
                            'end': new Date()
                        }
                    ]}
                    views={allViews}
                    step={60}
                    defaultDate={new Date(2015, 3, 1)} />
            </div>
        )
    }
}

