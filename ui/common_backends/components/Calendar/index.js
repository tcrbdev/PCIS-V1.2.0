import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'

import { Avatar } from 'antd'

import Calendar from './calendar'

class CalendarApp extends Component {
    render() {
        const { cookies } = this.props
        const auth = cookies.get('authen_info')
        console.log(auth.Session.sess_empcode, auth)
        return (
            <div style={{ height: '100%' }}>
                <div style={{ background: '#FFF', marginLeft: '-16px', marginRight: '-16px', padding: '16px 16px 0 16px', borderBottom: '1px solid #e8e8e8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <Avatar src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${auth.Session.sess_empcode}`} style={{ marginRight: '5px' }} />
                        <span style={{ whiteSpace: 'nowrap' }}>Janewit .L</span>
                    </div>
                </div>
                <div style={{ background: '#FFF', marginTop: '16px', height: '88.5%' }}>
                    <Calendar />
                </div>
            </div>
        )
    }
}

const CookiesCalendarApp = withCookies(CalendarApp)

export default connect(
    (state) => ({
    }),
    {
    })(CookiesCalendarApp)
