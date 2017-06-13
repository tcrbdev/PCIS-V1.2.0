import React, { Component } from 'react'

import EmailForm from '../EmailForm'
import CustomerCalendar from '../CustomerCalendar'
import CustomerTimeline from '../CustomerTimeline'
import { Tabs, Icon } from 'antd';
const TabPane = Tabs.TabPane;

class CustomerTab extends Component {
    render() {
        return (
            <Tabs defaultActiveKey="2">
                <TabPane tab={<span><Icon type="clock-circle-o" />Timeline</span>} key="1">
                    <CustomerTimeline />
                </TabPane>
                <TabPane tab={<span><Icon type="edit" />Action Notes</span>} key="2">
                    Tab 2
                </TabPane>
                <TabPane tab={<span><Icon type="calendar" />Calendar</span>} key="3">
                    <CustomerCalendar />
                </TabPane>
                <TabPane tab={<span><Icon type="mail" />Mail</span>} key="4">
                    <EmailForm />
                </TabPane>
                <TabPane tab={<span><Icon type="folder" />Document</span>} key="5">
                    Tab 2
                </TabPane>
                <TabPane tab={<span><Icon type="bars" />Summary</span>} key="6">
                    Tab 2
                </TabPane>
            </Tabs>
        )
    }
}

export default CustomerTab