import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext, DragSource } from 'react-dnd'
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

class DragMenu extends Component {
    render() {
        const { isDragging, connectDragSource } = this.props
        const opacity = isDragging ? 0.4 : 1
        console.log(this.props)

        return connectDragSource(<span style={{ background: '#2196F3', borderRadius: '5px', margin: '5px', padding: '3px', width: '60px', opacity }}>Menu 1</span>)
    }
}

const boxSource = {
    beginDrag(props) {
        return {
            name: props.name,
        }
    }
}

const DragEvents = DragSource(props => props.type, boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    
}))(DragMenu)

class App extends Component {

    componentWillMount() {
        const { getNanoMasterData, cookies } = this.props

        getNanoMasterData();
    }

    moveEvent = ({ event, start, end, ...custom }) => {
        console.log(event, start, end, ...custom)
    }

    render() {

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '150px' }}>
                    <DragEvents type="event" name="item_1" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                    <div style={{ height: '100%' }}>
                        <Home />
                    </div>
                    <div style={{ flex: '1' }}>
                        <DragAndDropCalendar
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
                            onEventDrop={this.moveEvent}
                            defaultDate={new Date()} />
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

