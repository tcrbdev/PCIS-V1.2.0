import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Menu, Dropdown, Icon, Button, Tooltip, Popover, Popconfirm } from 'antd'
import FontAwesome from 'react-fontawesome'
import moment from 'moment'

import MiniMap from './minimap'

import styles from './index.scss'

export default class CalendarEventPopInfo extends Component {
    getDeleteButton = () => {
        const { event } = this.props

        if (event.E_IsConfirm == 'Y') {
            return <Button className="popover-event-float-button" shape="circle" type="danger" icon="delete" size="large" disabled />
        }
        else {
            return <Popconfirm
                title="Are you sure delete this event?"
                onConfirm={() => this.props.onDelete(event)}>
                <Tooltip title="Delete Event">
                    <Button className="popover-event-float-button" shape="circle" type="danger" icon="delete" size="large" disabled={event.E_IsConfirm == 'Y' ? true : false} />
                </Tooltip>
            </Popconfirm>
        }
    }

    render() {
        const { event } = this.props

        return (
            <div className={styles['popover-event']}>
                <div style={{ background: `${event.backgroundColor}`, color: `${event.foreColor}` }}>
                    <div>
                        <div>
                            {
                                event.E_IsConfirm == 'Y' &&
                                <Tooltip title="Unlock Confirm Event">
                                    <Icon type="lock"
                                        style={{ cursor: 'pointer', width: '20px', height: '20px', display: 'flex', justifyContent: 'center' }} />
                                </Tooltip>
                            }
                        </div>
                        <div>
                            <Dropdown overlay={
                                <Menu>
                                    {/* <Menu.Item key="0">
                                        <span><Icon type="global" /> Map Location</span>
                                    </Menu.Item> */}
                                    <Menu.Item key="1">
                                        <Icon type="share-alt" /> Invite Event
                                            </Menu.Item>
                                    <Menu.Item key="2" >
                                        <Icon type="link" /> Other
                                            </Menu.Item>
                                </Menu>
                            }
                                trigger={['hover']}
                                placement="bottomRight">
                                <Tooltip title="Option">
                                    <FontAwesome name="ellipsis-v"
                                        style={{ cursor: 'pointer', width: '20px', height: '20px', display: 'flex', justifyContent: 'center' }} />
                                </Tooltip>
                            </Dropdown>
                        </div>
                    </div>
                    <div><Tooltip title={event.title}><span>{event.title}</span></Tooltip></div>
                    {this.getDeleteButton()}
                </div>
                <div>
                    <div>
                        <FontAwesome name="align-left" style={{ width: '15px', marginRight: '20px', marginTop: '4px' }} />
                        <span>{`${event.E_Description}`}</span>
                    </div>
                    <div>
                        <FontAwesome name="map-marker" style={{ width: '15px', marginRight: '20px', marginTop: '4px' }} />
                        <span>{`${event.E_Location}`}</span>
                    </div>
                    <div>
                        <FontAwesome name="calendar-check-o" style={{ width: '15px', marginRight: '20px', marginTop: '4px' }} />
                        <span>{`${moment(event.E_Start).utc().format('ddd, DD MMM YYYY')} - ${moment(event.E_End).utc().format('ddd, DD MMM YYYY')}`}</span>
                    </div>
                    {
                        !event.allday &&
                        <div>
                            <FontAwesome name="clock-o" style={{ width: '15px', marginRight: '20px', marginTop: '4px' }} />
                            <span>{`${moment(event.E_Start).utc().format('HH:mm')} - ${moment(event.E_End).utc().format('HH:mm')}`}</span>
                        </div>
                    }
                </div>
                <div style={{ width: '100%', height: '170px' }}>
                    <MiniMap
                        event={event}
                        containerElement={<div style={{ height: `100%` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                </div>
            </div >
        )

    }
}
