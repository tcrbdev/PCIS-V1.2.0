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
    authenticate,
    setAuthentication,
    setOnOpenMainMenu,
    getOrganizationTem
} from '../../actions/master'

import CalendarApp from '../Calendar'
import OrgChart from '../OrgChart'
import styles from './index.scss'

const { Header, Sider, Content } = Layout
const SubMenu = Menu.SubMenu

const app_style = {
    Header: {
        background: '#fff',
        padding: 0,
        // height: '45px',
        // lineHeight: '45px',
        zIndex: '6',
        boxShadow: '0 0 4px 2px rgba(0,0,0,.14)'
    }
}

class App extends Component {

    componentWillMount() {
        this.initData();

        // Set Title
        $('title').text('Calendar')
    }

    initData() {
        const { setAuthentication, getOrganizationTem, cookies } = this.props
        if (process.env.NODE_ENV === 'production') {

            console.log("Cookie : ", cookies.get('authen_info'))

            if (!_.isEmpty(cookies.get('authen_info'))) {

                const { Auth } = cookies.get('authen_info')

                setAuthentication(Auth)

                getOrganizationTem(Auth)
            }
            else {
                // window.location.href = 'http://tc001pcis1u/login/'
                window.location.href = 'http://tc001pcis1p:8099/pcis/'
            }
        }
        else {
            this.props.authenticate({ username: 't58385' })

            this.props.getOrganizationTem({ EmployeeCode: '58385' })
            // setAuthentication({
            //     EmployeeCode: '58385',
            //     EmpName_TH: 'เจนวิทย์ เลิศสินอธิชัย',
            //     RoleId: '6',
            // })
        }
    }


    openMenu = () => {
        this.props.setOnOpenMainMenu(!this.props.IS_OPEN_MAIN_MENU)
    }

    render() {
        const { AUTH_INFO } = this.props

        const menu = (
            <Menu>
                <Menu.Item disabled>
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Avatar src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${AUTH_INFO.EmployeeCode}`} style={{ marginRight: '5px' }} size="large" />
                        <div style={{ display: 'flex', flex: '1', flexDirection: 'column', color: 'rgba(39, 39, 39, 0.7)', fontSize: '12px' }}>
                            <span style={{ whiteSpace: 'nowrap' }}>{AUTH_INFO.EmpName_TH}</span>
                            <span style={{ whiteSpace: 'nowrap' }}>Work Period {AUTH_INFO.StartWork}</span>
                        </div>
                    </div>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="0"><Icon type="user" style={{ marginRight: '5px' }} />Profile</Menu.Item>
                <Menu.Item key="1"> <Icon type="setting" style={{ marginRight: '5px' }} />Setting</Menu.Item>
                <Menu.Item key="2"> <Icon type="solution" style={{ marginRight: '5px' }} />Contact</Menu.Item>
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
                        <div className={styles['toolbar-profile-header']} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div ><Tooltip title="TCRB War Room"><Badge count={0}><Icon type="share-alt" style={{ fontSize: '18px', padding: '4px', marginTop: '3px', color: '#043ba3' }} /></Badge></Tooltip></div>
                            <div ><Tooltip title="Scoreboard"><Badge count={0}><FontAwesome name="trophy" style={{ fontSize: '18px', padding: '4px', marginTop: '3px', color: '#FF9800' }} /></Badge></Tooltip></div>
                            <div style={{ borderLeft: '1px solid #e6e6e6' }}><Tooltip title="News Feed"><Badge count={0}><FontAwesome name="rss" style={{ fontSize: '18px', padding: '4px', marginTop: '3px' }} /></Badge></Tooltip></div>
                            <div ><Tooltip title="Mail"><Badge count={0}><FontAwesome name="envelope-o" style={{ fontSize: '18px', padding: '4px', marginTop: '3px' }} /></Badge></Tooltip></div>
                            <div ><Tooltip title="Chat"><Badge count={0}><Icon type="message" style={{ fontSize: '18px', padding: '4px', marginTop: '3px' }} /></Badge></Tooltip></div>
                            <div ><Tooltip title="Notification"><Badge count={0}><Icon type="bell" style={{ fontSize: '18px', padding: '4px', marginTop: '3px' }} /></Badge></Tooltip></div>
                            <Dropdown
                                placement="bottomRight"
                                overlay={menu}>
                                <div>
                                    <Avatar src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${AUTH_INFO.EmployeeCode}`} style={{ marginRight: '5px' }} />
                                    <span style={{ whiteSpace: 'nowrap' }}>{AUTH_INFO.EmpName_TH}</span>
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </Header>
                <Layout style={{ display: 'flex', flex: '1', flexDirection: 'row', height: '100%', width: '100%', backgroundColor: '#e6eaed' }}>
                    <Menu
                        style={{ height: '100%', boxShadow: '2px 0 6px rgba(0, 21, 41, 0.35)', zIndex: 6 }}
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
                    <Content style={{ margin: '0 16px', width: 'calc(100% - 112px)', flex: '1' }}>
                        <CalendarApp />
                        {/* <OrgChart /> */}
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

const CookiesApp = withCookies(App)

export default connect(
    (state) => ({
        AUTH_INFO: state.AUTH_INFO,
        IS_OPEN_MAIN_MENU: state.IS_OPEN_MAIN_MENU
    }),
    {
        getOrganizationTem, getOrganizationTem,
        setOnOpenMainMenu: setOnOpenMainMenu,
        setAuthentication: setAuthentication,
        authenticate: authenticate
    })(CookiesApp)

