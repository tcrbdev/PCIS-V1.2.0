import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop/DragableNoBackend'

import { Layout, Menu, Icon, Button } from 'antd'
import FontAwesome from 'react-fontawesome'
import moment from 'moment'

import { getNanoMasterData, setOnDragEventCalendar } from '../../actions/master'

import Home from '../Home'
import styles from './index.scss'

BigCalendar.momentLocalizer(moment)

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

const { Header, Sider, Content } = Layout



class App extends Component {

    state = {
        events: [{
            'title': 'All Day Event very long title',
            'allDay': true,
            'start': new Date(),
            'end': new Date('2017-12-15')
        }, {
            'title': 'Long Event',
            'start': new Date(),
            'end': new Date()
        }]
    }

    componentWillMount() {
        const { getNanoMasterData, cookies } = this.props

        getNanoMasterData();
    }

    onEventDrop = ({ event, start, end, ...custom }) => {
        console.log(event, start, end, ...custom)
        let events = this.state.events
        events.push({
            title: event.title,
            start,
            end
        })

        this.setState({ events })
    }

    getToolbar = (props, obj) => {
        const { onNavigate, onViewChange, views, label } = props

        console.log(views, "---------", label)
        // 0"month" 1"week" 2"work_week" 3"day" 4"agenda"

        return (
            <Header style={{ background: '#EEE', width: '100%' }}>
                <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                />
            </Header>
        )
    }

    render() {

        let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                    <div style={{ height: '100%' }}>
                        <Home />
                    </div>
                    <div style={{ flex: '1' }}>
                        <DragAndDropCalendar
                            popup
                            events={this.state.events}
                            onEventDrop={this.onEventDrop}
                            defaultDate={new Date()}
                            views={allViews}
                            components={{
                                toolbar: this.getToolbar
                            }} />
                        <div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const DragContextCalendar = DragDropContext(HTML5Backend)(App)

const CookiesApp = withCookies(DragContextCalendar)

export default connect(
    (state) => ({
        NANO_MASTER_ALL: state.NANO_MASTER_ALL
    }),
    {
        getNanoMasterData: getNanoMasterData,
        setOnDragEventCalendar: setOnDragEventCalendar
    })(CookiesApp)

