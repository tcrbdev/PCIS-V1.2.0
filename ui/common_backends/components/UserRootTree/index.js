import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Avatar, Tooltip, Badge, Popover, Button, Timeline, Icon, Popconfirm, notification, Divider } from 'antd'
import FontAwesome from 'react-fontawesome'
import Scrollbar from 'react-smooth-scrollbar';

import moment from 'moment'
import _ from 'lodash'

import styles from './index.scss'
import styles_calendar from '../Calendar/index.scss'

class Menu extends Component {

    constructor(props) {
        super(props)

        this.state = {
            parentKeys: null,
            nodeopen: null
        }
    }

    onShow = (parentKeys, keys, item, level) => {
        const { onDrillDown } = this.props

        onDrillDown(item, level)

        this.setState({ parentKeys, nodeopen: keys })
    }

    onHide = () => {
        const { keys, item, level, onBackUp } = this.props

        onBackUp(item, level)

        this.setState({ parentKeys: null, nodeopen: null })
    }

    onBackToHome = () => {
        this.props.onBackToHome()

        this.setState({ parentKeys: null, nodeopen: null })
    }

    render() {
        const { item, itemBefore, level, itemIndex, keys, nodeopen, onHide, onSelect, onDrillDown, onBackUp, onBackToHome } = this.props

        return (
            <div
                key={keys}
                className={`${styles['SubSideMenu-Container']} ${nodeopen == keys ? styles['Menu-Open'] : styles['Menu-Close']} `}
                style={{ zIndex: level }}
                data-key={keys}
                data-level={level}>
                {
                    level > 1 &&
                    <div className="back">
                        <span onClick={() => onHide()}><Icon type="caret-left" style={{ marginRight: '5px' }} /><span>Back</span></span>
                        <span onClick={onBackToHome}><Icon type="home" style={{ marginRight: '5px' }} /><span>Home</span></span>
                    </div>
                }
                <div className="img-profile" onClick={() => onSelect(item, level)}>
                    <Avatar src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${item.EmployeeCode}`} size="large" style={{ width: '90px', height: '90px', borderRadius: '50%' }} />
                    <span>{item.FullNameEng}</span>
                    <span>{item.PositionNameEng} ({item.PositionRef})</span>
                    <span>{item.BranchNameEng} - {item.Ref01}</span>
                </div>
                <div className="detail-profile">
                    <Divider style={{ background: '#FFC107' }} />
                    <span><Icon type="user" style={{ marginRight: '10px', color: '#03A9F4' }} />Employee Code : {item.EmployeeCode}</span>
                    <span><Icon type="line-chart" style={{ marginRight: '10px', color: '#03A9F4' }} />Experience : {item.WorkingYMD} (Y M D)</span>
                    <span><Icon type="desktop" style={{ marginRight: '10px', color: '#03A9F4' }} />Start Working : {moment(item.StartWorkDate).format("DD MMM YYYY")}</span>
                </div>
                <div>
                    <Divider className={styles['divider-team']}><FontAwesome name="sitemap" style={{ marginRight: '5px' }} />Team</Divider>
                </div>
                <div className={styles_calendar['custom-scrollbar']} style={{ flex: '1', height: '100%', overflow: 'auto' }}>
                    <ul>
                        {
                            (item.children || []).length > 0 &&
                            item.children.map((child, index) => {

                                const nextLevel = level + 1
                                const nodeKey = `${keys}_${index + 1}`

                                return (
                                    <li>
                                        <div onClick={() => onSelect(child, level)} >
                                            <Popover
                                                trigger="hover"
                                                content={
                                                    <div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '25px', justifyContent: 'center', alignItems: 'center' }}>
                                                            <Avatar src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${child.EmployeeCode}`} size="large" style={{ width: '90px', height: '90px', borderRadius: '50%' }} />
                                                            <span>{child.FullNameEng}</span>
                                                            <span>{child.PositionNameEng} ({child.PositionRef})</span>
                                                            <span>{child.BranchNameEng} - {child.Ref01}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Divider style={{ background: '#FFC107' }} />
                                                            <span><Icon type="user" style={{ marginRight: '10px', color: '#03A9F4' }} />Employee Code : {child.EmployeeCode}</span>
                                                            <span><Icon type="line-chart" style={{ marginRight: '10px', color: '#03A9F4' }} />Experience : {child.WorkingYMD} (Y M D)</span>
                                                            <span><Icon type="desktop" style={{ marginRight: '10px', color: '#03A9F4' }} />Start Working : {moment(child.StartWorkDate).format("DD MMM YYYY")}</span>
                                                            <span><FontAwesome name="sitemap" style={{ marginRight: '10px', color: '#03A9F4' }} />Team Member : {(child.children || []).length > 0 ? (child.children || []).length : 'none'}</span>
                                                        </div>
                                                    </div>
                                                }>
                                                <Avatar src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${child.EmployeeCode}`} />
                                                <span>{child.FullNameEng}</span>
                                            </Popover>
                                        </div>
                                        {/* {
                                        (child.children || []).length > 0 &&
                                        <Icon type="caret-right" style={{ cursor: 'pointer' }} onClick={() => this.onShow(keys, nodeKey, child, nextLevel)} />
                                    } */}
                                        {/* <Badge count={(child.children || []).length +250} style={{
                                        background: '#03A9F4',
                                        height: '17px',
                                        borderRadius: '17px',
                                        lineHeight: '12px',
                                        padding: '0 5px',
                                        fontSize: '9px',
                                        minWidth: '17px',
                                        border: '2px solid #FFF',
                                        top: '-12px',
                                    }}> */}
                                        <div className="drill-down" onClick={() => this.onShow(keys, nodeKey, child, nextLevel)}>
                                            <Icon type="caret-right" style={{ cursor: 'pointer' }} />
                                        </div>
                                        {/* </Badge> */}
                                        <Menu
                                            keys={nodeKey}
                                            item={child}
                                            itemBefore={item}
                                            level={nextLevel}
                                            itemIndex={index + 1}
                                            nodeopen={this.state.nodeopen}
                                            onHide={this.onHide}
                                            onSelect={onSelect}
                                            onDrillDown={onDrillDown}
                                            onBackUp={onBackUp}
                                            onBackToHome={this.onBackToHome} />
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

class UserRootTree extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isOpen: props.isOpen,
            data: props.ORGANIZATION_TEAM,
            nodeopen: `Item_${1}`,
            keys: `Item_${1}`
        }
    }

    componentWillReceiveProps(nextProps) {
        const { ORGANIZATION_TEAM, isOpen } = nextProps

        if (isOpen != this.state.isOpen) {
            this.setState({ data: ORGANIZATION_TEAM, isOpen })
        }
    }

    closeSideMenu = () => {
        this.props.closeSideMenu()
        this.setState({ isOpen: false })
    }

    onBackToHome = (item, level) => {
        this.setState({ nodeopen: `Item_${1}` })
    }

    onBackUp = (item, level) => {
        if (this.props.onBackUp) {
            this.props.onBackUp(item, level)
        }
    }

    onDrillDown = (item, level) => {
        if (this.props.onDrillDown) {
            this.props.onDrillDown(item, level)
        }
    }

    onSelect = (item, level) => {
        if (this.props.onSelect) {
            this.props.onSelect(item, level)
        }
    }

    render() {
        const { data, isOpen } = this.state

        return (
            <div className={`${styles['SideMenu-Container']} ${isOpen && styles['SideMenu-Container-Open']} `}>
                <div className={styles['SideMenu-Overlay']} onClick={this.closeSideMenu}></div>
                <div className={`${styles['SideMenu-Content']} `}>
                    <div><Tooltip title="Hide"><Icon type="double-left" style={{ cursor: 'pointer' }} onClick={this.closeSideMenu} /></Tooltip></div>
                    <div>
                        {
                            !_.isEmpty(data) &&
                            <Menu
                                keys={this.state.keys}
                                item={data}
                                level={1}
                                itemIndex={1}
                                nodeopen={this.state.nodeopen}
                                onSelect={this.onSelect}
                                onDrillDown={this.onDrillDown}
                                onBackUp={this.onBackUp}
                                onBackToHome={this.onBackToHome} />
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        AUTH_INFO: state.AUTH_INFO,
        EMP_INFO: state.EMP_INFO,
        ORGANIZATION_TEAM: state.ORGANIZATION_TEAM,
    }),
    {
    })(UserRootTree)