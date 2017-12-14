import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'

import { Menu, Icon, Button } from 'antd'

const SubMenu = Menu.SubMenu

import { setOnDragEventCalendar } from '../../actions/master'

import styles from './index.scss'

class DragMenu extends Component {
    render() {
        const { isDragging, connectDragSource, detail, index } = this.props
        const opacity = isDragging ? 0.4 : 1

        // return connectDragSource(<span style={{ background: '#2196F3', borderRadius: '5px', margin: '5px', padding: '3px', opacity }}>{detail}</span>)
        return connectDragSource(<div><Icon type="pie-chart" /><span>{detail}</span></div>)
    }
}

const boxSource = {
    beginDrag(props) {
        const { setOnDragEventCalendar } = props

        setOnDragEventCalendar(true)

        return props
    }
}

const DragEvents = DragSource(props => props.type, boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),

}))(DragMenu)

class SideMenu extends Component {

    state = {
        collapsed: false,
        menu: [{
            title: 'Menu 1',
            detail: 'text menu 1'
        }, {
            title: 'Menu 2',
            detail: 'text menu 2'
        }, {
            title: 'Menu 3',
            detail: 'text menu 3'
        }, {
            title: 'Menu 4',
            detail: 'text menu 4'
        }, {
            title: 'Menu 5',
            detail: 'text menu 5'
        }, {
            title: 'Menu 6',
            detail: 'text menu 6'
        }]
    }

    toggleCollapsed = () => {
        const { setOnDragEventCalendar, IS_DRAG_EVENT_CALENDAR } = this.props

        setOnDragEventCalendar(!IS_DRAG_EVENT_CALENDAR)
    }

    render() {
        return (
            <div style={{ width: 256 }}>
                <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                    <Icon type={this.props.IS_DRAG_EVENT_CALENDAR ? 'menu-unfold' : 'menu-fold'} />
                </Button>
                <Menu
                    style={{ height: '100%' }}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.props.IS_DRAG_EVENT_CALENDAR}
                >
                    {
                        this.state.menu.map((item, index) => {
                            return <Menu.Item key={`event_${index}`} >
                                <DragEvents type="event" index={index} {...item} setOnDragEventCalendar={this.props.setOnDragEventCalendar} />
                            </Menu.Item>
                        })
                    }
                    <Menu.Item key="1">
                        <Icon type="pie-chart" />
                        <span>Option 1</span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="desktop" />
                        <span>Option 2</span>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Icon type="inbox" />
                        <span>Option 3</span>
                    </Menu.Item>
                    <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
                        <Menu.Item key="5">Option 5</Menu.Item>
                        <Menu.Item key="6">Option 6</Menu.Item>
                        <Menu.Item key="7">Option 7</Menu.Item>
                        <Menu.Item key="8">Option 8</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
                        <Menu.Item key="9">Option 9</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                        <SubMenu key="sub3" title="Submenu">
                            <Menu.Item key="11">Option 11</Menu.Item>
                            <Menu.Item key="12">Option 12</Menu.Item>
                        </SubMenu>
                    </SubMenu>
                </Menu>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        IS_DRAG_EVENT_CALENDAR: state.IS_DRAG_EVENT_CALENDAR
    }),
    {
        setOnDragEventCalendar: setOnDragEventCalendar
    })(SideMenu)