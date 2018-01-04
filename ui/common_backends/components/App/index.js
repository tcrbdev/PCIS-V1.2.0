import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext, DropTarget } from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop/DragableNoBackend'

import { Layout, Breadcrumb, Menu, Dropdown, Badge, Avatar, Icon, Button, Tooltip, Popover, Modal, Calendar as MiniCalendar, Popconfirm } from 'antd'
import FontAwesome from 'react-fontawesome'
import moment from 'moment'

import logo from '../../../../image/logo.png'

import {
    setOnOpenMainMenu
} from '../../actions/master'

import CalendarApp from '../Calendar'
import styles from './index.scss'

const { Header, Sider, Content } = Layout
const SubMenu = Menu.SubMenu

const app_style = {
    Header: {
        background: '#fff',
        padding: 0,
        // height: '45px',
        // lineHeight: '45px',
        zIndex: '1',
        boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'
    }
}

class App extends Component {

    openMenu = () => {
        this.props.setOnOpenMainMenu(!this.props.IS_OPEN_MAIN_MENU)
    }

    render() {

        const menu = (
            <Menu>
                <Menu.Item disabled>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '0 12px', cursor: 'pointer', width: '150px' }}>
                        <Avatar src="http://172.17.9.94/newservices/LBServices.svc/employee/image/58385" style={{ marginRight: '5px' }} size="large" />
                        <div style={{ display: 'flex', flexDirection: 'column', color: 'rgba(39, 39, 39, 0.7)', fontSize: '12px' }}>
                            <span style={{ whiteSpace: 'nowrap' }}>Janewit .L</span>
                            <span style={{ whiteSpace: 'nowrap' }}>Work Period 2.1.3</span>
                        </div>
                    </div>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="0"><Icon type="user" style={{ marginRight: '5px' }} />Profile</Menu.Item>
                <Menu.Item key="1"> <Icon type="setting" style={{ marginRight: '5px' }} />Setting</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3"><Icon type="logout" style={{ marginRight: '5px', color: '#b1023e' }} />Sign out</Menu.Item>
            </Menu>
        )

        return (
            <Layout style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Header style={{ ...app_style.Header }} >
                    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                        <div style={{ width: '80px', background: '#043ba3', height: 'inherit', fontSize: '32px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className={styles['logo']}>
                                <img src={logo} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flex: '1', alignItems: 'center', padding: '0 10px' }}>
                            <Breadcrumb>
                                <Breadcrumb.Item href="">
                                    <Icon type="home" />
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="">
                                    <Icon type="calendar" />
                                    <span>Calendar</span>
                                </Breadcrumb.Item>
                                {/* <Breadcrumb.Item>
                                    <Icon type="schedule" />
                                    <span>Management</span>
                                </Breadcrumb.Item> */}
                            </Breadcrumb>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', borderLeft: '1px solid #EEE', padding: '0 10px' }}>
                            <div style={{ margin: '0 12px', cursor: 'pointer' }}><Tooltip title="Chat"><Badge count={0}><Icon type="message" style={{ fontSize: '18px', padding: '4px', marginTop: '3px' }} /></Badge></Tooltip></div>
                            <div style={{ margin: '0 12px', cursor: 'pointer' }}><Tooltip title="Notification"><Badge count={0}><Icon type="bell" style={{ fontSize: '18px', padding: '4px', marginTop: '3px' }} /></Badge></Tooltip></div>
                            <Dropdown
                                placement="bottomRight"
                                overlay={menu}>
                                <div style={{ display: 'flex', justifyContent: 'center', margin: '0 12px', cursor: 'pointer' }}>
                                    <Avatar src="http://172.17.9.94/newservices/LBServices.svc/employee/image/58385" style={{ marginTop: '16px', marginRight: '5px' }} />
                                    <span style={{ whiteSpace: 'nowrap' }}>Janewit .L</span>
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </Header>
                <Layout style={{ display: 'flex', flex: '1', flexDirection: 'row', height: '100%' }}>
                    <Menu
                        style={{ height: '100%', boxShadow: '2px 0 6px rgba(0, 21, 41, 0.35)' }}
                        mode="inline"
                        theme="dark"
                        inlineCollapsed={true}
                    >
                        {/* <Menu.Item key="1">
                            <Icon type="pie-chart" />
                            <span>Dashboard</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="desktop" />
                            <span>Application</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="inbox" />
                            <span>Files</span>
                        </Menu.Item> */}
                        <SubMenu key="calendar" title={
                            <span style={{ position: 'relative' }}>
                                <FontAwesome name="calendar-o" style={{ fontSize: '16px', paddingLeft: '1px' }} />
                                <i style={{ position: 'absolute', left: '54%', transform: 'translate(-50%, 0)', paddingTop: '1px', fontSize: '8px' }}>{moment(new Date()).format("DD")}</i>
                            </span>
                        }>
                            <Menu.Item key="calendar_5"><span><Icon type="dashboard" /><span>Dashboard</span></span></Menu.Item>
                            <Menu.Item key="calendar_6"><span><Icon type="schedule" /><span>Management</span></span></Menu.Item>
                        </SubMenu>
                        {/* <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
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
                        </SubMenu> */}
                    </Menu>
                    <Content style={{ margin: '0 16px' }}>
                        <CalendarApp />
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

const CookiesApp = withCookies(App)

export default connect(
    (state) => ({
        IS_OPEN_MAIN_MENU: state.IS_OPEN_MAIN_MENU
    }),
    {
        setOnOpenMainMenu: setOnOpenMainMenu
    })(CookiesApp)

